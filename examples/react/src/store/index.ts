import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { listenerMiddleware } from './auth-middleware';
import { baseAPI } from 'services/api-service';
import callReducer from 'store/slices/call-slice';
import userReducer from 'store/slices/user-slice';

const rootReducer = combineReducers({
  userReducer,
  callReducer,
  [baseAPI.reducerPath]: baseAPI.reducer,
});

export const setupStore = (preloadedState?: RootState) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseAPI.middleware, listenerMiddleware.middleware),
    preloadedState,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
