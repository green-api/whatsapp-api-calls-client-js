import { FC } from 'react';

import { Flex, Space } from 'antd';

import { useAppSelector } from 'hooks/redux';
import { selectSocketConnectionInfo } from 'store/slices/call-slice';
import 'styles/components/socket-connection-info.css';

const SocketConnectionInfo: FC = () => {
  const { connected, reason, details } = useAppSelector(selectSocketConnectionInfo);

  return (
    <Space direction="vertical">
      <Flex align="center" gap={3}>
        Socket connection status:
        <span
          className={`statusCircle ${connected ? 'statusCircle__auth' : 'statusCircle__notAuth'}`}
        ></span>
        {connected ? 'connected' : 'disconnected'}
      </Flex>
      {reason && <span>reason: {reason}</span>}
      {(details as any) && <pre>{JSON.stringify(details, null, 2)}</pre>}
    </Space>
  );
};

export default SocketConnectionInfo;
