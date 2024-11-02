import { FC } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from 'hooks/redux';
import { Routes } from 'router/routes';
import { selectAuth } from 'store/slices/user-slice';

const RequireAuth: FC = () => {
  const isAuth = useAppSelector(selectAuth);

  if (!isAuth) {
    return <Navigate to={Routes.MAIN} />;
  }

  return <Outlet />;
};

export default RequireAuth;
