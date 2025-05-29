import { StyleSheet, Text, View, FlatList } from "react-native";
import { useSelector } from "react-redux";

import { useGetTransaction } from "../../../functions/API/hooks/useTransaction";

export default function MyPurchase() {
  const auth = useSelector((state) => state.auth.user) ?? null;

  const { data, isLoading, isError } = useGetTransaction(auth?.token);
  
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
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No purchases found.</Text>
      </View>
    );
  }
  const purchases = data || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Purchases</Text>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.purchaseCard}>
            <Text style={styles.date}>Date: {formatDate(item.created_at)}</Text>
            {item.items &&
              item.items.map((prod, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{prod.name}</Text>
                  <Text style={styles.itemDetail}>Qty: {prod.quantity}</Text>
                  <Text style={styles.itemDetail}>${prod.price}</Text>
                </View>
              ))}
          </View>
        )}
      />
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
  purchaseCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    flex: 2,
  },
  itemDetail: {
    flex: 1,
    textAlign: "right",
  },
});
