import { FC } from 'react';

import { Avatar, Button, Flex, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { Routes } from 'router/routes';
import { useGetWaSettingsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import { voipClient } from 'voip';

const Profile: FC = () => {
  const credentials = useAppSelector(selectCredentials);

  const { logout } = useActions();

  const { data, isLoading } = useGetWaSettingsQuery(credentials);

  const navigate = useNavigate();

  const onClickBack = () => navigate(Routes.MAIN);
  const onClickChange = () => {
    logout();
    voipClient.destroy();
  };

  if (isLoading) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Flex vertical gap="large">
      <Row style={{ padding: 10, alignSelf: 'flex-end' }}>
        <Button size="large" onClick={onClickBack} type="primary">
          На страницу контактов
        </Button>
      </Row>
      <Flex vertical align="center" gap="middle">
        <Row>
          <Avatar src={data?.avatar} size={128}></Avatar>
        </Row>
        <Flex vertical style={{ fontSize: '24px' }}>
          <Row className="contact-info">
            <span>
              <b>phone:</b> {data?.phone}
            </span>
          </Row>
          <Row className="contact-info">
            <span>
              <b>stateInstance:</b> {data?.stateInstance}
            </span>
          </Row>
          <Row className="contact-info">
            <span>
              <b>deviceId:</b> {data?.deviceId}
            </span>
          </Row>
        </Flex>
        <Row>
          <Button size="large" onClick={onClickChange} type="primary">
            Выйти
          </Button>
        </Row>
      </Flex>
    </Flex>
  );
};

export default Profile;
