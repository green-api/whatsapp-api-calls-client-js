import { io } from 'socket.io-client';

import { EndCallReasonEnum } from './common/end-call-reason.enum.ts';
import { call } from './utils';
import { timeout } from './utils/timeout.ts';
import { Call } from 'call.ts';
import {
  Actions,
  AddPeerPayload,
  CallStatePayload,
  EndCallPayload,
  GreenApiVoipClientEventMap,
  GreenApiVoipClientInitOptions,
  IceCandidatePayload,
  IncomingCallPayload,
  RemovePeerPayload,
  SessionDescriptionPayload,
  SocketDisconnectPayload,
} from 'common';

export interface GreenApiVoipClient extends EventTarget {
  addEventListener<K extends keyof GreenApiVoipClientEventMap>(
    type: K,
    listener: (this: GreenApiVoipClient, ev: GreenApiVoipClientEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof GreenApiVoipClientEventMap>(
    type: K,
    listener: (this: GreenApiVoipClient, ev: GreenApiVoipClientEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

export class GreenApiVoipClient extends EventTarget {
  private readonly socket: ReturnType<typeof io>;
  private readonly connectPromise: Promise<void>;

  private peerConnections: Record<string, RTCPeerConnection> = {};
  private localMediaStream: MediaStream | null = null;
  private remoteMediaStream: MediaStream | null = null;
  private options: GreenApiVoipClientInitOptions | null = null;

  private incomingCallTimeout: ReturnType<typeof setTimeout> | null = null;
  private call: Call | null = null;

  public constructor() {
    super();

    const iceServers = JSON.parse(
      import.meta.env.VITE_RTC_ICE_SERVERS.toString().replace(/\n/g, '').replace(/\s/g, '')
    );

    console.log(iceServers);

    let resolveCallback: (value: void | PromiseLike<void>) => void;

    this.connectPromise = new Promise((resolve) => {
      resolveCallback = resolve;
    });

    this.socket = io(import.meta.env.VITE_SIGNALING_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });

    this.socket.on('connect', () => {
      console.log('socket connected: ', this.socket.connected, this.socket);

      this.onSocketConnect();

      resolveCallback();
    });

    this.socket.on('connect_error', (err) => {
      console.error(err);
      throw err;
    });

    this.socket.on('disconnect', (reason, details) => this.onSocketDisconnect({ reason, details }));

    this.socket.on(Actions.ADD_PEER, this.onNewPeer);
    this.socket.on(Actions.REMOVE_PEER, this.onRemovePeer);
    this.socket.on(Actions.SESSION_DESCRIPTION, this.onRemoteMedia);
    this.socket.on(Actions.ICE_CANDIDATE, this.onIceCandidate);
    this.socket.on(Actions.INCOMING_CALL, this.onIncomingCall);
    this.socket.on(Actions.CALL_STATE, this.onCallState);
    this.socket.on(Actions.END_CALL, this.onEndCall);
  }

  /**
   * Method destroys connection with signaling socket server.
   */
  public destroy() {
    this.socket.disconnect();
  }

  public reload() {
    this.socket.disconnect();
    this.socket.connect();
  }

  /**
   * Method connects to signaling socket server. If already connected won't do anything.
   */
  public async init(options: GreenApiVoipClientInitOptions) {
    this.options = options;

    // TODO: Need to add some validation for GreenAPI credentials. Maybe call some GET method (GetStateInstance)

    if (this.socket.connected) {
      return;
    }

    this.socket.auth = {
      idInstance: this.options.idInstance,
      apiInstanceToken: this.options.apiTokenInstance,
      type: 'external',
    };

    this.socket.connect();

    return this.connectPromise;
  }

  //#region socket events

  private onNewPeer = async ({ peerID, createOffer }: AddPeerPayload) => {
    if (peerID in this.peerConnections) {
      console.warn(`Already connected to peer ${peerID}`);
      return;
    }

    if (this.localMediaStream == null) {
      console.warn(`Local media stream in not available while new peer handled ${peerID}`);
      return;
    }

    const iceServers = JSON.parse(
      import.meta.env.VITE_RTC_ICE_SERVERS.toString().replace(/\n/g, '').replace(/\s/g, '')
    );

    console.log(iceServers);

    this.peerConnections[peerID] = new RTCPeerConnection({
      iceServers: iceServers,
    });

    this.peerConnections[peerID].addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        this.socket.emit(Actions.RELAY_ICE, {
          peerID: peerID,
          iceCandidate: event.candidate,
        });
      }
    });

    this.peerConnections[peerID].addEventListener('track', ({ streams: [remoteStream] }) => {
      this.remoteMediaStream = remoteStream;

      this.dispatchEvent(
        new CustomEvent(Actions.REMOTE_STREAM_READY, { detail: this.remoteMediaStream })
      );
    });

    for (const track of this.localMediaStream.getTracks()) {
      this.peerConnections[peerID].addTrack(track, this.localMediaStream);
    }

    if (createOffer) {
      const offer = await this.peerConnections[peerID].createOffer();

      await this.peerConnections[peerID].setLocalDescription(offer);

      this.socket.emit(Actions.RELAY_SDP, {
        peerID,
        sessionDescription: offer,
      });
    }
  };

  private onRemovePeer = ({ peerID }: RemovePeerPayload) => {
    if (peerID in this.peerConnections) {
      this.peerConnections[peerID].close();
    }

    if (this.peerConnections[peerID]) {
      delete this.peerConnections[peerID];
    }
  };

  private onRemoteMedia = async ({ peerID, sessionDescription }: SessionDescriptionPayload) => {
    await this.peerConnections[peerID].setRemoteDescription(
      new RTCSessionDescription(sessionDescription)
    );

    if (sessionDescription.type === 'offer') {
      const answer = await this.peerConnections[peerID].createAnswer();

      await this.peerConnections[peerID].setLocalDescription(answer);

      this.socket.emit(Actions.RELAY_SDP, {
        peerID,
        sessionDescription: answer,
      });
    }
  };

  private onIceCandidate = async ({ peerID, iceCandidate }: IceCandidatePayload) => {
    await this.peerConnections[peerID].addIceCandidate(new RTCIceCandidate(iceCandidate));
  };

  private onIncomingCall = (payload: IncomingCallPayload) => {
    this.incomingCallTimeout = setTimeout(() => {
      this.incomingCallTimeout = null;
      this.dispatchEvent(
        new CustomEvent(Actions.END_CALL, { detail: { type: EndCallReasonEnum.TIMEOUT } })
      );
    }, payload.timeout * 1000);

    this.call = new Call({ id: payload.info.callId });
    this.dispatchEvent(new CustomEvent(Actions.INCOMING_CALL, { detail: payload }));
  };

  private onCallState = (payload: CallStatePayload) => {
    this.dispatchEvent(new CustomEvent(Actions.CALL_STATE, { detail: payload }));
  };

  private onEndCall = (payload: EndCallPayload) => {
    this.clearIncomingCallTimeout();
    this.socket.emit(Actions.LEAVE, { callID: this.options!.idInstance });
    this.call = null;
    this.dispatchEvent(
      new CustomEvent(Actions.END_CALL, {
        detail: { type: EndCallReasonEnum.REMOTE, payload: payload },
      })
    );
  };

  private onSocketConnect = () => {
    new CustomEvent(Actions.SOCKET_CONNECT);
  };

  private onSocketDisconnect = (payload: SocketDisconnectPayload) => {
    new CustomEvent(Actions.SOCKET_DISCONNECT, { detail: payload });
  };
  //#endregion

  /**
   * Method sends request to start whatsapp call.
   */
  public async startCall(phoneNumber: number, audio = true, video = true) {
    if (!this.options) {
      throw new Error("idInstance and apiTokenInstance doesn't exists");
    }

    if (this.call !== null) {
      throw new Error('Already in call');
    }

    try {
      if (this.incomingCallTimeout !== null) {
        this.clearIncomingCallTimeout();
        await this.rejectCall();
      }

      this.localMediaStream = await this.startCapture({ audio: audio, video: video });

      this.dispatchEvent(
        new CustomEvent(Actions.LOCAL_STREAM_READY, { detail: this.localMediaStream })
      );
    } catch {
      throw new Error('cannot get capture of audio or video');
    }

    const response = await call(phoneNumber, this.options);

    if (response.status === 200) {
      const { callId } = await response.json();

      this.call = new Call({ id: callId });
    } else {
      throw new Error('Server error');
    }

    // WARN: do not change callID because it`s any time is idInstance
    // TODO: change callId from idInstance to something another
    const ack = await this.socket.emitWithAck(Actions.JOIN, { callID: this.options.idInstance });

    if (!ack) {
      this.call = null;
      throw new Error('signaling server error');
    }
  }

  /**
   * Method accepts incoming call from whatsapp.
   */
  public async acceptCall(audio = true, video = true) {
    if (!this.options) {
      throw new Error("idInstance and apiTokenInstance doesn't exists");
    }

    if (this.call === null) {
      throw new Error('Not in call');
    }

    if (this.incomingCallTimeout === null) {
      throw new Error('Incoming call timeout');
    }

    this.clearIncomingCallTimeout();

    try {
      this.localMediaStream = await this.startCapture({ audio: audio, video: video });

      this.dispatchEvent(
        new CustomEvent(Actions.LOCAL_STREAM_READY, { detail: this.localMediaStream })
      );
    } catch (error) {
      throw new Error('cannot get capture of audio or video');
    }

    this.socket.emit(Actions.INCOMING_CALL_ANSWER, { reject: false });
    this.socket.emit(Actions.JOIN, { callID: this.options.idInstance });
  }

  /**
   * Method rejects incoming call from whatsapp.
   */
  public async rejectCall() {
    if (this.call === null) {
      throw new Error('Not in call');
    }

    if (this.incomingCallTimeout === null) {
      throw new Error('Incoming call timeout');
    }

    this.dispatchEvent(
      new CustomEvent(Actions.END_CALL, { detail: { type: EndCallReasonEnum.REJECTED } })
    );
    this.socket.emit(Actions.INCOMING_CALL_ANSWER, { reject: true });
  }

  /**
   * Method closes p2p connection and sends event, that you disconnect from call room to all participants.
   */
  public async endCall(): Promise<boolean> {
    if (this.call === null) {
      throw new Error('Not in call');
    }

    if (this.incomingCallTimeout !== null) {
      throw new Error('Incoming call');
    }

    try {
      this.localMediaStream?.getTracks().forEach((track) => track.stop());

      for (const peerId in this.peerConnections) {
        if (peerId in this.peerConnections) {
          this.peerConnections[peerId].close();
          delete this.peerConnections[peerId];
        }
      }

      const ack = await timeout(this.socket.emitWithAck(Actions.END_CALL, {}), 5_000);

      if (ack) {
        this.call = null;
        this.dispatchEvent(
          new CustomEvent(Actions.END_CALL, { detail: { type: EndCallReasonEnum.SELF } })
        );
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  private startCapture(options?: MediaStreamConstraints) {
    return navigator.mediaDevices.getUserMedia(options);
  }

  private clearIncomingCallTimeout() {
    if (this.incomingCallTimeout !== null) {
      clearTimeout(this.incomingCallTimeout);
      this.incomingCallTimeout = null;
    }
  }
}
