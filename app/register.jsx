import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { usePostUser } from "../functions/API/hooks/useUser";

const RegisterScreen = () => {
  const postUserMutation = usePostUser();

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    contact_number: "",
    password: "",
    confirmPassword: "",
    is_admin: 0,
  });

  const handleRegister = () => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Remove confirmPassword before sending data
    const { confirmPassword, ...registerData } = data;
    console.log("Registering with:", registerData);

    postUserMutation.mutate(registerData, {
      onSuccess: (response) => {
        console.log("User registered successfully:", response);
        alert("Registration successful! Please log in.");
        router.replace("login");
      },
      onError: (error) => {
        console.error("Error registering user:", error);
        alert("Registration failed. Please try again.");
      },
    })
  };

  const handleNavigation = (path) => {
    router.replace(`${path}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create new account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={data.first_name}
        onChangeText={(text) => setData({ ...data, first_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={data.last_name}
        onChangeText={(text) => setData({ ...data, last_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={data.username}
        onChangeText={(text) => setData({ ...data, username: text })}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={data.email}
        onChangeText={(text) => setData({ ...data, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={data.contact_number}
        onChangeText={(text) => setData({ ...data, contact_number: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={data.password}
        onChangeText={(text) => setData({ ...data, password: text })}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={data.confirmPassword}
        onChangeText={(text) => setData({ ...data, confirmPassword: text })}
        secureTextEntry
      />

      <Pressable style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </Pressable>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Pressable
          onPress={() => {
            handleNavigation("login");
          }}
        >
          <Text style={styles.loginLink}>Login</Text>
        </Pressable>
      </View>

      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and
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
  registerButton: {
    backgroundColor: "#084c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "#084c3c",
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RegisterScreen;
