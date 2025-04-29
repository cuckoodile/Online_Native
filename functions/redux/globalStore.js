import { configureStore } from '@reduxjs/toolkit';
import netInfoReducer from '../netInfo/netInfoSlice';

export const networkInformation = configureStore({
  reducer: {
    netInfo: netInfoReducer,
  },
});