import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { actionCreators } from './actions';
import { RootState } from 'store';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(actionCreators.setCredentials),
  effect: (_, api) => {
    localStorage.setItem('userState', JSON.stringify((api.getState() as RootState).userReducer));
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(actionCreators.logout),
  effect: () => {
    localStorage.removeItem('userState');
  },
});
