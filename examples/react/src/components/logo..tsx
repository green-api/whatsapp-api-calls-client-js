import { FC } from 'react';

import { Image, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

import logo from 'assets/header-logo.svg';
import { Routes } from 'router/routes';
import 'styles/components/logo.css';

const Logo: FC = () => {
  return (
    <div className="logo-wrapper">
      <Link to={Routes.CONTACTS} className="logo">
        <Space>
          <Image src={logo} preview={false} />
          <Title level={3}>GREEN API</Title>
        </Space>
      </Link>
    </div>
  );
};

export default Logo;
