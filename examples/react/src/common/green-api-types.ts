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
  /**
   * The same peer's LID, when WhatsApp has told us of one: `171833135505654@lid`.
   *
   * Empty or absent for most contacts — a LID appears once the peer has been reached in a
   * context that uses one, so a contact list holds a mix of both kinds.
   */
  lid?: string;
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

/** What getAvatar answers. `urlAvatar` is empty when the peer has none or hides it. */
export interface GetAvatarResponse {
  urlAvatar: string;
  available: boolean;
  reason?: string;
}
