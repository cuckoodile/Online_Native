import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Switch, useTheme } from "react-native-paper";

import Sidebar from "./Sidebar";

const Header = ({ isDarkMode, setDarkMode }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const netInfo = useSelector((state) => state.netInfo);
  const auth = useSelector((state) => state.auth.user) ?? null;

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path) => {
    router.replace(`${path}`);
  };

  return (
    <View
      style={{
        backgroundColor: theme.background.tertiary,
        position: "sticky",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        top: 0,
        left: 0,
        paddingHorizontal: 10,
        paddingTop: insets.top,
        zIndex: 10,
      }}
    >
      <Pressable style={{ padding: 5 }} onPress={() => handleNavigation("/")}>
        <Text style={{color: "white"}}>DevSix</Text>
      </Pressable>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Switch
          value={isDarkMode}
          onValueChange={() => setDarkMode(!isDarkMode)}
          theme={theme}
        />

        <Ionicons
          name={netInfo.isConnected ? "wifi-outline" : "cloud-offline-outline"}
          size={27}
          color="white"
        />

        <Pressable
          style={{ padding: 5 }}
          android_ripple={{ color: "grey" }}
          onPress={() =>
            auth
              ? handleNavigation(`/profile/${auth.id}/mycart`)
              : handleNavigation("login")
          }
        >
          <Ionicons name="cart-outline" size={27} color="white" />
        </Pressable>
        <Pressable
          style={{ padding: 5 }}
          android_ripple={{ color: "grey" }}
          onPress={() =>
            auth
              ? handleNavigation(`/profile/${auth.id}`)
              : handleNavigation("login")
          }
        >
          <Ionicons name="person-circle-outline" size={27} color="white" />
        </Pressable>
        <Pressable
          style={{ padding: 5 }}
          android_ripple={{ color: "grey" }}
          onPress={() => setSidebarOpen(!isSidebarOpen)}
        >
          <Ionicons name="menu" size={27} color="white" />
        </Pressable>
      </View>

      <Sidebar isOpen={isSidebarOpen} onOpenChange={setSidebarOpen} />
    </View>
  );
};

export default Header;
