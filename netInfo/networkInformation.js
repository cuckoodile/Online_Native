import { configureStore } from '@reduxjs/toolkit';
import netInfoReducer from './netInfoSlice';

export const networkInformation = configureStore({
  reducer: {
    netInfo: netInfoReducer,
  },
});