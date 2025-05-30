import { View, Text, Image } from "react-native";
import React from "react";

export default function CheckoutProductCard({item, img, price, quantity, total}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
      }}
    >
      {img ? (
        <Image
          source={{ uri: img }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
            marginRight: 10,
            backgroundColor: "#eee",
          }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#eee",
            borderRadius: 8,
            marginRight: 10,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          {item?.product?.name}
        </Text>
        <Text style={{ color: "#888", fontSize: 13 }}>
          {item?.product?.category_name}
        </Text>
        <Text style={{ color: "#333", fontSize: 13 }}>
          ₱{price.toFixed(2)} x {quantity}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          ₱{total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
