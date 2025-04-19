import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function User() {
  const { id } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the user id {id} page.</Text>
    </View>
  );
}
