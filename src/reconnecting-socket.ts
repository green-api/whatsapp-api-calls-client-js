export interface ReconnectingSocketEventMap {
  connect: CustomEvent<undefined>;
  /**
   * `permanent` means the server closed the socket with a code of its own (4000–4999):
   * calls are not in the instance's plan, or they are switched off on the node.
   * Reconnecting cannot fix that, so no reconnect is attempted.
   */
  disconnect: CustomEvent<{ reason: string; code: number; permanent: boolean }>;
  message: CustomEvent<unknown>;
}

export interface ReconnectingSocket extends EventTarget {
  addEventListener<K extends keyof ReconnectingSocketEventMap>(
    type: K,
    listener: (this: ReconnectingSocket, ev: ReconnectingSocketEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ReconnectingSocketEventMap>(
    type: K,
    listener: (this: ReconnectingSocket, ev: ReconnectingSocketEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

const INITIAL_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 10_000;

/**
 * The range of close codes the server reserves for its own refusals. A dropped network
 * arrives as 1006 and is cured by reconnecting; a refusal by plan is not, and a client
 * that keeps asking is banging on a wall instead of saying what is wrong.
 */
const PERMANENT_CLOSE_MIN = 4000;
const PERMANENT_CLOSE_MAX = 4999;

export class ReconnectingSocket extends EventTarget {
  readonly #url: string;
  #socket: WebSocket | null = null;
  #closedByUser = false;
  #refusedByServer = false;
  #backoffMs = INITIAL_BACKOFF_MS;
  #reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  public constructor(url: string) {
    super();
    this.#url = url;
    this.#connect();
  }

  public send(data: unknown): void {
    if (this.#socket?.readyState !== WebSocket.OPEN) {
      throw new Error('ReconnectingSocket is not connected');
    }
    this.#socket.send(JSON.stringify(data));
  }

  /** The server refused: the socket is closed and will not reconnect until a new one is made. */
  public get refused(): boolean {
    return this.#refusedByServer;
  }

  public close(): void {
    this.#closedByUser = true;
    if (this.#reconnectTimer !== null) {
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
    }
    this.#socket?.close();
    this.#socket = null;
  }

  #connect(): void {
    const socket = new WebSocket(this.#url);
    this.#socket = socket;

    socket.addEventListener('open', () => {
      this.#backoffMs = INITIAL_BACKOFF_MS;
      this.dispatchEvent(new CustomEvent('connect'));
    });

    socket.addEventListener('message', (event) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }
      this.dispatchEvent(new CustomEvent('message', { detail: parsed }));
    });

    socket.addEventListener('close', (event) => {
      if (this.#socket !== socket) return;
      this.#socket = null;
      if (this.#closedByUser) return;

      const permanent = event.code >= PERMANENT_CLOSE_MIN && event.code <= PERMANENT_CLOSE_MAX;
      this.#refusedByServer = this.#refusedByServer || permanent;

      this.dispatchEvent(
        new CustomEvent('disconnect', {
          detail: {
            reason: event.reason || 'connection closed',
            code: event.code,
            permanent,
          },
        }),
      );

      if (permanent) return;

      this.#scheduleReconnect();
    });

    socket.addEventListener('error', () => {
      socket.close();
    });
  }

  #scheduleReconnect(): void {
    const delay = this.#backoffMs;
    this.#backoffMs = Math.min(this.#backoffMs * 2, MAX_BACKOFF_MS);
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      this.#connect();
    }, delay);
  }
}
