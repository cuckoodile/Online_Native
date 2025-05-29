import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Image } from "expo-image";
import { usePostTransaction } from "../../functions/API/hooks/useTransaction";

const PAYMENT_METHODS = [
  { key: "cod", label: "Cash on Delivery" },
  { key: "gcash", label: "GCash" },
  { key: "paymaya", label: "PayMaya" },
  { key: "bdo", label: "BDO" },
  { key: "cebuana", label: "Cebuana" },
];

export default function CheckoutModal({
  visible,
  onClose,
  items = [],
  subtotal = 0,
  total = 0,
  shippingCost = 0,
}) {
  const auth = useSelector((state) => state.auth.user) ?? null;
  const transactionMutation = usePostTransaction();

  const [selectedPayment, setSelectedPayment] = useState(
    PAYMENT_METHODS[0].key
  );
  const [transactionData, setTransactionData] = useState({
    payment_method_id:
      PAYMENT_METHODS.findIndex((m) => m.key === selectedPayment) + 1,
    type_id: 1,
    status_id: 1,
    address_id: auth?.address?.id,
    products: items.map((item) => ({
      product_id: item?.product?.id,
      quantity: item?.quantity,
    })),
  });

  // Keep transactionData in sync with selectedPayment and items
  React.useEffect(() => {
    setTransactionData((prev) => ({
      ...prev,
      payment_method_id:
        PAYMENT_METHODS.findIndex((m) => m.key === selectedPayment) + 1,
      products: items.map((item) => ({
        product_id: item?.product?.id,
        quantity: item?.quantity,
      })),
      address_id: auth?.address?.id,
    }));
  }, [selectedPayment, items, auth]);

  const handleSubmit = () => {
    transactionMutation.mutate(
      {
        token: auth?.token,
        data: transactionData,
      },
      {
        onSuccess: (res) => {
          onClose(false);
        },
        onError: (error) => {
          console.error("Transaction error:", error);
        },
      }
    );
  };

  if (!visible) return null;

  const address = auth?.address;

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
          height: "85%",
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
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Checkout</Text>
          <Pressable onPress={() => onClose(false)}>
            <Text style={{ fontSize: 20, color: "#888" }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Items
          </Text>
          {items?.map((item, index) => {
            const img = item?.product?.product_image?.[0];
            const price = parseFloat(item?.product?.price || 0);
            const quantity = item?.quantity || 0;
            const total = price * quantity;

            return (
              <View
                key={index}
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
          })}

          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#eee",
              marginVertical: 16,
            }}
          />

          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Shipping Address
          </Text>
          {address ? (
            <View
              style={{
                backgroundColor: "#f3f3f3",
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{address?.name}</Text>
              <Text>{address?.house_address}</Text>
              <Text>
                {address?.baranggay}, {address?.city}
              </Text>
              <Text>
                {address?.region}{" "}
                {address?.province !== "null" ? address?.province : ""}{" "}
                {address?.zip_code}
              </Text>
            </View>
          ) : (
            <Text style={{ color: "#888", marginBottom: 16 }}>
              No address found.
            </Text>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Payment Method
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {PAYMENT_METHODS.map((method, index) => (
              <TouchableOpacity
                key={method.key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    selectedPayment === method.key ? "#43a047" : "#f3f3f3",
                  borderRadius: 20,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginRight: 10,
                  marginBottom: 10,
                }}
                onPress={() => setSelectedPayment(method.key)}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    borderWidth: 2,
                    borderColor:
                      selectedPayment === method.key ? "#43a047" : "#bbb",
                    backgroundColor:
                      selectedPayment === method.key ? "#43a047" : "#fff",
                    marginRight: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedPayment === method.key && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#fff",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    color: selectedPayment === method.key ? "#fff" : "#333",
                    fontWeight: "bold",
                  }}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#eee",
              marginVertical: 16,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text style={{ color: "#888", fontSize: 15 }}>Subtotal</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              ₱{Number(subtotal).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text style={{ color: "#888", fontSize: 15 }}>Shipping</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              ₱{Number(shippingCost).toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ color: "#43a047", fontWeight: "bold", fontSize: 18 }}
            >
              Total
            </Text>
            <Text
              style={{ color: "#43a047", fontWeight: "bold", fontSize: 18 }}
            >
              ₱{Number(total).toFixed(2)}
            </Text>
          </View>
        </ScrollView>

        <Pressable
          style={{
            backgroundColor: "#43a047",
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={() => handleSubmit()}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            Place Order
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
