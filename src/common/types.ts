import {
  CallStateEventPayload,
  EndCallPayload,
  IncomingCallPayload,
  SocketDisconnectPayload,
} from './signal-socket-types';

export interface GreenApiVoipClientInitOptions {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export interface GreenApiVoipClientEventMap {
  'local-stream-ready': CustomEvent<MediaStream>;
  'remote-stream-ready': CustomEvent<MediaStream>;
  'end-call': CustomEvent<EndCallPayload>;
  'call-state': CustomEvent<CallStateEventPayload>;
  'incoming-call': CustomEvent<IncomingCallPayload>;
  'socket-connect': CustomEvent<undefined>;
  'socket-disconnect': CustomEvent<SocketDisconnectPayload>;
}
