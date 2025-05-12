import { configureStore } from "@reduxjs/toolkit";
import netInfoReducer from "../netInfo/netInfoSlice";
import authSlice from "../authentication/authSlice";

export const store = configureStore({
  reducer: {
    netInfo: netInfoReducer,
    auth: authSlice,
  },
});
