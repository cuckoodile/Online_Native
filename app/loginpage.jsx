import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { TextInput, useTheme } from "react-native-paper";
import { useState } from "react";
import { Pressable } from "react-native";

export default function loginpage() {
  const theme = useTheme();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(true);

  return (
    <View style={theme.wrapper.main}>
      <Text style={theme.text.title}>loginpage</Text>

      <View style={[theme.wrapper.section, { paddingHorizontal: "10%" }]}>
        {/* Username Input */}
        <View style={theme.wrapper.input}>
          <TextInput
            style={theme.components.input}
            value={inputUsername}
            onChangeText={setInputUsername}
            activeUnderlineColor="yellow"
            label="Username"
            placeholder="Enter username"
          />
        </View>

        {/* Password Input */}
        <View>
          <TextInput
            style={theme.components.input}
            value={inputPassword}
            onChangeText={setInputPassword}
            activeUnderlineColor="yellow"
            label="Password"
            placeholder="Enter username"
            secureTextEntry={isPasswordVisible}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              />
            }
          />
        </View>

        <View style={{flexDirection: "row", justifyContent: "center"}}>
          <Pressable style={theme.components.button.default}>
            <Text style={theme.text.title}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
