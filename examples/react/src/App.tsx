import { FC } from 'react';

import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';

import 'App.css';
import { THEME } from 'common';
import router from 'router';

const App: FC = () => {
  return (
    <ConfigProvider theme={THEME}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
