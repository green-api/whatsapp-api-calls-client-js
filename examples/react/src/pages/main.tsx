import { FC } from 'react';

import { Avatar, Button, Flex, Layout, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

import AuthForm from 'components/auth-form';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { Routes } from 'router/routes';
import { useGetWaSettingsQuery } from 'services/endpoints';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import 'styles/pages/main.css';
import { voipClient } from 'voip';

const Main: FC = () => {
  const { logout } = useActions();
  const isAuth = useAppSelector(selectAuth);
  const credentials = useAppSelector(selectCredentials);
  const navigate = useNavigate();
  const { data, isLoading } = useGetWaSettingsQuery(credentials, { skip: !isAuth });

  const onClickBack = () => navigate(Routes.CONTACTS);
  const onClickChange = () => {
    logout();
    voipClient.destroy();
  };

  if (isAuth) {
    if (isLoading) {
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
        <Layout.Content>
          <Flex vertical gap="large">
            <Row style={{ padding: 10, alignSelf: 'flex-end' }}>
              <Button size="large" onClick={onClickBack}>
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
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.Content className="main-page-auth">
        <AuthForm />
      </Layout.Content>
    </Layout>
  );
};

export default Main;
