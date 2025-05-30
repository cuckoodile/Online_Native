import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import UserAuth from "../../../components/higher-order-components/UserAuth";
import {
  useDeleteCartItem,
  useGetCart,
} from "../../../functions/API/hooks/useCart";
import CartProductCard from "../../../components/cards/CartProductCard";
import { Pressable } from "react-native";
import CheckoutModal from "../../../components/modals/CheckoutModal";

const ShoppingCartScreen = () => {
  const navigation = useNavigation();
  const auth = useSelector((state) => state.auth.user) ?? null;

  const removeCartMutation = useDeleteCartItem();
  const { data, isLoading, isError, refetch } = useGetCart(
    auth?.id,
    auth?.token
  );

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const shippingCost = 54;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetch();
      setRefreshing(false);
    }, 500);
  }, []);

  const handleRemoveCartItem = () => {
    // Get all selected cart item IDs
    const selectedIds = Object.keys(checkedItems).filter(
      (id) => checkedItems[id]
    );
    if (selectedIds.length === 0) return;
    const deleteData = {
      token: auth?.token,
      cart_ids: selectedIds, // pass as array for multiple deletion
    };
    console.log("Removing cart items:", deleteData);
    removeCartMutation.mutate(deleteData, {
      onSuccess: () => {
        alert("Cart item(s) removed successfully");
        setCheckedItems({});
      },
    });
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

  // Only include checked items in subtotal/total
  const checkedProducts = Array.isArray(data)
    ? data.filter((item) => checkedItems[item.id])
    : [];

  // Create the array of selected products with all product data
  const selectedProducts = checkedProducts;

  const subtotal = checkedProducts.reduce(
    (sum, item) => sum + Number(item?.product?.price) * item?.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 16,
        paddingBottom: 10,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Shopping Cart</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("allproducts")}
            style={styles.continueShopping}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Products</Text>
        <View style={styles.divider} />
        <View style={styles.section}>
          {data?.map((item) => (
            <CartProductCard
              key={item.id}
              item={item}
              token={auth?.token}
              refetch={refetch}
              checked={!!checkedItems[item.id]}
              onCheckChange={(checked) =>
                setCheckedItems((prev) => ({ ...prev, [item.id]: checked }))
              }
            />
          ))}
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              P
              {subtotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>P{shippingCost}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              P
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <Text style={styles.freeShippingText}>
            You've qualified for free shipping!
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <Pressable
            android_ripple={{ color: "black" }}
            onPress={() => handleRemoveCartItem()}
            style={[
              styles.checkoutButton,
              {
                flex: 1,
                backgroundColor:
                  checkedProducts.length === 0 ? "#bdbdbd" : "#e53935",
              },
            ]}
            disabled={checkedProducts.length === 0}
          >
            <Text style={[styles.checkoutButtonText, { color: "white" }]}>
              Remove Selected
            </Text>
          </Pressable>
          <Pressable
            android_ripple={{ color: "black" }}
            onPress={() => setModalVisible(true)}
            style={[
              styles.checkoutButton,
              {
                flex: 1,
                backgroundColor:
                  checkedProducts.length === 0 ? "#bdbdbd" : "#4285F4",
              },
            ]}
            disabled={checkedProducts.length === 0}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal */}
      <CheckoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        items={selectedProducts}
        subtotal={subtotal}
        total={total}
        shippingCost={shippingCost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
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
