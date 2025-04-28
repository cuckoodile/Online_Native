import { Stack } from "expo-router";

import { Provider } from "react-redux";
import { networkInformation } from "../netInfo/networkInformation";
import NetInfoProvider from "../netInfo/netInfoProvider"

import Header from "../components/Header";

export default function RootLayout() {
  return (
    <Provider store={networkInformation}>
      <NetInfoProvider>
        <Stack
          screenOptions={{
            header: () => <Header />,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="allproducts" />
        </Stack>
      </NetInfoProvider>
    </Provider>
  );
}
 