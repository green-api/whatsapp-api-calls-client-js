export interface CallInfo {
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

export interface CallActiveTime {
  sec: number;
  msec: number;
}

export interface ParticipantsEntity {
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
