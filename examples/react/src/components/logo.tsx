import { FC } from 'react';

import { Image } from 'antd';

import logo from 'assets/Logo_GREEN-API_.svg';
import 'styles/components/logo.css';

const Logo: FC = () => {
  return (
    <div className="logo-wrapper">
      <a className="logo">
        <Image src={logo} preview={false} width={200} />
      </a>
    </div>
  );
};

export default Logo;
