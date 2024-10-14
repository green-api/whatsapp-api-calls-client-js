import { FC } from 'react';

import { Outlet } from 'react-router-dom';

import Header from 'components/header';

const BaseLayout: FC = () => {
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
};

export default BaseLayout;
