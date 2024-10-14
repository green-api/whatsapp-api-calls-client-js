declare interface CallActiveTime {
    sec: number;
    msec: number;
}

declare interface CallInfo {
    call_state: number;
    call_id: string;
    peer_raw_jid: string;
    initial_peer_raw_jid: string;
    creator_raw_jid: string;
    caller_status: number;
    call_active_time: CallActiveTime;
    call_duration: number;
    call_ending: number;
    call_ended_by_me: number;
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
    is_group_call: number;
    enable_group_call: number;
    is_group_call_created_on_server: number;
    initial_group_transaction_id: number;
    participant_count: number;
    participants?: ParticipantsEntity[] | null;
    can_invite_new_participant: number;
    can_switch_audio_video: number;
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
    info: CallInfo;
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
    info: { callId: string; wid: { device: number; domainType: number; type: number; user: string; } };
}

declare interface Jid {
    user: string;
    server: string;
}

declare interface ParticipantsEntity {
    device_raw_jid: string;
    jid: Jid;
    state: number;
    order_id: number;
    is_self: number;
    is_muted: number;
    is_interrupted: number;
    is_backgrounded: number;
    video_render_started: number;
    video_decode_started: number;
    video_decode_paused: number;
    video_width: number;
    video_state: number;
    video_height: number;
    video_orientation: number;
    is_audio_video_switch_enabled: number;
    is_audio_video_switch_supported: number;
    is_invited_by_self: number;
    is_call_offer_cancelled: number;
    rx_connecting: number;
    rx_timedout: number;
    rx_audio_packet_count: number;
}

export { }
