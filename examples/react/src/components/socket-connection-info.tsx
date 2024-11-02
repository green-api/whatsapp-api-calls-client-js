import { FC } from 'react';

import { Space } from 'antd';

import { useAppSelector } from 'hooks/redux';
import { selectSocketConnectionInfo } from 'store/slices/call-slice';

const SocketConnectionInfo: FC = () => {
  const { connected, reason, details } = useAppSelector(selectSocketConnectionInfo);

  return (
    <Space direction="vertical">
      <span>Socket connection status: {connected ? 'connected' : 'disconnected'}</span>
      {reason && <span>reason: {reason}</span>}
      {(details as any) && <pre>{JSON.stringify(details, null, 2)}</pre>}
    </Space>
  );
};

export default SocketConnectionInfo;
