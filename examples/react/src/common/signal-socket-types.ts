import { CallInfo } from './call-types';

export interface IncomingCallPayload {
  timeout: number;
  info: { callId: string; wid: { device: number; domainType: number; type: number; user: string } };
}

export interface EndCallPayload {
  info: {
    context: string;
    incoming: boolean;
  };
  type: EndCallReasonEnum;
}

export interface CallStatePayload {
  info: {
    info: {
      callId: string;
      callInfo: CallInfo;
      state: string;
    };
  };
}

export enum EndCallReasonEnum {
  SELF,
  REMOTE,
  REJECTED,
  TIMEOUT,
}

export interface SocketDisconnectPayload {
  reason?: SocketDisconnectReason;
  details?: unknown;
}

export type SocketDisconnectReason =
  | 'io server disconnect'
  | 'io client disconnect'
  | 'ping timeout'
  | 'transport close'
  | 'transport error'
  | 'parse error';
