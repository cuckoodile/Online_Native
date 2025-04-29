import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useTheme } from "react-native-paper";
import axios from "axios";
import { BASE_URL } from "../API/config";

import MyCarousel from "../components/MyCarousel";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";

/* 
  COLOR SCHEMES
    LIGHT
      bg: rgb(68, 98, 74)
      primary-bg: rgb(192, 207, 178)
      secondary-bg: rgb(139, 168, 136)
*/

// API Data Fetch Test
const api = axios.create({
  baseURL: BASE_URL,
});

const fetchProducts = async () => {
  try {
    const response = await api.get("/api/products");
    console.log("API Response:", response.data);
    return response.data; // Make sure this is an array
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch products");
  }
};

export default function Index() {
  const theme = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const carouselData = [
    {
      id: 1,
      image: "https://picsum.photos/seed/1/3000/2000",
    },
    {
      id: 2,
      image: "https://picsum.photos/seed/2/3000/2000",
    },
    {
      id: 3,
      image: "https://picsum.photos/seed/3/3000/2000",
    },
    {
      id: 4,
      image: "https://picsum.photos/seed/4/3000/2000",
    },
    {
      id: 5,
      image: "https://picsum.photos/seed/5/3000/2000",
    },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetch();
      setRefreshing(false);
    }, 500);
  }, []);

  const userProfile = [1, 4, 7];

  if (isError) {
    console.log("Error fetching products: ", error.message);
  } else {
    console.log("Products to render:", products); // Debug what you're getting
  }

  return (
    <View
      style={{
        backgroundColor: theme.background.primary,
        flex: 1,
        paddingTop: 5,
      }}
    >
      {isLoading && (
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
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        style={{ width: "100%" }}
      >
        <MyCarousel carouselData={carouselData} />
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 30,
            gap: 10,
          }}
        >
          <Text style={{ color: "white" }}>New Arrivals</Text>

          {Array.isArray(products) && products.length > 0 ? (
            products.map((item) => (
              <Card key={item.id} item={item} cart={userProfile} />
            ))
          ) : (
            <Text style={{ color: "white" }}>No products available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

<Card />;
