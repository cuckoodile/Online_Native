import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Card({ item, cart }) {
  const [onCart, setCart] = useState(cart?.includes(item?.id) ? true : false);
  const navigation = useNavigation();

  const cartSize = 23;

  function handleCartClick() {
    setCart(!onCart);
  }

  const handleProductNavigation = (id) => {
    router.replace(`/dynamic-pages/product/${id}`);
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

            <Pressable onPress={() => handleCartClick()}>
              <View
                style={{
                  width: cartSize * 1.7,
                  height: cartSize * 1.7,
                  borderRadius: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                }}
              >
                <Ionicons
                  name={onCart ? "checkmark" : "cart-outline"}
                  size={cartSize}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
