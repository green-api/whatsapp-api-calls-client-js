import { FC, useEffect, useMemo, useState } from 'react';

import { CallState } from '@green-api/whatsapp-api-calls-client-js';
import { CallEnd, Mic, MicOff } from '@mui/icons-material';
import { Button, notification } from 'antd';
import { Navigate } from 'react-router-dom';

import { formatAddress } from 'common';
import CountUpTimer from 'components/count-up-timer';
import PeerAvatar from 'components/peer-avatar';
import StreamVisualizer from 'components/stream-visualizer';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useCallsConnection } from 'hooks/useCallsConnection';
import { LOCAL_VIDEO, REMOTE_VIDEO, useVoip } from 'hooks/useVoip';
import { Routes } from 'router/routes';
import { useGetContactsQuery } from 'services/endpoints';
import { selectHasActiveCall } from 'store/slices/call-slice';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/pages/call.css';
import { getClient, getMicrophoneState, onMicrophoneChange, setMicrophoneMuted } from 'voip';
import { startRingback } from 'voip/ringing';

/** Initials only make sense for a name; a bare address gets the icon instead. */
const initialsOf = (label: string): string =>
  /^[\d\s+]+$/.test(label) || !label
    ? ''
    : label
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

const Call: FC = () => {
  const { provideMediaRef, remoteMediaStream, localMediaStream } = useVoip();
  const hasActiveCall = useAppSelector(selectHasActiveCall);

  const { setHasActiveCall } = useActions();

  // Rendered from the module rather than from a copy of it: the microphone can change under
  // this screen — a reconnect replaces it mid-call — and a button that only remembers its
  // own clicks would go on claiming a mute that no longer holds.
  const [mic, setMic] = useState(getMicrophoneState);
  const [status, setStatus] = useState('Connecting…');
  const [peerName, setPeerName] = useState('');
  const [peerChatId, setPeerChatId] = useState('');
  const connection = useCallsConnection();

  const credentials = useAppSelector(selectCredentials);
  // Served from the cache the main screen already filled; the call screen only reads it.
  const { data: contacts } = useGetContactsQuery(credentials, { skip: !credentials.idInstance });

  /**
   * The peer among the saved contacts, matched on either of its addresses.
   *
   * The state frame names the peer only when WhatsApp has a pushname for it, which it often
   * has not — a call from a LID arrives as bare digits. The contact list holds both the
   * number and the LID for the same person, so it can put a name to either.
   */
  const known = useMemo(
    () => contacts?.find((contact) => contact.id === peerChatId || contact.lid === peerChatId),
    [contacts, peerChatId]
  );

  const name = peerName || known?.contactName?.trim() || known?.name?.trim() || '';
  const address = peerChatId ? formatAddress(peerChatId) : '';

  useEffect(() => {
    if (!connection) {
      return;
    }

    // `cause` is the server's own word for why the call ended — `hangup`, `timeout`,
    // `accepted_elsewhere` and so on. It is absent when our own socket dropped.
    const endCallHandler = (event: Event) => {
      const { cause } = (event as CustomEvent<{ cause?: string }>).detail;

      setHasActiveCall(false);

      notification.info({
        message: cause ? `Call ended: ${cause}` : 'Call ended',
        duration: 10,
      });
    };

    const apply = (state: CallState) => {
      setStatus(state.state === 'on-call' ? 'In call' : 'Ringing…');
      setPeerName(state.info?.name?.trim() ?? '');
      setPeerChatId(state.info?.wid ?? '');
    };

    const callStateHandler = (event: Event) => apply((event as CustomEvent<CallState>).detail);

    connection.addEventListener('end-call', endCallHandler);
    connection.addEventListener('state', callStateHandler);

    // The state frame that started this call arrived before the screen existed.
    if (connection.state) {
      apply(connection.state);
    }

    return () => {
      connection.removeEventListener('end-call', endCallHandler);
      connection.removeEventListener('state', callStateHandler);
    };
  }, [connection]);

  // Subscribed after the first read, and read again on subscribing: the microphone may have
  // arrived between the two, and a listener alone would never hear about what it missed.
  useEffect(() => {
    setMic(getMicrophoneState());

    return onMicrophoneChange(setMic);
  }, []);

  const { available: canMute, muted } = mic;
  const onToggleMute = () => setMicrophoneMuted(!muted);

  const ringing = status !== 'In call';

  // Ringback for as long as the far end has not picked up. Declared above the redirect
  // below so the hook order never depends on whether a call is up.
  useEffect(() => {
    if (!hasActiveCall || !ringing) {
      return;
    }

    return startRingback();
  }, [hasActiveCall, ringing]);

  const onClickEndCall = async () => {
    try {
      await getClient().hangUp();
      setHasActiveCall(false);
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
        description: (err as Error).message,
        duration: 10,
      });
    }
  };

  if (!hasActiveCall) {
    return <Navigate to={Routes.MAIN} replace />;
  }

  return (
    <div className="page">
      <div className="card call-card">
        <PeerAvatar
          chatId={peerChatId}
          fallback={initialsOf(name)}
          size="lg"
          className={ringing ? 'call-card__avatar--ringing' : ''}
        />

        {/* The name leads when there is one, and the address stays underneath rather than
            being replaced by it: on a call you want to know both who it is and on which of
            their addresses you reached them. With no name the address is the heading, and
            repeating it below would say nothing twice. */}
        <div className="call-card__who">
          <h1 className="call-card__name">{name || address || 'Unknown number'}</h1>
          {name && address && <div className="call-card__address">{address}</div>}
          <div className="call-card__status">{status}</div>
        </div>

        <div className="call-card__timer">
          <CountUpTimer />
        </div>

        <div className="call-card__waves">
          <figure className="wave">
            <div className="wave__canvas">
              {localMediaStream.current && (
                <StreamVisualizer remoteStream={localMediaStream.current} />
              )}
            </div>
            {/* Says why the meter is flat: a muted mic looks exactly like a broken one. */}
            <figcaption className={`wave__label ${muted ? 'wave__label--muted' : ''}`}>
              {muted ? 'You · muted' : 'You'}
            </figcaption>
          </figure>
          <figure className="wave">
            <div className="wave__canvas">
              {remoteMediaStream.current && (
                <StreamVisualizer remoteStream={remoteMediaStream.current} />
              )}
            </div>
            <figcaption className="wave__label">Peer</figcaption>
          </figure>
        </div>

        <div className="call-card__controls">
          {/* Muting is local: the track stops producing sound, and nothing is sent to the
              server about it — so the peer hears silence rather than being told. */}
          <Button
            onClick={onToggleMute}
            disabled={!canMute}
            shape="circle"
            className={`call-card__control ${muted ? 'call-card__control--on' : ''}`}
            aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
            aria-pressed={muted}
            icon={muted ? <MicOff sx={{ fontSize: 26 }} /> : <Mic sx={{ fontSize: 26 }} />}
          />

          <Button
            onClick={onClickEndCall}
            type="primary"
            danger
            shape="circle"
            className="call-card__hangup"
            aria-label="Hang up"
            icon={<CallEnd sx={{ fontSize: 26 }} />}
          />
        </div>
      </div>

      {/* Where the sound actually comes out. Hidden, never removed. */}
      <div className="call-audio">
        <audio ref={(node) => provideMediaRef(LOCAL_VIDEO, node)} autoPlay muted />
        <audio ref={(node) => provideMediaRef(REMOTE_VIDEO, node)} autoPlay />
      </div>
    </div>
  );
};

export default Call;
