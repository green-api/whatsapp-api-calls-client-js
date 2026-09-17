import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CallState, DEFAULT_COUNTRY } from 'common';
import { RootState } from 'store';

const initialState: CallState = {
  activePeer: null,
  addressing: DEFAULT_COUNTRY,
  addressingChosen: false,
  hasActiveCall: false,
  socketConnectionInfo: {
    connected: false,
  },
};

const callSlice = createSlice({
  name: 'callSlice',
  initialState,
  reducers: {
    setActivePeer: (state, action: PayloadAction<CallState['activePeer']>) => {
      state.activePeer = action.payload;
    },
    /** The instance's own country, applied only while nothing has been chosen. */
    setDefaultAddressing: (state, action: PayloadAction<CallState['addressing']>) => {
      if (!state.addressingChosen) {
        state.addressing = action.payload;
      }
    },
    setAddressing: (state, action: PayloadAction<CallState['addressing']>) => {
      state.addressing = action.payload;
      state.addressingChosen = true;
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

export const selectActivePeer = (state: RootState) => state.callReducer.activePeer;
export const selectAddressing = (state: RootState) => state.callReducer.addressing;
export const selectHasActiveCall = (state: RootState) => state.callReducer.hasActiveCall;
export const selectSocketConnectionInfo = (state: RootState) =>
  state.callReducer.socketConnectionInfo;
