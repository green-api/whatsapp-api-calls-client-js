export interface RequestParams {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export interface GetStateInstanceResponse {
  stateInstance: StateInstanceEnum;
}

export enum StateInstanceEnum {
  Authorized = 'authorized',
  NotAuthorized = 'notAuthorized',
  Blocked = 'blocked',
  SleepMode = 'sleepMode',
  Starting = 'starting',
  YellowCard = 'yellowCard',
  PendingCode = 'pendingCode',
}

export interface Contact {
  id: string;
  name: string;
  contactName?: string;
  type: 'user' | 'group';
}

export type GetContactsResponse = Contact[];

export interface CallRequestParams {
  idInstance: string;
  apiTokenInstance: string;
  phoneNumber: number;
}

export type CallResponse = {
  existsWhatsapp: boolean;
};

export interface GetWaSettingsResponse {
  avatar: string;
  phone: string;
  stateInstance: StateInstanceEnum;
  deviceId: string;
}
