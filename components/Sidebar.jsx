import {
  View,
  Text,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, router } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Sidebar({ onOpenChange, isOpen }) {
  const { width } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(width)).current;
  const [modalVisible, setModalVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [isOpen]);

  const handleNavigation = (path) => {
    router.replace(`${path}`);
    onOpenChange(false);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        onOpenChange(false);
      }}
    >
      <Pressable style={styles.overlay} onPress={() => onOpenChange(false)} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }], backgroundColor: "#084c3c", paddingTop: insets.top }]}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Sidebar Navigations
        </Text>
        <View style={{ gap: 5 }}>
          <Pressable
            onPress={() => {
              handleNavigation("");
            }}
          >
            <Text>Home</Text>
          </Pressable>
          
          <Pressable
            onPress={() => {
              handleNavigation("allproducts");
            }}
          >
            <Text>All Products</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              handleNavigation("cart");
            }}
          >
            <Text>Cart</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              handleNavigation("admin");
            }}
          >
            <Text>Admin</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              handleNavigation("login");
            }}
          >
            <Text>Log In</Text>
          </Pressable>
          
          <Link
            href={{ pathname: "/dynamic-pages/user-profile/[id]", params: { id: "4" } }}
            onPress={() => onOpenChange(false)}
          >
            <Text>Profile</Text>
          </Link>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  sidebar: {
    width: "85%",
    height: "100%",
    backgroundColor: "white",
    position: "absolute",
    paddingHorizontal: 10,
    gap: 15,
    right: 0,
    zIndex: 20,
  },
});
