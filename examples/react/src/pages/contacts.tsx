import { FC } from 'react';

import { Button, Layout, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import ContactsList from 'components/contacts-list';
import NewCallForm from 'components/new-call-form.component';
import SocketConnectionInfo from 'components/socket-connection-info';
import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { useGetContactsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';

const Contacts: FC = () => {
  const credentials = useAppSelector(selectCredentials);
  const { data, isLoading } = useGetContactsQuery(credentials);

  const navigate = useNavigate();

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
        <Row style={{ padding: 10, width: '100%' }} justify="space-between">
          <SocketConnectionInfo />
          <Button size="large" onClick={onProfileClick} type="primary">
            Профиль
          </Button>
        </Row>
        <NewCallForm />
        <ContactsList contacts={data} />
      </Layout.Content>
    </Layout>
  );
};

export default Contacts;
