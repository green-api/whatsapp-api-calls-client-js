import { Socket } from 'socket.io-client';

declare interface CallActiveTime {
    sec: number;
    msec: number;
}

declare interface CallInfo {
    callId: string;
    callerStatus: number | boolean;
    callActiveTime: CallActiveTime;
    callDuration: number;
    call_result: number;
    call_setup_error_type: number;
    bytes_sent: number;
    bytes_received: number;
    video_enabled_at_call_start: number;
    video_enabled: number;
    video_capture_started: number;
    video_preview_started: number;
    self_camera_front_facing: number;
    video_codec: number;
    aec_mode: number;
    isGroupCall: boolean;
    enable_group_call: number;
    is_group_call_created_on_server: number;
    initial_group_transaction_id: number;
    participantCount: number;
    participants?: ParticipantsEntity[] | null;
    canInviteNewParticipant: boolean;
    canSwitchAudioVideo: boolean;
    call_waiting_info: CallWaitingInfo;
}

declare interface CallLogInfo {
    tx_bytes: string;
    rx_bytes: string;
    result: number;
    group_call_logs?: null[] | null;
    group_call_log_count: number;
    video_enabled: number;
    call_duration: number;
    caller_status: number;
    initial_peer_raw_jid: string;
    initial_group_transaction_id: number;
}

declare interface CallStatePayload {
    info: {
        callId: string;
        info: CallInfo;
        state: string;
    };
}

declare interface CallWaitingInfo {
    type: number;
    call_id: string;
    peer_count: number;
    peer_raw_jids?: null[] | null;
    video_enabled: number;
    is_caller: number;
    duration: number;
    is_ended_by_self: number;
    call_log_info: CallLogInfo;
}

export declare interface GreenApiVoipClient extends EventTarget {
    addEventListener<K extends keyof GreenApiVoipClientEventMap>(type: K, listener: (this: GreenApiVoipClient, ev: GreenApiVoipClientEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof GreenApiVoipClientEventMap>(type: K, listener: (this: GreenApiVoipClient, ev: GreenApiVoipClientEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export declare class GreenApiVoipClient extends EventTarget {
    private readonly socket;
    private readonly connectPromise;
    private peerConnections;
    private localMediaStream;
    private remoteMediaStream;
    private options;
    private incomingCallTimeout;
    private call;
    socketConnected: boolean;
    socketDisconnectReason: Socket.DisconnectReason | null;
    socketDisconnectDetails: unknown;
    constructor();
    /**
     * Method destroys connection with signaling socket server.
     */
    destroy(): void;
    reload(): void;
    /**
     * Method connects to signaling socket server. If already connected won't do anything.
     */
    init(options: GreenApiVoipClientInitOptions): Promise<void>;
    private onNewPeer;
    private onRemovePeer;
    private onRemoteMedia;
    private onIceCandidate;
    private onIncomingCall;
    private onCallState;
    private onEndCall;
    /**
     * Method sends request to start whatsapp call.
     */
    startCall(phoneNumber: number, audio?: boolean, video?: boolean): Promise<void>;
    /**
     * Method accepts incoming call from whatsapp.
     */
    acceptCall(audio?: boolean, video?: boolean): Promise<void>;
    /**
     * Method rejects incoming call from whatsapp.
     */
    rejectCall(): Promise<void>;
    /**
     * Method closes p2p connection and sends event, that you disconnect from call room to all participants.
     */
    endCall(): Promise<boolean>;
    private startCapture;
    private clearIncomingCallTimeout;
}

declare interface GreenApiVoipClientEventMap {
    'local-stream-ready': CustomEvent<MediaStream>;
    'remote-stream-ready': CustomEvent<MediaStream>;
    'end-call': CustomEvent<CallStatePayload>;
    'call-state': CustomEvent<CallStatePayload>;
    'incoming-call': CustomEvent<IncomingCallPayload>;
}

declare interface GreenApiVoipClientInitOptions {
    idInstance: string;
    apiTokenInstance: string;
}

declare interface IncomingCallPayload {
    timeout: number;
    info: { callId: string; wid: { device: number; domainType: number; type: number; user: string } };
}

declare interface Jid {
    user: string;
    server: string;
}

declare interface ParticipantsEntity {
    deviceRawJid: string;
    userJid: Jid;
    wid: Jid;
    state: number;
    orderId: number;
    isSelf: boolean;
    isMuted: boolean;
    isInterrupted: boolean;
    isBackgrounded: boolean;
    videoRenderStarted: boolean;
    videoState: number;
    videoOrientation: number;
    rotateVideo: boolean;
    videoCaptureStarted: boolean;
    videoEnabled: boolean;
    videoEnabledAtCallStart: boolean;
    videoPreviewStarted: boolean;
}

export { }
