export interface CallInfo {
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

export interface CallActiveTime {
  sec: number;
  msec: number;
}

export interface ParticipantsEntity {
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

export interface Jid {
  user: string;
  server: string;
}

export interface CallWaitingInfo {
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

export interface CallLogInfo {
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
