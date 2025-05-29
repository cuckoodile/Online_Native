import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useTheme } from "react-native-paper";
import axios from "axios";
import { BASE_URL } from "../functions/API/config";

import MyCarousel from "../components/MyCarousel";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";
import { useGetCart } from "../functions/API/hooks/useCart";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL: BASE_URL,
});

const fetchProducts = async () => {
  try {
    const response = await api.get("/api/products");
    // console.log("API Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch products");
  }
};

export default function Index() {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user) ?? null;

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsIsError,
    error: productsError,
    refetch: productsRefetch,
    isRefetching: productsIsRefetching,
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

  const handleRefetch = useCallback(() => {
    productsRefetch();
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      handleRefetch();
      setRefreshing(false);
    }, 500);
  }, []);

  const userProfile = [1, 4, 7];

  if (productsLoading) {
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

  if (productsIsError && productsError) {
    console.log("Error fetching products: ", productsError.message);
  } else if (!productsLoading && !productsIsError) {
    console.log("Products to render:", products);
  }

  if (user) {
    console.log("User token: ", user.token);
  }

  return (
    <View
      style={{
        backgroundColor: theme.background.primary,
        flex: 1,
        paddingTop: 5,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ width: "100%" }}
      >
        <MyCarousel carouselData={carouselData} />

        <Pressable onPress={() => handleRefetch()}>
          <Text>Refetch</Text>
        </Pressable>

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 30,
            gap: 10,
          }}
        >
          <Text style={theme.text.title}>New Arrivals</Text>

          {(!productsLoading &&
            products?.map((item) => (
              <Card key={item.id} item={item} />
            ))) || <Text>Loading....</Text>}
        </View>
      </ScrollView>
    </View>
  );
}
