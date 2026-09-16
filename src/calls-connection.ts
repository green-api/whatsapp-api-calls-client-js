import { ReconnectingSocket } from './reconnecting-socket';
import { GreenApiRestClient } from './rest-client';
import { CallInfo, CallState, CallStateKind } from './types';

const CALL_STATE_KINDS: ReadonlySet<CallStateKind> = new Set(['inc-call', 'out-call', 'on-call']);

function isCallState(kind: CallStateKind): boolean {
  return CALL_STATE_KINDS.has(kind);
}

export interface CallsConnectionEventMap {
  connect: CustomEvent<undefined>;
  /**
   * `permanent` means the server refused rather than the link dropping: calls are not in
   * the instance's plan, or they are switched off on the node. There will be no reconnect,
   * and this connection can no longer place calls — make a new one.
   */
  disconnect: CustomEvent<{ reason: string; code?: number; permanent?: boolean }>;
  state: CustomEvent<CallState>;
  'incoming-call': CustomEvent<CallInfo>;
  /**
   * `reason` says whose decision it was: `call-ended` — the server ended the call (the
   * peer, a timeout, another device); `connection-lost` — our own socket dropped.
   * `cause` is the server's word from the `idle` frame (see `CallState.reason`) when there
   * was one: `accepted_elsewhere`, `hangup`, `timeout`… It is absent on `connection-lost`.
   */
  'end-call': CustomEvent<{ reason: 'call-ended' | 'connection-lost'; cause?: string }>;
  'local-stream-ready': CustomEvent<MediaStream>;
  'remote-stream-ready': CustomEvent<MediaStream>;
  error: CustomEvent<{ message: string }>;
}

export interface CallsConnection extends EventTarget {
  addEventListener<K extends keyof CallsConnectionEventMap>(
    type: K,
    listener: (this: CallsConnection, ev: CallsConnectionEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof CallsConnectionEventMap>(
    type: K,
    listener: (this: CallsConnection, ev: CallsConnectionEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

type RtcMessage =
  | { type: 'state'; state: CallState }
  | { type: 'answer'; answer: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; candidate: RTCIceCandidateInit }
  | { type: 'error'; message: string };

export class CallsConnection extends EventTarget {
  readonly #rest: GreenApiRestClient;
  readonly #socket: ReconnectingSocket;
  #state: CallState | null = null;
  #peerConnection: RTCPeerConnection | null = null;
  #localStream: MediaStream | null = null;
  #pendingRemoteCandidates: RTCIceCandidateInit[] = [];
  #remoteDescriptionSet = false;
  #pendingBridge: { resolve: () => void; reject: (error: Error) => void } | null = null;
  // The bridge was up when the socket dropped: on reconnect, if the call is still running
  // on the server, WebRTC has to be re-established by us.
  #resumePending = false;
  /** The error frame has already told the listener why the server is closing the socket. */
  #refusalReported = false;

  public constructor(rest: GreenApiRestClient) {
    super();
    this.#rest = rest;
    this.#socket = new ReconnectingSocket(rest.buildWsUrl('callsRtc'));
    this.#socket.addEventListener('connect', () => this.dispatchEvent(new CustomEvent('connect')));
    this.#socket.addEventListener('disconnect', (event) =>
      this.#onSocketDisconnect(event.detail.reason, event.detail.code, event.detail.permanent),
    );
    this.#socket.addEventListener(
      'message',
      (event) => void this.#onMessage(event.detail as RtcMessage),
    );
  }

  public get state(): CallState | null {
    return this.#state;
  }

  /** Whether a WebRTC bridge is up right now (not merely an active call on the server). */
  public get hasAudioBridge(): boolean {
    return this.#peerConnection !== null;
  }

  public startAudioBridge(): Promise<void> {
    if (this.#peerConnection || this.#pendingBridge) {
      return Promise.reject(new Error('Audio bridge already starting or active'));
    }
    return new Promise<void>((resolve, reject) => {
      this.#pendingBridge = { resolve, reject };
      this.#startAudioBridgeInternal().catch((error: unknown) => {
        if (!this.#pendingBridge) return;
        this.#pendingBridge = null;
        this.#teardownBridge(false);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }

  public async stopAudioBridge(): Promise<void> {
    this.#resumePending = false;
    this.#teardownBridge(true);
  }

  public close(): void {
    this.#resumePending = false;
    this.#teardownBridge(false);
    this.#socket.close();
  }

  async #startAudioBridgeInternal(): Promise<void> {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.#localStream = localStream;
    this.dispatchEvent(new CustomEvent('local-stream-ready', { detail: localStream }));

    const iceServers = await this.#rest.get<RTCIceServer[]>('callsGetIceServers');
    const pc = new RTCPeerConnection({ iceServers });
    this.#peerConnection = pc;
    this.#remoteDescriptionSet = false;
    this.#pendingRemoteCandidates = [];

    for (const track of localStream.getTracks()) {
      pc.addTrack(track, localStream);
    }
    pc.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        this.#socket.send({ type: 'ice-candidate', candidate: event.candidate.toJSON() });
      }
    });
    pc.addEventListener('track', (event) => {
      this.dispatchEvent(new CustomEvent('remote-stream-ready', { detail: event.streams[0] }));
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.#socket.send({ type: 'offer', offer });
  }

  #teardownBridge(notifyServer: boolean): void {
    if (notifyServer && this.#peerConnection) {
      this.#socket.send({ type: 'stop' });
    }
    this.#peerConnection?.close();
    this.#peerConnection = null;
    this.#localStream?.getTracks().forEach((track) => track.stop());
    this.#localStream = null;
    this.#pendingRemoteCandidates = [];
    this.#remoteDescriptionSet = false;
  }

  async #onMessage(message: RtcMessage): Promise<void> {
    switch (message.type) {
      case 'state':
        this.#onState(message.state);
        return;
      case 'answer': {
        if (!this.#peerConnection) return;
        await this.#peerConnection.setRemoteDescription(message.answer);
        this.#remoteDescriptionSet = true;
        for (const candidate of this.#pendingRemoteCandidates) {
          await this.#peerConnection.addIceCandidate(candidate);
        }
        this.#pendingRemoteCandidates = [];
        this.#pendingBridge?.resolve();
        this.#pendingBridge = null;
        return;
      }
      case 'ice-candidate':
        if (this.#remoteDescriptionSet) {
          await this.#peerConnection?.addIceCandidate(message.candidate);
        } else {
          this.#pendingRemoteCandidates.push(message.candidate);
        }
        return;
      case 'error': {
        if (this.#pendingBridge) {
          const pending = this.#pendingBridge;
          this.#pendingBridge = null;
          this.#teardownBridge(false);
          pending.reject(new Error(message.message));
          return;
        }
        this.#refusalReported = true;
        this.dispatchEvent(new CustomEvent('error', { detail: { message: message.message } }));
        return;
      }
    }
  }

  #onState(state: CallState): void {
    const prevKind = this.#state?.state;
    this.#state = state;
    this.dispatchEvent(new CustomEvent('state', { detail: state }));

    if (state.state === 'inc-call' && prevKind !== 'inc-call' && state.info) {
      this.dispatchEvent(new CustomEvent('incoming-call', { detail: state.info }));
      return;
    }

    if (prevKind && isCallState(prevKind) && !isCallState(state.state)) {
      this.#resumePending = false;
      this.#teardownBridge(true);
      this.dispatchEvent(
        new CustomEvent('end-call', {
          detail: state.reason
            ? { reason: 'call-ended', cause: state.reason }
            : { reason: 'call-ended' },
        }),
      );
      return;
    }

    // The socket came back and the call is still running on the server: the bridge died
    // with the old socket (see #onSocketDisconnect), so WebRTC is raised again from the
    // same side as the original dial/accept.
    if (
      this.#resumePending &&
      isCallState(state.state) &&
      !this.#peerConnection &&
      !this.#pendingBridge
    ) {
      this.#resumePending = false;
      void this.#resumeAudioBridge();
    }
  }

  async #resumeAudioBridge(): Promise<void> {
    try {
      await this.startAudioBridge();
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: { message: error instanceof Error ? error.message : String(error) },
        }),
      );
    }
  }

  #onSocketDisconnect(reason: string, code?: number, permanent?: boolean): void {
    const prevKind = this.#state?.state;
    if (prevKind && isCallState(prevKind)) {
      // The old bridge is dead along with the socket anyway (the server tears the agent's
      // RTC down as soon as callsRtc drops), so close it locally. If the bridge really was
      // up, wait for the reconnect and re-establish it instead of calling the call over.
      this.#resumePending = this.#peerConnection !== null;
      if (this.#pendingBridge) {
        // An unfinished offer/answer over a dead socket will never be answered.
        const pending = this.#pendingBridge;
        this.#pendingBridge = null;
        pending.reject(new Error('Socket disconnected during negotiation'));
      }
      this.#teardownBridge(false);
      // Waiting for a reconnect only makes sense if one is coming; after a refusal it is not.
      if (permanent) {
        this.#resumePending = false;
      }
      if (!this.#resumePending) {
        this.#state = null;
        this.dispatchEvent(new CustomEvent('end-call', { detail: { reason: 'connection-lost' } }));
      }
    } else {
      this.#state = null;
    }

    if (permanent && !this.#refusalReported) {
      // The reason for a refusal arrives as an error frame, but the socket may close before
      // that frame lands: then the close code carries it, or the listener would be left with
      // a silent drop.
      this.dispatchEvent(new CustomEvent('error', { detail: { message: reason } }));
    }
    this.#refusalReported = false;

    this.dispatchEvent(new CustomEvent('disconnect', { detail: { reason, code, permanent } }));
  }
}
