import { FC, useEffect } from 'react';

import { Button, Descriptions, Flex, Layout, notification, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Actions, IncomingCallPayload } from 'common';
import ContactsList from 'components/contacts-list';
import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { useGetContactsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import { voipClient } from 'voip';

const Contacts: FC = () => {
  const credentials = useAppSelector(selectCredentials);
  const { data, isLoading } = useGetContactsQuery(credentials);
  const navigate = useNavigate();

  useEffect(() => {
    const onAccept = async () => {
      await voipClient.acceptCall();
      navigate(`/call/${credentials.idInstance}`);
      notification.destroy('test');
    };

    const onReject = async () => {
      await voipClient.rejectCall();
      notification.destroy('test');
    };

    const incomingCallHandler = (event: CustomEvent<IncomingCallPayload>) => {
      const payload = event.detail;

      const participant = payload?.info?.participants?.find((participant) => !participant.is_self);

      const description = (
        <Flex wrap="wrap" gap="small">
          <Descriptions
            size="small"
            items={[
              {
                key: '1',
                label: 'От',
                children: `${participant?.jid.user || 'Неизвестный номер'}`,
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
  }, [voipClient]);

  const onProfileClick = () => navigate(Routes.MAIN);

  if (isLoading || !data) {
    return (
      <Layout>
        <Layout.Content className="loading">
          <Spin size="large" />
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.Content className="contacts-page">
        <Row style={{ padding: 10, alignSelf: 'flex-end' }}>
          <Button size="large" onClick={onProfileClick}>
            Профиль
          </Button>
        </Row>
        <ContactsList contacts={data} />
      </Layout.Content>
    </Layout>
  );
};

export default Contacts;
