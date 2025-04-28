import { Stack } from "expo-router";

import { Provider } from "react-redux";
import { networkInformation } from "../netInfo/networkInformation";
import NetInfoProvider from "../netInfo/netInfoProvider"

import Header from "../components/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <Provider store={networkInformation}>
      <NetInfoProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              header: () => <Header />,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="allproducts" />
          </Stack>
        </SafeAreaProvider>
      </NetInfoProvider>
    </Provider>
  );
}
