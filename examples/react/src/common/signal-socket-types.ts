import { CallInfo } from './call-types';

export interface IncomingCallPayload {
  timeout: number;
  info: CallInfo;
}

export interface CallStatePayload {
  info: CallInfo;
}
