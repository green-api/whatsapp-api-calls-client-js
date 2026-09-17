import { Addressing } from './address';

export interface UserState {
  credentials: UserCredentials;
  isAuth: boolean;
}

/**
 * The peer the dialler is pointed at, as both of its addresses.
 *
 * Both are kept rather than the one chosen at click time, so that switching the kind of
 * addressing afterwards re-resolves the same peer instead of leaving digits behind that no
 * longer mean anything. Null once the user edits the field: from then on it is theirs.
 */
export interface ActivePeer {
  /** The phone-side chatId, `<number>@c.us` — every contact has one. */
  id: string;
  /** The LID counterpart, when WhatsApp has told us of one. */
  lid?: string;
}

export interface CallState {
  activePeer: ActivePeer | null;
  /**
   * Which kind of address the dialler is working in — a country, or `LID`.
   *
   * It is shared rather than kept inside the dialler because the contact list reads it too:
   * a contact that has both a number and a LID is picked by whichever kind is in play.
   */
  addressing: Addressing;
  /**
   * Whether the kind above was chosen rather than defaulted into.
   *
   * Kept apart from the value because the two are not the same question: picking the United
   * States deliberately leaves `addressing` exactly as it started, and without this flag the
   * instance's own country would overwrite that choice on the next mount.
   */
  addressingChosen: boolean;
  hasActiveCall: boolean;
  socketConnectionInfo: SocketConnectionInfo;
}

export interface UserCredentials {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export interface ApiErrorResponse<T = unknown> {
  status: number | string;
  data: T;
}

export interface SocketConnectionInfo {
  connected: boolean;
  /** Why the socket closed, when the server said. */
  reason?: string;
  /** The server refused rather than the link dropping: there will be no reconnect. */
  permanent?: boolean;
}
