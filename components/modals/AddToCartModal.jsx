import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useAddToCart } from "../../functions/API/hooks/useCart";
import { router } from "expo-router";

export default function AddToCartModal({
  visible,
  onClose,
  product = {},
  selectedImageIdx = 0,
  quantity,
  setQuantity,
  auth,
}) {
  if (!visible) return null;

  const addToCartMutation = useAddToCart();
  const images = product.product_image || [];
  const mainImage = images[selectedImageIdx] || images[0];
  const stock = product.stock || 0;

  // Product specifications (flatten details)
  let specifications = [];
  if (
    Array.isArray(product.product_specifications) &&
    product.product_specifications.length > 0
  ) {
    const details = product.product_specifications[0]?.details || {};
    specifications = Object.values(details).filter((v) =>
      typeof v === "object" ? Object.keys(v).length > 0 : true
    );
  }

  const handleAdd = () => {
    if (!auth || !auth.id) {
        router.replace("/login");
    }

    const data = {
      auth: auth,
      product_id: product?.id,
      quantity: quantity,
    };

    console.log("Adding to cart: ", data);
    addToCartMutation.mutate(data, {
      onSuccess: () => {
        onClose(false);
        setQuantity(1);
        alert("Product added to cart successfully!");
      },
    });
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000,
      }}
    >
      <Pressable
        onPress={() => onClose(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View
        style={{
          backgroundColor: "#fff",
          height: "60%",
          width: "100%",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Add to Cart</Text>
          <Pressable onPress={() => onClose(false)}>
            <Text style={{ fontSize: 20, color: "#888" }}>✕</Text>
          </Pressable>
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Product Image and Info */}
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
                backgroundColor: "#f5f5f5",
                marginRight: 16,
                overflow: "hidden",
              }}
            >
              {mainImage ? (
                <ExpoImage
                  source={mainImage}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No Image</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}
              >
                {product.name}
              </Text>
              <Text
                style={{ color: "#888", fontSize: 14, marginBottom: 4 }}
                numberOfLines={2}
              >
                {product.description}
              </Text>
              <Text
                style={{ color: "#43a047", fontWeight: "bold", fontSize: 15 }}
              >
                Stock: {stock}
              </Text>
            </View>
          </View>
          {/* Quantity Selector */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginRight: 12 }}>
              Quantity
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: 6,
                padding: 6,
                marginRight: 8,
              }}
              disabled={quantity <= 1}
            >
              <Text
                style={{ fontSize: 20, color: quantity <= 1 ? "#bbb" : "#222" }}
              >
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                minWidth: 28,
                textAlign: "center",
              }}
            >
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.min(stock, q + 1))}
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: 6,
                padding: 6,
                marginLeft: 8,
              }}
              disabled={quantity >= stock}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: quantity >= stock ? "#bbb" : "#222",
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
          {/* Specifications */}
          {specifications.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Specifications:
              </Text>
              {specifications.map((spec, idx) => (
                <View key={idx} style={{ marginLeft: 8, marginBottom: 2 }}>
                  {Object.entries(spec).map(([k, v]) => (
                    <Text key={k} style={{ color: "#555", fontSize: 14 }}>
                      • {k}: {v}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <Pressable
          style={{
            backgroundColor: "#43a047",
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={handleAdd}
          disabled={stock === 0}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
