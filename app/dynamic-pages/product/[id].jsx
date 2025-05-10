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
      return JSON.parse(product.product_image);
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

          <View className="space-y-4">
            <View
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={imageHandler()}
                // alt={product.name}
                className="w-full h-full object-cover"
              />
            </View>
            <View style={styles.container}>
              {productImages.map((image, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedImage(index)}
                  style={styles.button}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Pressable>
              ))}
            </View>

          </View>

            <View>
              <Text style={styles.text}>
                Where is the image?
              </Text>
            </View>

        </ScrollView>
      </View>
    );
  } else {
    return <Text>Loading.....</Text>
  }
}

const styles = StyleSheet.create({
  imagecontainer:{
    marginTop: '1rem',
  },
  container: {
    grid: "column",
    gap: "4",
  },
  button: {
    aspectRatio: "1 / 1",
    borderRadius: "2",
    border: "2",
    overflow: "hidden",
  },
  text:{
    color: 'red'
  }
  
});
