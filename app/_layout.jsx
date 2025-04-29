// _layout.js
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { networkInformation } from "../functions/redux/globalStore";
import { PaperProvider } from "react-native-paper";
import {lightTheme, darkTheme} from "../functions/theme/themes"
import NetInfoProvider from "../functions/netInfo/netInfoProvider";

import Header from "../components/Header";
import { useState } from "react";

export default function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Provider store={networkInformation}>
      <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <NetInfoProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                header: () => <Header isDarkMode={isDarkMode} setDarkMode={setIsDarkMode} />,
              }}
            />
          </SafeAreaProvider>
        </NetInfoProvider>
      </PaperProvider>
    </Provider>
  );
}
