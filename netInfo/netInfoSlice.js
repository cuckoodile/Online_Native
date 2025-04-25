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

// Export the action creator
export const { updateConnectionStatus } = netInfoSlice.actions;

// Export the reducer
export default netInfoSlice.reducer;

// Thunk function to check connection status
export const checkConnection = () => async (dispatch) => {
  const state = await NetInfo.fetch();
  dispatch(updateConnectionStatus(state));
};