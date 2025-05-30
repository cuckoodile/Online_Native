import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { useGetTransaction } from "../../../functions/API/hooks/useTransaction";
import CheckoutProductCard from "../../../components/cards/CheckoutProductCard";
import { router } from "expo-router";

const TRANSACTION_STATUSES = [
  { id: 1, name: "Pending" },
  { id: 2, name: "Shipping" },
  { id: 3, name: "Shipped" },
  { id: 4, name: "On local hub" },
  { id: 5, name: "Received" },
  { id: 6, name: "Cancelled" },
  { id: 7, name: "Returned" },
];

export default function MyPurchase() {
  const auth = useSelector((state) => state.auth.user) ?? null;
  const { data, isLoading, isError } = useGetTransaction(auth?.token);
  const [selectedStatus, setSelectedStatus] = useState(1); // Default to Pending

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if(!auth) {
      router.replace("/login");
    }
  })

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading purchases...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Failed to load purchases.</Text>
      </View>
    );
  }
  
  // Sort purchases by date (latest first)
  const purchases = (data || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Filter transactions by selected status
  const filteredPurchases = purchases.filter(
    (tx) => tx.transaction_statuses?.id === selectedStatus
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Purchases</Text>
      {/* Status Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.statusBar, { height: 600 }]}
      >
        {TRANSACTION_STATUSES.map((status) => (
          <Pressable
            key={status.id}
            style={[
              styles.statusTab,
              selectedStatus === status.id && styles.statusTabActive,
            ]}
            onPress={() => setSelectedStatus(status.id)}
          >
            <Text
              style={[
                styles.statusTabText,
                selectedStatus === status.id && styles.statusTabTextActive,
              ]}
            >
              {status.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {/* Purchases List */}
      {filteredPurchases.length === 0 ? (
        <Text style={{ marginTop: 32, textAlign: "center", color: "#888" }}>
          No purchases for this status.
        </Text>
      ) : (
        <FlatList
          data={filteredPurchases}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.purchaseCard}>
              <Text style={styles.date}>
                Date: {formatDate(item.created_at)}
              </Text>
              <Text style={styles.statusLabel}>
                Status: {item.transaction_statuses?.name}
              </Text>
              <Text style={styles.totalLabel}>
                Total: ₱
                {Number(item.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              {item.products?.map((prod, idx) => (
                <CheckoutProductCard
                  key={prod.id + "-" + idx}
                  item={{ product: prod }}
                  img={prod.product_image?.[0]}
                  price={parseFloat(prod.price || prod.pivot?.price || 0)}
                  quantity={prod.pivot?.quantity}
                  total={
                    parseFloat(prod.price || prod.pivot?.price || 0) *
                    (prod.pivot?.quantity || 0)
                  }
                />
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statusBar: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  statusTabActive: {
    backgroundColor: "#43a047",
  },
  statusTabText: {
    color: "#333",
    fontWeight: "bold",
  },
  statusTabTextActive: {
    color: "#fff",
  },
  purchaseCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusLabel: {
    color: "#43a047",
    fontWeight: "bold",
    marginBottom: 4,
  },
  totalLabel: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});
