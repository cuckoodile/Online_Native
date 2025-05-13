import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useLogin } from "../functions/API/hooks/useAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../functions/authentication/authSlice";
import GuestAuth from "../components/higher-order-components/GuestAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const loginMutation = useLogin();
  const auth = useSelector((selector) => selector.auth);

  const [rememberMe, setRememberMe] = useState(false);

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    loginMutation.mutate(data, {
      onSuccess: async (userData) => {
        dispatch(login(userData.data));
        if (rememberMe) {
          try {
            await AsyncStorage.setItem("userCredentials", JSON.stringify(userData.data)).then((data) => {
              console.log("User credentials stored successfully:");
            });
          } catch (error) {
            console.error("Failed to store user credentials:", error.message);
          }
        }
        handleNavigation("/");
      },
      onError: (error) => {
        console.error("Login failed:", error.message);
        Alert.alert("Login Error", "Invalid email or password.");
      },
    });
  };

  const handleNavigation = (path) => {
    router.replace(`${path}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={data.username}
        onChangeText={(text) => setData({ ...data, username: text })}
        keyboardType="text"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={data.password}
        onChangeText={(text) => setData({ ...data, password: text })}
        secureTextEntry
      />

      <View style={styles.rememberMeContainer}>
        <Pressable onPress={() => setRememberMe(!rememberMe)}>
          <View style={[styles.checkbox, rememberMe && styles.checked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View>

      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account yet? </Text>
        <Pressable
          onPress={() => {
            handleNavigation("register");
          }}
        >
          <Text style={styles.signUpLink}>Sign up</Text>
        </Pressable>
      </View>

      <View style={styles.testCredentials}>
        <Text style={styles.testText}>Admin: admin@example.com / admin123</Text>
        <Text style={styles.testText}>User: user@example.com / user123</Text>
      </View>

      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#084c3c",
    borderColor: "#084c3c",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#666",
  },
  loginButton: {
    backgroundColor: "#084c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  signUpText: {
    fontSize: 14,
    color: "#666",
  },
  signUpLink: {
    fontSize: 14,
    color: "#084c3c",
    fontWeight: "bold",
  },
  testCredentials: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  testText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  termsText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default GuestAuth(LoginScreen);
