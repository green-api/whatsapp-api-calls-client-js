import { FC, useEffect } from 'react';

import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from 'components/header';
import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import 'styles/pages/main.css';

const AuthLayout: FC = () => {
  const isAuth = useAppSelector(selectAuth);
  const { idInstance, apiTokenInstance, apiUrl } = useAppSelector(selectCredentials);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth && idInstance && apiTokenInstance && apiUrl) {
      navigate(Routes.MAIN);
    }
  }, [isAuth, navigate]);

  return (
    <Layout className="app">
      <Header />
      <Layout.Content className="flex-center">
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default AuthLayout;
