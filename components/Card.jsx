import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

export default function Card({ item }) {
  const handleProductNavigation = (id) => {
    router.replace(`/product/${id}/`);
  };

  return (
    <View
      style={{
        backgroundColor: "rgb(192, 207, 178)",
        overflow: "hidden",
        elevation: 10,
        borderRadius: 10,
      }}
    >
      <Pressable
        android_ripple={{ color: "black" }}
        onPress={() => handleProductNavigation(item.id)}
      >
        {/* Image */}
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            height: 170,
          }}
        >
          <Image
            source="https://picsum.photos/seed/696/3000/2000"
            style={{
              backgroundColor: "red",
              width: "100%",
              height: "100%",
            }}
          />
        </View>

        {/* Text Wrapper */}
        <View
          style={{
            flex: 1,
            padding: 10,
            gap: 5,
          }}
        >
          <Text style={{ color: "green" }}>
            {item.category.name ?? "No category!"}
          </Text>

          <Text>{item.name ?? "No title!"}</Text>

          {/* Price and Cart */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "green" }}>
              P{item.price ?? "No price!"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
