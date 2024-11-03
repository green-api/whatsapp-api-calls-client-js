import { FC } from 'react';

import { Button, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import ContactsList from 'components/contacts-list';
import NewCallForm from 'components/new-call-form.component';
import SocketConnectionInfo from 'components/socket-connection-info';
import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { useGetContactsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';

const Main: FC = () => {
  const credentials = useAppSelector(selectCredentials);
  const { data, isLoading } = useGetContactsQuery(credentials);

  const navigate = useNavigate();

  const onProfileClick = () => navigate(Routes.PROFILE);

  if (isLoading) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="main-page">
      <Row style={{ padding: 10, width: '100%' }} justify="space-between">
        <SocketConnectionInfo />
        <Button size="large" onClick={onProfileClick} type="primary">
          Профиль
        </Button>
      </Row>
      <NewCallForm />
      <ContactsList contacts={data || []} />
    </div>
  );
};

export default Main;
