import { FC } from 'react';

import { Button, Flex, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import ProfileInfo from 'components/profile-info';
import { Routes } from 'router/routes';

const Profile: FC = () => {
  const navigate = useNavigate();

  const onClickBack = () => navigate(Routes.MAIN);

  return (
    <Flex vertical gap="large">
      <Row style={{ padding: 10 }}>
        <Button size="large" onClick={onClickBack} type="primary">
          На страницу контактов
        </Button>
      </Row>
      <ProfileInfo />
    </Flex>
  );
};

export default Profile;
