import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import Sidebar from "./Sidebar";
import { useNavigation, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const netInfo = useSelector((state) => state.netInfo);

  const handleNavigation = (path, params) => {
    if (params?.id) {
      router.replace(`/${params.id}`);
    } else {
      router.replace(`/${path}`);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#084c3c",
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
      <Pressable style={{ padding: 5 }} onPress={() => handleNavigation("")}>
        <Text>DevSix</Text>
      </Pressable>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Ionicons name={netInfo.isConnected ? "wifi-outline" : "cloud-offline-outline"} size={27} color="black" />

        <Pressable
          style={{ padding: 5 }}
          android_ripple={{ color: "grey" }}
          onPress={() => handleNavigation("cart")}
        >
          <Ionicons name="cart-outline" size={27} color="black" />
        </Pressable>

        <Pressable
          style={{ padding: 5 }}
          android_ripple={{ color: "grey" }}
          onPress={() => handleNavigation("[id]", { id: "3" })} // Replace this with the current user ID
        >
          <Ionicons name="person-circle-outline" size={27} color="black" />
        </Pressable>

        <Pressable
          style={{ padding: 5 }}
          android_ripple={{ color: "grey" }}
          onPress={() => setSidebarOpen(!isSidebarOpen)}
        >
          <Ionicons name="menu" size={27} color="black" />
        </Pressable>
      </View>

      <Sidebar isOpen={isSidebarOpen} onOpenChange={setSidebarOpen} />
    </View>
  );
}
