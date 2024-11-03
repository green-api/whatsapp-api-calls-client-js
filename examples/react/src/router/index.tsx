import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Routes } from './routes';
import AuthLayout from 'components/layouts/auth-layout';
import BaseLayout from 'components/layouts/base-layout';
import Auth from 'pages/auth';
import Call from 'pages/call';
import Main from 'pages/main';
import Profile from 'pages/profile';

const routerConfig = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: Routes.AUTH,
        element: <Auth />,
      },
    ],
  },
  {
    element: <BaseLayout />,
    children: [
      { path: Routes.MAIN, element: <Main /> },
      { path: Routes.PROFILE, element: <Profile /> },
      { path: Routes.CALL, element: <Call /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={Routes.MAIN} />,
  },
];

const router = createBrowserRouter(routerConfig);

export default router;
