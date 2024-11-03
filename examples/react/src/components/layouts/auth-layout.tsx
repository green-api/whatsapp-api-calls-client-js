import { FC, useEffect } from 'react';

import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from 'components/header';
import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { selectAuth } from 'store/slices/user-slice';
import 'styles/pages/main.css';

const AuthLayout: FC = () => {
  const isAuth = useAppSelector(selectAuth);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
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
