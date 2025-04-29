import { createSlice } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';

const initialState = {
  isConnected: false,
  isInternetReachable: false,
  type: null,
  details: null,
};

const netInfoSlice = createSlice({
  name: 'netInfo',
  initialState,
  reducers: {
    updateConnectionStatus: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.isInternetReachable = action.payload.isInternetReachable;
      state.type = action.payload.type;
      state.details = action.payload.details;
    },
  },
});

export const { updateConnectionStatus } = netInfoSlice.actions;

export default netInfoSlice.reducer;

export const checkConnection = () => async (dispatch) => {
  const state = await NetInfo.fetch();
  dispatch(updateConnectionStatus(state));
};