import { FC } from 'react';

import { Image, Space } from 'antd';
import Title from 'antd/es/typography/Title';

import logo from 'assets/header-logo.svg';
import 'styles/components/logo.css';

const Logo: FC = () => {
  return (
    <div className="logo-wrapper">
      <a className="logo">
        <Space>
          <Image src={logo} preview={false} />
          <Title level={3}>GREEN API</Title>
        </Space>
      </a>
    </div>
  );
};

export default Logo;
