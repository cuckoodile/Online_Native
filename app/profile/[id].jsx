import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UserAuth from "../../components/higher-order-components/UserAuth";
import { useSelector } from "react-redux";
import useUser from "../../functions/API/hooks/useUser";

function Profile() {
  const auth = useSelector((state) => state.auth.user);
  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
  } = useUser(auth?.id, auth?.token);

  // Helper to get profile image
  const getProfileImageUrl = (userData) => {
    if (!userData || !userData.profile || !userData.profile.profile_image)
      return null;
    return userData.profile.profile_image;
  };

  // Helper to get full address details
  const getUserAddressDetails = (address) => {
    if (!address) return null;
    return [
      { label: "Address Name", value: address.name },
      { label: "House Address", value: address.house_address },
      { label: "Region", value: address.region },
      { label: "Province", value: address.province },
      { label: "City", value: address.city },
      { label: "Barangay", value: address.baranggay },
      { label: "Zip Code", value: address.zip_code },
    ].filter((item) => item.value && item.value !== "null");
  };

  // Helper to get 5 latest transactions
  const getLatestTransactions = (transactions) => {
    if (!transactions || !Array.isArray(transactions)) return [];
    return [...transactions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  };

  if (userLoading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (userIsError) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error fetching user</Text>
      </View>
    );
  }

  const profile = userData.profile || {};
  const address = userData.address || {};
  const transactions = userData.transactions || [];
  const addressDetails = getUserAddressDetails(address);
  const latestTransactions = getLatestTransactions(transactions);

  console.log("Profile URL:", auth?.profile?.profile_image);

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: auth?.profile?.profile_image }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.name}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={styles.username}>@{userData.username}</Text>
          </View>
        </View>
      </View>

      {/* Personal Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact Number</Text>
          <Text style={styles.infoValue}>{profile.contact_number || "-"}</Text>
        </View>
      </View>

      {/* Shipping Address Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {addressDetails && addressDetails.length > 0 ? (
          addressDetails.map((item, idx) => (
            <View style={styles.infoItem} key={idx}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoValue}>
            No address in stored user profile
          </Text>
        )}
      </View>

      {/* Latest Transactions Card */}
      <View style={styles.card}>
        <View style={styles.recommendedHeader}>
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
        </View>
        {latestTransactions.length === 0 ? (
          <Text style={styles.infoValue}>No transactions found.</Text>
        ) : (
          latestTransactions.map((txn) => (
            <View style={styles.transactionItem} key={txn.id}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="receipt"
                  size={20}
                  color="#4285F4"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.transactionId}>Transaction #{txn.id}</Text>
              </View>
              <Text style={styles.transactionDate}>
                {new Date(txn.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#222",
  },
  username: {
    fontSize: 15,
    color: "#888",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  transactionItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  transactionId: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  transactionDate: {
    fontSize: 13,
    color: "#888",
    marginLeft: 28,
    marginTop: 2,
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserAuth(Profile);
