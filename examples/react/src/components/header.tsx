import { FC } from 'react';

import { Layout } from 'antd';

import Logo from './logo.';
import 'styles/components/header.css';

const Header: FC = () => {
  return (
    <Layout.Header className="header" style={{ height: 90 }}>
      <Logo />
      <span style={{ fontSize: 25 }}>Whatsapp calls</span>
    </Layout.Header>
  );
};

export default Header;
