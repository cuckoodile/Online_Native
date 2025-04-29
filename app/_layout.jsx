import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { networkInformation } from "../functions/redux/globalStore";
import NetInfoProvider from "../functions/netInfo/netInfoProvider"

import Header from "../components/Header";

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
 