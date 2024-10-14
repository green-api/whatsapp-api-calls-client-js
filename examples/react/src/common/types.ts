export interface UserState {
  credentials: UserCredentials;
  isAuth: boolean;
}

export interface UserCredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface ApiErrorResponse<T = unknown> {
  status: number | string;
  data: T;
}
