import {
  CallsConnection,
  GreenApiVoipClient,
  GreenApiVoipClientOptions,
} from '@green-api/whatsapp-api-calls-client-js';

/**
 * The client and the calls connection for the whole app.
 *
 * The library takes the credentials in its constructor, so the client cannot exist before
 * the user has authorized. It is kept here rather than in a component so that any part of
 * the app can reach it, and so that a re-render never opens a second socket.
 */
let client: GreenApiVoipClient | null = null;
let connection: CallsConnection | null = null;

/** Which credentials the open connection belongs to, so the same ones do not reopen it. */
let openedFor = '';

const keyOf = (options: GreenApiVoipClientOptions): string =>
  `${options.apiUrl}|${options.idInstance}|${options.apiTokenInstance}`;

/** Subscribers that want to know when the connection is replaced. */
const listeners = new Set<(connection: CallsConnection | null) => void>();

function publish(): void {
  listeners.forEach((listener) => listener(connection));
}

/**
 * The last media streams the bridge produced.
 *
 * They are remembered here because the bridge is raised before the call screen is on
 * screen: dial and accept both await startAudioBridge and only then navigate, so the
 * `*-stream-ready` events have already fired by the time the audio elements mount. A
 * component that subscribed only to future events would hear nothing at all.
 */
let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;

/**
 * Whether the microphone is muted for the call in progress.
 *
 * Muting is not something the library offers, and it does not need to: the track handed out
 * with `local-stream-ready` is the very object added to the peer connection, so disabling it
 * silences what the peer receives rather than only what the local meter draws.
 *
 * It is deliberately not carried across calls — a microphone that is still muted from the
 * last call is a conversation held into a dead mic.
 */
let microphoneMuted = false;

/**
 * Whether the socket is up right now.
 *
 * Remembered for the same reason as the streams: the connection is opened before any
 * component subscribes to it, so a listener attached later may never see the `connect` it
 * already missed and would show the app as offline while it is perfectly connected.
 */
export interface ConnectionStatus {
  connected: boolean;
  reason?: string;
  permanent?: boolean;
}

let status: ConnectionStatus = { connected: false };

/** The socket state as it stands, for a component that subscribed late. */
export function getConnectionStatus(): ConnectionStatus {
  return status;
}

/** The streams of the current call, for a component that mounted after the bridge came up. */
export function getMediaStreams(): { local: MediaStream | null; remote: MediaStream | null } {
  return { local: localStream, remote: remoteStream };
}

export interface MicrophoneState {
  /** Whether there is a live microphone to mute at all. */
  available: boolean;
  muted: boolean;
}

/**
 * The tracks that can still carry sound.
 *
 * A stopped track stays in its stream, so counting tracks is not the same as having a
 * microphone: the library stops them when it tears the bridge down for a reconnect, and
 * setting `enabled` on them would report a mute that silences nothing.
 */
function liveTracks(): MediaStreamTrack[] {
  return (localStream?.getAudioTracks() ?? []).filter((track) => track.readyState === 'live');
}

export function getMicrophoneState(): MicrophoneState {
  return { available: liveTracks().length > 0, muted: microphoneMuted };
}

const microphoneListeners = new Set<(state: MicrophoneState) => void>();

/** Subscribes to microphone changes; returns the unsubscribe. */
export function onMicrophoneChange(listener: (state: MicrophoneState) => void): () => void {
  microphoneListeners.add(listener);

  return () => {
    microphoneListeners.delete(listener);
  };
}

function publishMicrophone(): void {
  const state = getMicrophoneState();

  microphoneListeners.forEach((listener) => listener(state));
}

/**
 * Mutes or unmutes the microphone, and reports where it actually ended up.
 *
 * With no live track there is no microphone to mute, and saying otherwise would be worse
 * than refusing: a screen that claims to be muted while the mic is live is how people say
 * things they believe nobody can hear. The caller is told what is true, not what it asked.
 */
export function setMicrophoneMuted(muted: boolean): boolean {
  const tracks = liveTracks();

  if (tracks.length) {
    microphoneMuted = muted;
    tracks.forEach((track) => {
      track.enabled = !muted;
    });
  }

  publishMicrophone();

  return microphoneMuted;
}

/**
 * Every remembered value is guarded by `target === connection`.
 *
 * Closing a socket does not report it in the same tick: a connection replaced while its
 * predecessor was still shutting down would be overwritten by the old one's farewell, and
 * the app would sit there claiming to be offline while the new socket was already up.
 */
function rememberStatus(target: CallsConnection): void {
  target.addEventListener('connect', () => {
    if (target === connection) {
      status = { connected: true };
    }
  });

  target.addEventListener('disconnect', (event) => {
    if (target !== connection) {
      return;
    }

    const detail = (event as CustomEvent<{ reason: string; permanent?: boolean }>).detail;

    status = { connected: false, reason: detail.reason, permanent: detail.permanent };
    // A drop during a call takes the bridge with it and stops the microphone's tracks, with
    // no event of its own. Saying so here is what stops the control offering to mute a
    // microphone that is no longer running.
    publishMicrophone();
  });
}

function rememberStreams(target: CallsConnection): void {
  target.addEventListener('local-stream-ready', (event) => {
    if (target === connection) {
      localStream = (event as CustomEvent<MediaStream>).detail;
      // Not necessarily a new call: the library raises the bridge again after a socket drop
      // without ever ending the one in progress, and hands out a fresh microphone. So the
      // mute is re-applied to the new tracks rather than dropped — a mute that quietly
      // lifts itself because the network blinked is how a private remark goes out live.
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !microphoneMuted;
      });
      publishMicrophone();
    }
  });

  target.addEventListener('remote-stream-ready', (event) => {
    if (target === connection) {
      remoteStream = (event as CustomEvent<MediaStream>).detail;
    }
  });

  // The streams belong to one call: keeping them past its end would hand the next call
  // the previous peer's audio.
  // The call is over for real here — this is the one place the mute is forgotten, so that
  // it never carries into the next call, and never lifts inside this one.
  target.addEventListener('end-call', () => {
    if (target === connection) {
      localStream = null;
      remoteStream = null;
      microphoneMuted = false;
      publishMicrophone();
    }
  });
}

/**
 * Opens the calls connection for these credentials, closing whatever was open before.
 *
 * The connection is a WebSocket that reports call state and carries the WebRTC audio
 * bridge; it is the only object that emits call events.
 */
export function openVoip(options: GreenApiVoipClientOptions): CallsConnection {
  const key = keyOf(options);

  // Opening is idempotent on purpose. React runs an effect twice on mount in development,
  // and a re-render must not cost a socket: tearing the old one down while the new one is
  // still connecting leaves the server with two sockets for one instance, and it keeps the
  // wrong one.
  if (connection && openedFor === key) {
    return connection;
  }

  closeVoip();

  openedFor = key;
  client = new GreenApiVoipClient(options);
  connection = client.connectCalls();
  status = { connected: false };
  rememberStatus(connection);
  rememberStreams(connection);
  publish();

  return connection;
}

/** Closes the connection and forgets the client. */
export function closeVoip(): void {
  connection?.close();
  connection = null;
  client = null;
  openedFor = '';
  localStream = null;
  remoteStream = null;
  microphoneMuted = false;
  status = { connected: false };
  publishMicrophone();
  publish();
}

/** The connection, or null while nobody has authorized yet. */
export function getConnection(): CallsConnection | null {
  return connection;
}

/**
 * The client for the REST commands — dial, accept, reject, hang up.
 *
 * Throws when called before authorization: a command without credentials has nowhere to
 * go, and failing loudly here beats a request that quietly 401s.
 */
export function getClient(): GreenApiVoipClient {
  if (!client) {
    throw new Error('The calls client is not ready: authorize first');
  }

  return client;
}

/** Subscribes to connection replacement; returns the unsubscribe. */
export function onConnectionChange(
  listener: (connection: CallsConnection | null) => void
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
