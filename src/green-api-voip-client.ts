import { CallsConnection } from './calls-connection';
import { GreenApiRestClient } from './rest-client';
import { CallState, GreenApiVoipClientOptions } from './types';

function dialTargetToChatId(target: string): string {
  return target.includes('@') ? target : `${target}@c.us`;
}

export class GreenApiVoipClient {
  readonly #rest: GreenApiRestClient;

  public constructor(options: GreenApiVoipClientOptions) {
    this.#rest = new GreenApiRestClient(options);
  }

  public getCallState(): Promise<CallState> {
    return this.#rest.get('callsState');
  }

  public getIceServers(): Promise<RTCIceServer[]> {
    return this.#rest.get('callsGetIceServers');
  }

  public async dial(target: string): Promise<void> {
    await this.#rest.post('callsDial', { chatId: dialTargetToChatId(target) });
  }

  public async accept(): Promise<void> {
    await this.#rest.post('callsAccept');
  }

  public async reject(): Promise<void> {
    await this.#rest.post('callsReject');
  }

  public async hangUp(): Promise<void> {
    await this.#rest.post('callsHangUp');
  }

  public connectCalls(): CallsConnection {
    return new CallsConnection(this.#rest);
  }
}
