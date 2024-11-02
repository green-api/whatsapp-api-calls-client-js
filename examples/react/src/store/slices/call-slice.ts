import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CallState } from 'common';
import { RootState } from 'store';

const initialState: CallState = {
  activePhoneNumber: '',
  hasActiveCall: false,
  socketConnectionInfo: {
    connected: false,
  },
};

const callSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setActivePhoneNumber: (state, action: PayloadAction<CallState['activePhoneNumber']>) => {
      state.activePhoneNumber = action.payload;
    },
    setHasActiveCall: (state, action: PayloadAction<CallState['hasActiveCall']>) => {
      state.hasActiveCall = action.payload;
    },
    setSocketConnectionInfo: (state, action: PayloadAction<CallState['socketConnectionInfo']>) => {
      state.socketConnectionInfo = action.payload;
    },
  },
});

export const callActions = callSlice.actions;
export default callSlice.reducer;

export const selectActivePhoneNumber = (state: RootState) => state.callReducer.activePhoneNumber;
export const selectHasActiveCall = (state: RootState) => state.callReducer.hasActiveCall;
export const selectSocketConnectionInfo = (state: RootState) =>
  state.callReducer.socketConnectionInfo;
