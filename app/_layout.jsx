// _layout.js
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { networkInformation } from "../functions/redux/globalStore";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../functions/theme/themes";
import NetInfoProvider from "../functions/netInfo/netInfoProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox } from "react-native";

import Header from "../components/Header";
import { useState } from "react";

LogBox.ignoreLogs(["findDOMNode is deprecated"]);

export default function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const queryClient = new QueryClient();

  return (
    <Provider store={networkInformation}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <NetInfoProvider>
            <SafeAreaProvider>
              <Stack
                screenOptions={{
                  header: () => (
                    <Header
                      isDarkMode={isDarkMode}
                      setDarkMode={setIsDarkMode}
                    />
                  ),
                }}
              >
              </Stack>
            </SafeAreaProvider>
          </NetInfoProvider>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}
