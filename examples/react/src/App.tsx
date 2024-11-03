import { FC, useEffect } from 'react';

import { ConfigProvider, notification } from 'antd';
import { RouterProvider } from 'react-router-dom';

import 'App.css';
import { Actions, SocketDisconnectPayload, THEME } from 'common';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import router from 'router';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import { voipClient } from 'voip';

const App: FC = () => {
  const { idInstance, apiTokenInstance } = useAppSelector(selectCredentials);
  const auth = useAppSelector(selectAuth);

  const { setSocketConnectionInfo } = useActions();

  // auth handler
  useEffect(() => {
    document.documentElement.classList.add('default-theme');

    (async () => {
      if (idInstance && apiTokenInstance && auth) {
        try {
          await voipClient.init({ idInstance, apiTokenInstance });
        } catch (err) {
          notification.error({
            message: 'Произошла ошибка!',
            description: (err as Error).message,
            duration: 10,
          });
        }
      }
    })();
  }, [auth, idInstance, apiTokenInstance]);

  // socket  connection status handler
  useEffect(() => {
    const socketConnectHandler = () => {
      setSocketConnectionInfo({ connected: true });
    };

    const socketDisconnectHandler = (event: CustomEvent<SocketDisconnectPayload>) => {
      setSocketConnectionInfo({
        connected: false,
        reason: event.detail.reason,
        details: event.detail.details,
      });
    };

    voipClient.addEventListener(Actions.SOCKET_CONNECT, socketConnectHandler);
    voipClient.addEventListener(Actions.SOCKET_DISCONNECT, socketDisconnectHandler);

    return () => {
      voipClient.removeEventListener(Actions.SOCKET_CONNECT, socketConnectHandler);
      voipClient.removeEventListener(Actions.SOCKET_DISCONNECT, socketDisconnectHandler);
    };
  }, []);

  return (
    <ConfigProvider theme={THEME}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
