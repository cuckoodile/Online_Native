import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";

import { BASE_URL } from "../../../API/config";
import { useQuery } from "@tanstack/react-query";

const api = axios.create({
  baseURL: BASE_URL,
});

const fetchProducts = async (id) => {
  console.log(`fetching from: ${BASE_URL}/api/products/${id}`);
  try {
    const response = await api.get(`/api/products/${id}`);

    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch products");
  }
};

export default function Product() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProducts(id),
    staleTime: 1000 * 60 * 5,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetch();
      setRefreshing(false);
    }, 500);
  }, []);

  console.log("Product selected:", product);

  if (isLoading) {
    <View
      style={{
        backgroundColor: "rgba(0, 0, 0, .4)",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <ActivityIndicator size={60} />
    </View>;
  }

  if (isError) {
    console.log("Error fetching products: ", error.message);
  } else if (!isLoading && !isError) {
    console.log("Products to render:", product);
  }

  if (!isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        >
          <Text>product id: {id}</Text>
          <Text>product id: {product.name}</Text>
        </ScrollView>
      </View>
    );
  }
}
