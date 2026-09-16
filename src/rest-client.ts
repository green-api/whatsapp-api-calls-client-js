export class GreenApiRestClient {
  readonly #idInstance: string;
  readonly #apiTokenInstance: string;
  readonly #apiUrl: string;

  public constructor(options: { idInstance: string; apiTokenInstance: string; apiUrl: string }) {
    this.#idInstance = options.idInstance;
    this.#apiTokenInstance = options.apiTokenInstance;
    this.#apiUrl = options.apiUrl.replace(/\/+$/, '');
  }

  public buildUrl(method: string): string {
    return `${this.#apiUrl}/waInstance${this.#idInstance}/${method}/${this.#apiTokenInstance}`;
  }

  public buildWsUrl(method: string): string {
    return this.buildUrl(method).replace(/^http/, 'ws');
  }

  public get<T>(method: string): Promise<T> {
    return this.#request<T>(method, { method: 'GET' });
  }

  public post<T = void>(method: string, body?: unknown): Promise<T> {
    return this.#request<T>(method, {
      method: 'POST',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async #request<T>(method: string, init: RequestInit): Promise<T> {
    const response = await fetch(this.buildUrl(method), init);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`${method} failed: ${response.status} ${text}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }
}
