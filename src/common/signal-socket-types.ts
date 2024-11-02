import { CallInfo } from './call-types';
import { EndCallReasonEnum } from './end-call-reason.enum.ts';

export interface IncomingCallPayload {
  timeout: number;
  info: { callId: string; wid: { device: number; domainType: number; type: number; user: string } };
}

export interface CallStatePayload {
  info: {
    callId: string;
    info: CallInfo;
    state: string;
  };
}

export interface EndCallPayload {
  info: {
    context: string;
    incoming: boolean;
  };
  type: EndCallReasonEnum;
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
