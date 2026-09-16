interface LoggerStyle {
  color: string;
  fontSize: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __WA_LOG_DEBUG: boolean | undefined;
}

export function isDebugLogEnabled(): boolean {
  if (typeof globalThis.__WA_LOG_DEBUG === 'boolean') return globalThis.__WA_LOG_DEBUG;
  try {
    return globalThis.localStorage?.getItem('waLogDebug') === '1';
  } catch {
    return false;
  }
}

export function j(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

export class Logger {
  readonly #prefix: string;
  readonly #style: Partial<LoggerStyle>;
  public constructor(prefix: string = '', style?: Partial<LoggerStyle>) {
    this.#prefix = prefix;
    this.#style = { ...style };
  }

  public info(message: string, ...args: unknown[]) {
    console.log(...this.#makeLogArgs(message, args));
  }
  public warn(message: string, ...args: unknown[]) {
    console.warn(...this.#makeLogArgs(message, args));
  }
  public error(message: string, ...args: unknown[]) {
    console.error(...this.#makeLogArgs(message, args));
  }

  public debug(message: string, ...args: unknown[]) {
    if (!isDebugLogEnabled()) return;
    console.debug(...this.#makeLogArgs(message, args));
  }

  public logDebugIfEnabled(fn: () => [message: string, ...args: unknown[]] | string) {
    if (!isDebugLogEnabled()) return;
    const res = fn();
    const message = Array.isArray(res) ? res[0] : res;
    const args = Array.isArray(res) ? res.slice(1) : [];
    console.debug(...this.#makeLogArgs(message, args));
  }

  public log(message: string, ...args: unknown[]) {
    return this.info(message, ...args);
  }

  public child(prefix: string, style?: Partial<LoggerStyle>): Logger {
    return new Logger(`${this.#prefix} ${prefix}`, { ...this.#style, ...style });
  }

  public get isDebugEnabled(): boolean {
    return isDebugLogEnabled();
  }

  #makeLogArgs(message: string, args: unknown[]): unknown[] {
    return [`%c${this.#prefix} ${message}`, this.#styleStr, ...args];
  }

  get #styleStr(): string {
    let res = '';
    if (this.#style.color) {
      res += `color:${this.#style.color};`;
    }
    if (this.#style.fontSize) {
      res += `font-size:${this.#style.fontSize}px`;
    }
    return res;
  }
}
