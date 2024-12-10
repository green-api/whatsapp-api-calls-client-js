import { FC } from 'react';

import { Button, Flex } from 'antd';
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
      <Flex vertical gap={10} style={{ padding: 10 }}>
        <Button size="large" onClick={onProfileClick} type="primary" style={{ maxWidth: 200 }}>
          Профиль
        </Button>
        <SocketConnectionInfo />
      </Flex>
      <NewCallForm />
      <ContactsList />
    </div>
  );
};

export default Main;
