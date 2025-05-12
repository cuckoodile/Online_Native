import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
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
  console.log(`Fetching product from: ${BASE_URL}/api/products/${id}`);
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch product");
  }
};

export default function Product() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(0);
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
    refetch().finally(() => setRefreshing(false));
  }, []);

  const productImages = product?.product_image
    ? (() => {
        try {
          const parsed = JSON.parse(product.product_image);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
          console.error("Error parsing product images:", error);
          return [];
        }
      })()
    : [];

  const currentImage = productImages[selectedImage] || null;

  const renderObjectValue = (value) => {
    if (typeof value === "object" && value !== null) {
      if (value.created_at || value.updated_at) {
        return value.created_at
          ? new Date(value.created_at).toLocaleDateString()
          : "";
      }
      return JSON.stringify(value);
    }
    return value;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading product: {error.message}
        </Text>
        <Pressable onPress={refetch} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetching}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainImageContainer}>
          {currentImage ? (
            <Image
              source={{ uri: currentImage }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No Image Available</Text>
            </View>
          )}
        </View>

        {productImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {productImages.map((image, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImage(index)}
                style={[
                  styles.thumbnail,
                  selectedImage === index && styles.selectedThumbnail,
                ]}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.detailsContainer}>
          {Object.entries(product).map(([key, value]) => {
            if (["product_image", "id"].includes(key)) return null;

            if (value == null) return null;

            return (
              <View key={key} style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {key.replace(/_/g, " ").toUpperCase()}:
                </Text>
                <Text style={styles.detailValue}>
                  {renderObjectValue(value)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "white",
  },
  mainImageContainer: {
    aspectRatio: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  thumbnailContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  selectedThumbnail: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
});
