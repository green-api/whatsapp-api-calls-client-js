import {
  CallStatePayload,
  EndCallPayload,
  IncomingCallPayload,
  SocketDisconnectPayload,
} from './signal-socket-types.ts';

export interface GreenApiVoipClientInitOptions {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export interface GreenApiVoipClientEventMap {
  'local-stream-ready': CustomEvent<MediaStream>;
  'remote-stream-ready': CustomEvent<MediaStream>;
  'end-call': CustomEvent<EndCallPayload>;
  'call-state': CustomEvent<CallStatePayload>;
  'incoming-call': CustomEvent<IncomingCallPayload>;
  'socket-connect': CustomEvent<undefined>;
  'socket-disconnect': CustomEvent<SocketDisconnectPayload>;
}
