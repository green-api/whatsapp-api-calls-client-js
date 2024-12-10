import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserState } from 'common';
import { RootState } from 'store';

const getInitialStateFromStorage = (): UserState | null => {
  const initialState = localStorage.getItem('userState');

  return initialState ? (JSON.parse(initialState) as UserState) : null;
};

const initialState: UserState = getInitialStateFromStorage() || {
  credentials: {
    idInstance: '',
    apiTokenInstance: '',
    apiUrl: '',
  },
  isAuth: false,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserState['credentials']>) => {
      state.credentials = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

export const selectCredentials = (state: RootState) => state.userReducer.credentials;
export const selectAuth = (state: RootState) => state.userReducer.isAuth;
