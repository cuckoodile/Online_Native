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
import { BASE_URL } from "../../functions/API/config";
import { useQuery } from "@tanstack/react-query";
import { useGetProductById } from "../../functions/API/hooks/useProduct";
import { Image as ExpoImage } from "expo-image";
import CommentCard from "../../components/cards/CommentCard";
import ProductReviewCard from "../../components/cards/ProductReviewCard";
import { useAddToCart } from "../../functions/API/hooks/useCart";
import { useSelector } from "react-redux";
import AddToCartModal from "../../components/modals/AddToCartModal";

export default function Product() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const auth = useSelector((state) => state.auth.user) ?? null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useGetProductById(id);

  const [quantity, setQuantity] = useState(1);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43a047" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No product found.</Text>
      </View>
    );
  }

  // Product images
  const images = product.product_image || [];
  const mainImage = images[selectedImage] || images[0];

  // Product specifications (flatten details)
  let specifications = [];
  if (
    Array.isArray(product.product_specifications) &&
    product.product_specifications.length > 0
  ) {
    const details = product.product_specifications[0]?.details || {};
    specifications = Object.values(details).filter((v) =>
      typeof v === "object" ? Object.keys(v).length > 0 : true
    );
  }

  // Product comments
  const comments = product.product_comments || [];

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{ color: i <= rating ? "#FFD700" : "#ccc", fontSize: 16 }}
        >
          ★
        </Text>
      );
    }
    return (
      <View style={{ flexDirection: "row", marginBottom: 2 }}>{stars}</View>
    );
  };

  // Helper to format comment date
  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      {/* Add To Cart Modal */}
      <AddToCartModal
        visible={showAddToCart}
        onClose={setShowAddToCart}
        product={product}
        selectedImageIdx={selectedImage}
        quantity={quantity}
        auth={auth}
        setQuantity={setQuantity}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetching}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
          {mainImage ? (
            <ExpoImage
              source={mainImage}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No Image</Text>
            </View>
          )}
        </View>
        {/* Thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {images.map((img, idx) => (
            <Pressable
              key={idx}
              onPress={() => setSelectedImage(idx)}
              style={[
                styles.thumbnail,
                selectedImage === idx && styles.selectedThumbnail,
              ]}
            >
              <ExpoImage
                source={img}
                style={styles.thumbnailImage}
                contentFit="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 6 }}>
            {product.name}
          </Text>
          <Text
            style={{ color: "#43a047", fontWeight: "bold", marginBottom: 6 }}
          >
            {product.category_name}
          </Text>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 10 }}>
            {product.description}
          </Text>
          <Text style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>
            Available Stock:{" "}
            <Text style={{ color: "#43a047", fontWeight: "bold" }}>
              {product.stock}
            </Text>
          </Text>
          {/* Specifications */}
          {specifications.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Specifications:
              </Text>
              {specifications.map((spec, idx) => (
                <View key={idx} style={{ marginLeft: 8, marginBottom: 2 }}>
                  {Object.entries(spec).map(([k, v]) => (
                    <Text key={k} style={{ color: "#555", fontSize: 14 }}>
                      • {k}: {v}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
        {/* Comments Section */}
        <View style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
            Customer Reviews
          </Text>
          {/* Review Summary */}
          <ProductReviewCard comments={comments} />
          {comments.length === 0 ? (
            <Text style={{ color: "#888", fontSize: 15 }}>No reviews yet.</Text>
          ) : (
            comments.map((c, idx) => {
              const user = c.user;
              const profileImg = user?.profile?.profile_image
                ? user.profile.profile_image.startsWith("http")
                  ? user.profile.profile_image
                  : `${BASE_URL.replace(
                      /\/$/,
                      ""
                    )}/${user.profile.profile_image.replace(/^\//, "")}`
                : null;
              return (
                <CommentCard
                  key={c.id}
                  profileImg={profileImg}
                  username={user?.username || `User #${c.user_id}`}
                  date={formatCommentDate(c.created_at)}
                  rating={c.rating}
                  comment={c.comment}
                />
              );
            })
          )}
        </View>
        {/* Action Buttons */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#43a047",
              borderRadius: 8,
              padding: 14,
              alignItems: "center",
            }}
            onPress={() => setShowAddToCart(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
              Add to Cart
            </Text>
          </Pressable>
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
