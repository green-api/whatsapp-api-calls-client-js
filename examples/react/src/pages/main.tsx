import { FC } from 'react';

import { Button, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import ContactsList from 'components/contacts-list';
import NewCallForm from 'components/new-call-form.component';
import SocketConnectionInfo from 'components/socket-connection-info';
import { Routes } from 'router/routes';

const Main: FC = () => {
  const navigate = useNavigate();

  const onProfileClick = () => navigate(Routes.PROFILE);

  return (
    <div className="main-page">
      <Row style={{ padding: 10, width: '100%' }} justify="space-between">
        <SocketConnectionInfo />
        <Button size="large" onClick={onProfileClick} type="primary">
          Профиль
        </Button>
      </Row>
      <NewCallForm />
      <ContactsList />
    </div>
  );
};

export default Main;
