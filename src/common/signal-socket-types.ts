import { CallInfo } from './call-types';

export interface IncomingCallPayload {
  timeout: number;
  info: { callId: string; wid: { device: number; domainType: number; type: number; user: string; } };
}

export interface CallStatePayload {
  info: CallInfo;
}

export interface AddPeerPayload {
  peerID: string;
  createOffer: boolean;
}

export interface SessionDescriptionPayload {
  peerID: string;
  sessionDescription: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  peerID: string;
  iceCandidate: RTCIceCandidate;
}

export interface RemovePeerPayload {
  peerID: string;
}
