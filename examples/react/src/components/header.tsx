import { FC } from 'react';

import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { selectAuth } from 'store/slices/user-slice';
import 'styles/components/header.css';

const Header: FC = () => {
  const isAuth = useAppSelector(selectAuth);

  return (
    <Layout.Header className="header">
      <h1>
        <Link to={isAuth ? Routes.CONTACTS : Routes.MAIN}>GreenAPI Whatsapp calls demo</Link>
      </h1>
    </Layout.Header>
  );
};

export default Header;
