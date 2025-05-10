import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
  const [selectedImage, setSelectedImage] = useState(0);

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

  const productImages = product?.product_image
    ? (() => {
        try {
          const parsed = JSON.parse(product.product_image);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
          console.error("Error parsing product.product_image:", error);
          return [];
        }
      })()
    : [];

  const imageHandler = () => {
    return productImages[selectedImage] || "";
  };

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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        <View style={{ margin: 10 }}>
          <View
            style={{ aspectRatio: 1, borderRadius: 10, overflow: "hidden" }}
          >
            <Image source={{ uri: imageHandler() }} style={styles.image} />
          </View>
          <View style={styles.container}>
            {productImages.map((image, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImage(index)}
                style={styles.button}
              >
                <View>
                  <Image source={{ uri: image }} style={styles.image} />
                  <Text>No Image Available</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.text}>Description Section</Text>
        </View>
      </ScrollView>
    );
  } else {
    return <Text>Loading.....</Text>;
  }
}

const styles = StyleSheet.create({
  imagecontainer: {
    marginTop: "1rem", 
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    margin: 5,
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  text: {
    textAlign: "center",
    marginTop: 10,
  },
});
