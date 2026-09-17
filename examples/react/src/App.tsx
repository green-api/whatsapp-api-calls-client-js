import { FC, useEffect } from 'react';

import { ConfigProvider, notification } from 'antd';
import { RouterProvider } from 'react-router-dom';

import 'App.css';
import { THEME } from 'common';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useCallsConnection } from 'hooks/useCallsConnection';
import router from 'router';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import { closeVoip, getConnectionStatus, openVoip } from 'voip';

const App: FC = () => {
  const { idInstance, apiTokenInstance, apiUrl } = useAppSelector(selectCredentials);
  const auth = useAppSelector(selectAuth);

  const { setSocketConnectionInfo } = useActions();
  const connection = useCallsConnection();

  // Opens the calls connection once the credentials are known. The library takes them in
  // its constructor, so this is also what creates the client.
  useEffect(() => {
    document.documentElement.classList.add('default-theme');

    if (!idInstance || !apiTokenInstance || !apiUrl || !auth) {
      closeVoip();

      return;
    }

    try {
      openVoip({ idInstance, apiTokenInstance, apiUrl });
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
        description: (err as Error).message,
        duration: 10,
      });
    }
  }, [auth, idInstance, apiTokenInstance, apiUrl]);

  // Connection status. `permanent` means the server refused rather than the link dropping:
  // reconnecting will not help, and the reason is worth showing rather than retrying.
  useEffect(() => {
    if (!connection) {
      setSocketConnectionInfo({ connected: false });

      return;
    }

    const onConnect = () => setSocketConnectionInfo({ connected: true });

    const onDisconnect = (event: Event) => {
      const { reason, permanent } = (event as CustomEvent<{ reason: string; permanent?: boolean }>)
        .detail;

      setSocketConnectionInfo({ connected: false, reason, permanent });
    };

    connection.addEventListener('connect', onConnect);
    connection.addEventListener('disconnect', onDisconnect);

    // The socket may already be up: its `connect` fired while this effect was still being
    // scheduled, and subscribing alone would leave the app claiming to be offline.
    setSocketConnectionInfo(getConnectionStatus());

    return () => {
      connection.removeEventListener('connect', onConnect);
      connection.removeEventListener('disconnect', onDisconnect);
    };
  }, [connection]);

  return (
    <ConfigProvider theme={THEME}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
