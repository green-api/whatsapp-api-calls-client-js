import { createBrowserRouter } from 'react-router-dom';

import { Routes } from './routes';
import RequireAuth from '../components/require-auth';
import BaseLayout from 'components/base-layout';
import Call from 'pages/call';
import Contacts from 'pages/contacts';
import Main from 'pages/main';

const routerConfig = [
  {
    path: Routes.MAIN,
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: Routes.CALL,
            element: <Call />,
          },
          {
            path: Routes.CONTACTS,
            element: <Contacts />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

export default router;
