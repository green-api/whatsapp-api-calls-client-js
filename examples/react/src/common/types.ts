import { SocketDisconnectPayload } from './signal-socket-types';

export interface UserState {
  credentials: UserCredentials;
  isAuth: boolean;
}

export interface CallState {
  activePhoneNumber: string;
  hasActiveCall: boolean;
  socketConnectionInfo: SocketConnectionInfo;
}

export interface UserCredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface ApiErrorResponse<T = unknown> {
  status: number | string;
  data: T;
}

export interface SocketConnectionInfo extends SocketDisconnectPayload {
  connected: boolean;
}
