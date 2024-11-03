import { FC, useEffect } from 'react';

import { Button, Descriptions, Flex, Layout, notification } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import { Actions, IncomingCallPayload } from 'common';
import Header from 'components/header';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { Routes } from 'router/routes';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import { voipClient } from 'voip';

const BaseLayout: FC = () => {
  const { idInstance } = useAppSelector(selectCredentials);
  const isAuth = useAppSelector(selectAuth);

  const navigate = useNavigate();

  const { setHasActiveCall } = useActions();

  useEffect(() => {
    if (!isAuth) {
      navigate(Routes.AUTH);
    }
  }, [isAuth, navigate]);

  // incoming call handler

  useEffect(() => {
    const onAccept = async () => {
      try {
        await voipClient.acceptCall();

        console.log(idInstance);
        setHasActiveCall(true);
        navigate(`/call/${idInstance}`);
        notification.destroy('test');
      } catch (err) {
        notification.error({
          message: 'Произошла ошибка!',
          description: (err as Error).message,
          duration: 10,
        });
      }
    };

    const onReject = async () => {
      try {
        await voipClient.rejectCall();
        notification.destroy('test');
      } catch (err) {
        notification.error({
          message: 'Произошла ошибка!',
          description: (err as Error).message,
          duration: 10,
        });
      }
    };

    const incomingCallHandler = (event: CustomEvent<IncomingCallPayload>) => {
      const payload = event.detail;

      const description = (
        <Flex wrap="wrap" gap="small">
          <Descriptions
            size="small"
            items={[
              {
                key: '1',
                label: 'От',
                children: `${event.detail.info.wid.user || 'Неизвестный номер'}`,
              },
            ]}
          />
          <Button type="primary" onClick={onAccept}>
            Принять
          </Button>
          <Button type="primary" onClick={onReject} danger>
            Отклонить
          </Button>
        </Flex>
      );

      notification.info({
        key: 'test',
        placement: 'top',
        message: 'Входящий звонок',
        description,
        duration: payload.timeout,
      });
      console.log('incomingCall');
    };

    voipClient.addEventListener(Actions.INCOMING_CALL, incomingCallHandler);
    return () => {
      voipClient.removeEventListener(Actions.INCOMING_CALL, incomingCallHandler);
    };
  }, [idInstance]);

  return (
    <Layout className="app">
      <Header />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default BaseLayout;
