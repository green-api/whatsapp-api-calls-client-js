export type CallStateKind = 'idle' | 'inc-call' | 'out-call' | 'on-call';

export interface CallInfo {
  id: string;
  wid: string;
  name: string;
}

export interface CallState {
  state: CallStateKind;
  info?: CallInfo;
  /**
   * Why the call ended. Present only on the frame that moves the call to `idle`, and
   * only when the server named a reason. The server's own word, verbatim: `hangup`,
   * `timeout`, `accepted_elsewhere` (answered on another device of the same account),
   * `rejected_elsewhere`, `no-media`, `connect-timeout`, `instance-gone`,
   * `rejected:<reason>`… The vocabulary is open-ended, so show a word you do not
   * recognise as it came.
   */
  reason?: string;
}

export interface GreenApiVoipClientOptions {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}
