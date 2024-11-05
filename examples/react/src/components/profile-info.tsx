import { FC } from 'react';

import { Avatar, Button, Flex, Row, Spin } from 'antd';

import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useGetWaSettingsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import { voipClient } from 'voip';

const ProfileInfo: FC = () => {
  const credentials = useAppSelector(selectCredentials);

  const { data, isLoading } = useGetWaSettingsQuery(credentials);

  const { logout } = useActions();

  const onClickChange = () => {
    logout();
    voipClient.destroy();
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
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
  );
};

export default ProfileInfo;
