import { FC } from 'react';

import { useAppSelector } from 'hooks/redux';
import { selectSocketConnectionInfo } from 'store/slices/call-slice';
import 'styles/components/socket-connection-info.css';

/** The live state of the calls socket: without it nothing rings and nothing dials. */
const SocketConnectionInfo: FC = () => {
  const { connected, reason, permanent } = useAppSelector(selectSocketConnectionInfo);

  return (
    <span className="status-pill">
      <span
        className={`status-pill__dot ${connected ? 'status-pill__dot--on' : 'status-pill__dot--off'}`}
      />
      {connected ? 'Connected' : 'Disconnected'}
      {!connected && reason && <span className="status-pill__note">· {reason}</span>}
      {permanent && <span className="status-pill__note">· will not reconnect</span>}
    </span>
  );
};

export default SocketConnectionInfo;
