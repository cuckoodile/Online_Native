import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import UserAuth from "../../../components/higher-order-components/UserAuth";
import { router } from "expo-router";
import { useGetCart, useUpdateCartQuantity } from '../../../functions/API/hooks/useCart';

const ShoppingCartScreen = () => {
  const auth = useSelector((state) => state.auth.user) ?? null;
  const { data, isLoading, isError } = useGetCart();
  const { mutate: updateCartQuantity } = useUpdateCartQuantity();
  const navigation = useNavigation();
  const cartItems = data || [];
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    console.log("Cart owner id: ", auth);
    if (!auth) {
      router.replace("login");
    }
  }, [auth]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartQuantity({ itemId: id, quantity: newQuantity });
  };

  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;
  const shipping = 0;
  const total = subtotal + shipping - discount;

  const applyPromoCode = () => {
    if (promoCode === "EC020") {
      setDiscount(subtotal * 0.2);
    } else {
      setDiscount(0);
      alert('Invalid promo code. Try "EC020" for 20% off');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Failed to load cart.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Shopping Cart</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AllProducts")}
          style={styles.continueShopping}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
            </View>
            <View style={styles.quantityControls}>
              <Text style={styles.priceText}>
                P{item.price?.toLocaleString?.() ?? item.price}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  <MaterialIcons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  <MaterialIcons name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemTotal}>
                + P{(item.price * item.quantity)?.toLocaleString?.() ?? (item.price * item.quantity)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>P{subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={styles.promoSection}>
          <Text style={styles.summaryLabel}>Promo Code</Text>
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyPromoCode}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoHint}>Try code: EC020 for 20% off</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>P{total.toLocaleString()}</Text>
        </View>
        <Text style={styles.freeShippingText}>
          You've qualified for free shipping!
        </Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  continueShopping: {
    alignSelf: "flex-start",
  },
  continueShoppingText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
  },
  quantityControls: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4285F4",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  promoSection: {
    marginVertical: 12,
  },
  promoRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  promoHint: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
  },
  freeShippingText: {
    color: "#34A853",
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  checkoutButton: {
    backgroundColor: "#4285F4",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default UserAuth(ShoppingCartScreen);
