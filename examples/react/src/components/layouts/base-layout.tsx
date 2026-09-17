import { FC, useEffect, useState } from 'react';

import { CallInfo, CallState } from '@green-api/whatsapp-api-calls-client-js';
import { Layout, notification } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from 'components/header';
import IncomingCall from 'components/incoming-call';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useCallsConnection } from 'hooks/useCallsConnection';
import { Routes } from 'router/routes';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import { getClient } from 'voip';

const BaseLayout: FC = () => {
  const { idInstance, apiTokenInstance, apiUrl } = useAppSelector(selectCredentials);
  const isAuth = useAppSelector(selectAuth);

  const navigate = useNavigate();

  const { setHasActiveCall } = useActions();
  const connection = useCallsConnection();

  const [incoming, setIncoming] = useState<CallInfo | null>(null);

  useEffect(() => {
    if (!isAuth || !idInstance || !apiTokenInstance || !apiUrl) {
      navigate(Routes.AUTH);
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (!connection) {
      return;
    }

    const onIncoming = (event: Event) => setIncoming((event as CustomEvent<CallInfo>).detail);

    // The caller gave up, or another device answered: the prompt has to go by itself, or it
    // would sit there offering a call that no longer exists.
    const onEnded = () => setIncoming(null);

    const onState = (event: Event) => {
      const state = (event as CustomEvent<CallState>).detail;

      if (state.state !== 'inc-call') {
        setIncoming(null);
      }
    };

    connection.addEventListener('incoming-call', onIncoming);
    connection.addEventListener('end-call', onEnded);
    connection.addEventListener('state', onState);

    return () => {
      connection.removeEventListener('incoming-call', onIncoming);
      connection.removeEventListener('end-call', onEnded);
      connection.removeEventListener('state', onState);
    };
  }, [connection]);

  // Answering is two steps: accept tells the server, and the audio bridge is what actually
  // carries the sound. Signalling comes first — an offer without a call is refused.
  const onAccept = async () => {
    setIncoming(null);

    try {
      await getClient().accept();
      await connection?.startAudioBridge();

      setHasActiveCall(true);
      navigate(`/call/${idInstance}`);
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
        description: (err as Error).message,
        duration: 10,
      });
    }
  };

  const onReject = async () => {
    setIncoming(null);

    try {
      await getClient().reject();
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
        description: (err as Error).message,
        duration: 10,
      });
    }
  };

  return (
    <Layout className="app">
      <Header />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      {incoming && <IncomingCall info={incoming} onAccept={onAccept} onReject={onReject} />}
    </Layout>
  );
};

export default BaseLayout;
