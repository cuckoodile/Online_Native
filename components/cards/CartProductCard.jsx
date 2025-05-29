import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { useUpdateCartQuantity } from "../../functions/API/hooks/useCart";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image as ExpoImage } from 'expo-image';

export default function CartProductCard({ item, token, refetch, checked = false, onCheckChange }) {
  const mutateCartQuantity = useUpdateCartQuantity();
  const debounceRef = useRef({});
  const isFirstRender = useRef(true);

  const [quantity, setQuantity] = useState(item?.quantity);
  const [total, setTotal] = useState(item?.product.price * item?.quantity);

  useEffect(() => {
    const newTotal = item?.product.price * quantity;
    setTotal(newTotal);

    if (debounceRef.current[item?.product.id]) {
      clearTimeout(debounceRef.current[item?.product.id]);
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    debounceRef.current[item?.product.id] = setTimeout(() => {
      mutateCartQuantity.mutate(
        {
          token: token,
          itemId: item?.id,
          quantity: quantity,
        },
        {
          onSuccess: () => {
            if (refetch) refetch();
          },
        }
      );
    }, 1000);
  }, [quantity]);

  return (
    <View style={styles.cartItem}>
      {/* Checkbox */}
      <Pressable
        onPress={() => onCheckChange && onCheckChange(!checked)}
        style={{ marginRight: 12, justifyContent: 'center' }}
      >
        <View style={[styles.checkbox, checked && styles.checkedBoxGreen]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>
      {/* Product Image */}
      {item?.product?.product_image?.[0] ? (
        <ExpoImage
          source={item.product.product_image[0]}
          style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' }}
          contentFit="cover"
        />
      ) : (
        <View style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' }} />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item?.product.name}</Text>
        <Text style={styles.productCategory}>{item?.product.category_name}</Text>
      </View>

      <View style={styles.quantityControls}>
        <Text style={styles.priceText}>P{item?.product.price}</Text>

        <View style={styles.quantityContainer}>
          <Pressable
            onPress={() =>
              setQuantity((prev) => {
                const newQuantity = prev - 1;
                return newQuantity;
              })
            }
            style={styles.quantityButton}
          >
            <MaterialIcons name="remove" size={20} color="#333" />
          </Pressable>

          <Text style={styles.quantityText}>{quantity}</Text>

          <Pressable
            onPress={() =>
              setQuantity((prev) => {
                const newQuantity = prev + 1;
                return newQuantity;
              })
            }
            style={styles.quantityButton}
          >
            <MaterialIcons name="add" size={20} color="#333" />
          </Pressable>
        </View>

        <Text style={styles.itemTotalGreen}>{total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

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
  itemTotalGreen: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#43a047",
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
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#43a047',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkedBoxGreen: {
    backgroundColor: '#43a047',
    borderColor: '#43a047',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
