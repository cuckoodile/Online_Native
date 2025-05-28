// _layout.js
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { store } from "../functions/redux/globalStore";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../functions/theme/themes";
import NetInfoProvider from "../functions/netInfo/netInfoProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogBox } from "react-native";

import Header from "../components/Header";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/functions/authentication/authSlice";

LogBox.ignoreLogs(["findDOMNode is deprecated"]);

export default function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    const checkSavedUser = async () => {
      const savedUser = await AsyncStorage.getItem("userCredentials");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        store.dispatch(login(parsedUser));
      }
    };

    checkSavedUser();
  }, []);

  return (
    <Provider store={store}>
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
              />
            </SafeAreaProvider>
          </NetInfoProvider>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}
