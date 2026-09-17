import { FC, useEffect, useMemo } from 'react';

import { CallInfo } from '@green-api/whatsapp-api-calls-client-js';
import { Call, CallEnd } from '@mui/icons-material';
import { Button } from 'antd';

import { formatAddress } from 'common';
import PeerAvatar from 'components/peer-avatar';
import { useAppSelector } from 'hooks/redux';
import { useGetContactsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/incoming-call.css';
import { startRingtone } from 'voip/ringing';

interface IncomingCallProps {
  info: CallInfo;
  onAccept: () => void;
  onReject: () => void;
}

/** Initials only make sense for a name; a bare address falls through to the icon. */
const initialsOf = (label: string): string =>
  /^[\d\s+]+$/.test(label) || !label
    ? ''
    : label
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

/**
 * The incoming call prompt.
 *
 * Deliberately a component in the app's own tree rather than antd's static notification:
 * that one renders in a React root of its own, outside the theme and the store, so it came
 * out unbranded and could not show an avatar without throwing. A ringing phone is the most
 * important thing on screen, so it gets the screen.
 */
const IncomingCall: FC<IncomingCallProps> = ({ info, onAccept, onReject }) => {
  const credentials = useAppSelector(selectCredentials);
  const { data: contacts } = useGetContactsQuery(credentials, { skip: !credentials.idInstance });

  // A call from a LID carries no name, and the contact list holds both of a peer's
  // addresses — so it can put a name to whichever one is calling.
  const known = useMemo(
    () => contacts?.find((contact) => contact.id === info.wid || contact.lid === info.wid),
    [contacts, info.wid]
  );

  const name = info.name?.trim() || known?.contactName?.trim() || known?.name?.trim() || '';
  const address = info.wid ? formatAddress(info.wid) : '';

  // Rings for as long as the prompt is up, and stops the moment it goes — whether it was
  // answered, declined, or the caller gave up.
  useEffect(() => startRingtone(), []);

  return (
    <div className="incoming" role="dialog" aria-label="Incoming call">
      <div className="incoming__card">
        <PeerAvatar chatId={info.wid} fallback={initialsOf(name)} size="lg" />

        <div className="incoming__who">
          <div className="incoming__label">Incoming call</div>
          <div className="incoming__peer">{name || address || 'Unknown number'}</div>
          {name && address && <div className="incoming__address">{address}</div>}
        </div>

        <div className="incoming__actions">
          <Button
            className="incoming__button incoming__button--reject"
            shape="circle"
            onClick={onReject}
            aria-label="Reject"
            icon={<CallEnd sx={{ fontSize: 26 }} />}
          />
          <Button
            className="incoming__button incoming__button--accept"
            shape="circle"
            onClick={onAccept}
            aria-label="Accept"
            icon={<Call sx={{ fontSize: 26 }} />}
          />
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
