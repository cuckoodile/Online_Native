import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../components/Card";

import { useGetProduct } from "../functions/API/hooks/useProduct";
import { useGetCategory } from "../functions/API/hooks/useCategory";

const CollectionScreen = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsIsError,
    refetch: productsRefetch,
  } = useGetProduct();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesIsError,
    refetch: categoriesRefetch,
  } = useGetCategory();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefetch = useCallback(() => {
    productsRefetch();
    categoriesRefetch();
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      handleRefetch();
      setRefreshing(false);
    }, 500);
  }, []);

  if (productsLoading || categoriesLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (productsIsError || categoriesIsError) {
    return (
      <View style={styles.container}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  console.log("All Products Page Items:", products);
  console.log("All Products Page Categories:", categories);

  if (products.length > 0) {
    return (
      <View style={styles.container}>
        {/* Top Description */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>COLLECTION</Text>
          <Text style={styles.subheader}>
            Explore our curated selection of premium sustainable fashion pieces
            designed for the eco-conscious individual.
          </Text>
        </View>

        {/* Product Cards Section */}
        {(products.length > 0 && (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.cardContainer}
          >
            {products.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </ScrollView>
        )) || (
          <View>
            <Text>No products available</Text>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  cardContainer: {
    gap: 15,
  },
});

export default CollectionScreen;
