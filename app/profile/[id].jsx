import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UserAuth from "../../components/higher-order-components/UserAuth";
import { useSelector } from "react-redux";
import { useUser, usePatchUser } from "../../functions/API/hooks/useUser";
import * as ImagePicker from "expo-image-picker";

function Profile() {
  const auth = useSelector((state) => state.auth.user);
  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
  } = useUser(auth?.id, auth?.token);
  const patchUserMutation = usePatchUser();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // Local state for editable fields
  const [editProfile, setEditProfile] = useState({
    first_name: "",
    last_name: "",
    contact_number: "",
    email: "",
    username: "",
  });
  const [editAddress, setEditAddress] = useState({
    name: "",
    house_address: "",
    region: "",
    province: "",
    city: "",
    baranggay: "",
    zip_code: "",
  });

  const [editData, setEditData] = useState({
    // Profile data
    username: editProfile?.username,
    email: editProfile?.email,
    first_name: editProfile?.first_name,
    last_name: editProfile?.last_name,
    contact_number: editProfile?.contact_number,
    profile_image: selectedImage ? selectedImage : auth?.profile?.profile_image,

    // Address data
    address: {
      name: editAddress?.name,
      house_address: editAddress?.house_address,
      region: editAddress?.region,
      province: editAddress?.province,
      city: editAddress?.city,
      baranggay: editAddress?.baranggay,
      zip_code: editAddress?.zip_code,
    },
  });

  // Store original data for cancel
  const [originalProfile, setOriginalProfile] = useState(null);
  const [originalAddress, setOriginalAddress] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  // Update local state when userData loads or changes
  React.useEffect(() => {
    if (userData && userData.profile) {
      setEditProfile({
        first_name: userData.profile.first_name || "",
        last_name: userData.profile.last_name || "",
        contact_number: userData.profile.contact_number || "",
        email: userData.email || "",
        username: userData.username || "",
      });
    }
    if (userData && userData.address) {
      setEditAddress({
        name: userData.address.name || "",
        house_address: userData.address.house_address || "",
        region: userData.address.region || "",
        province: userData.address.province || "",
        city: userData.address.city || "",
        baranggay: userData.address.baranggay || "",
        zip_code: userData.address.zip_code || "",
      });
    } else {
      setEditAddress({
        name: "",
        house_address: "",
        region: "",
        province: "",
        city: "",
        baranggay: "",
        zip_code: "",
      });
    }
  }, [userData]);

  // Image picker handler (Expo docs compliant)
  const handlePickImage = async () => {
    if (!isEditing) return;
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setEditData((prev) => ({ ...prev, profile_image: result.assets[0].uri }));
    }
  };

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

  React.useEffect(() => {
    // Set editData when profile/address changes
    setEditData({
      username: editProfile?.username,
      email: editProfile?.email,
      first_name: editProfile?.first_name,
      last_name: editProfile?.last_name,
      contact_number: editProfile?.contact_number,
      profile_image: selectedImage || getProfileImageUrl(userData) || "",
      name: editAddress?.name,
      house_address: editAddress?.house_address,
      region: editAddress?.region,
      province: editAddress?.province,
      city: editAddress?.city,
      baranggay: editAddress?.baranggay,
      zip_code: editAddress?.zip_code,
    });
  }, [editProfile, editAddress, selectedImage, userData]);

  // When entering edit mode, store originals
  const startEditing = () => {
    setOriginalProfile(editProfile);
    setOriginalAddress(editAddress);
    setOriginalImage(selectedImage);
    setIsEditing(true);
  };

  // Cancel editing: revert all changes
  const cancelEditing = () => {
    setEditProfile(originalProfile);
    setEditAddress(originalAddress);
    setSelectedImage(originalImage);
    setIsEditing(false);
  };

  const handleSaveEdit = (saveData, isFormData = false) => {
    console.log("Saving profile data:", saveData);
    if (isFormData) {
      console.log("UPDATE IS FORM DATA");
      // Log FormData parts for debugging
      if (saveData && saveData._parts) {
        saveData._parts.forEach((part) => {
          if (part[0] === "profile_image") {
            console.log("profile_image object:", part[1]);
          } else {
            console.log(`FormData field: ${part[0]} =`, part[1]);
          }
        });
      }
      console.log("Before fetch");
      fetch(`${BASE_URL}/api/users/${auth?.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: saveData,
      })
        .then((res) => {
          console.log("Raw response status:", res.status);
          return res.text();
        })
        .then((text) => {
          console.log("Raw response text:", text);
          try {
            const json = JSON.parse(text);
            console.log("Profile updated successfully", json);
          } catch (e) {
            console.error("Failed to parse JSON:", e);
          }
          setIsEditing(false);
        })
        .catch((err) => {
          console.error("Error updating user (main fetch):", err);
          // Try a minimal FormData upload to test if any request is sent
          try {
            const minimalForm = new FormData();
            const imgPart = saveData._parts.find(
              (p) => p[0] === "profile_image"
            );
            if (imgPart) {
              console.log("Trying minimal upload with:", imgPart[1]);
              minimalForm.append("profile_image", imgPart[1]);
              fetch(`${BASE_URL}/api/users/${auth?.id}/test-upload`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${auth?.token}`,
                },
                body: minimalForm,
              })
                .then((res) => {
                  console.log("Minimal upload response status:", res.status);
                  return res.text();
                })
                .then((text) => {
                  console.log("Minimal upload response text:", text);
                })
                .catch((err2) => {
                  console.error("Minimal upload error:", err2);
                });
            }
          } catch (e) {
            console.error("Minimal upload try/catch error:", e);
          }
        });
      console.log("After fetch");
    } else {
      console.log("UPDATE IS ON MUTATION");
      patchUserMutation.mutate(
        {
          token: auth?.token,
          user_id: auth?.id,
          data: saveData,
        },
        {
          onSuccess: (res) => {
            console.log("Profile updated successfully", res);
            setIsEditing(false);
          },
        }
      );
    }
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

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Pressable
            disabled={!isEditing}
            onPress={handlePickImage}
            activeOpacity={isEditing ? 0.7 : 1}
          >
            <Image
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : { uri: auth?.profile?.profile_image }
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </Pressable>
          <View>
            {/* MOFIFY THIS SECTION TO BECOME TEXTINPUTS INSTEAD OF SIMPLE TEXT IF THE USER IS EDITING */}
            <View style={{ flex: 1, marginLeft: 16, justifyContent: "center" }}>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 2,
                      color: "#222",
                    },
                  ]}
                  value={editProfile.username}
                  onChangeText={(text) =>
                    setEditProfile((prev) => ({ ...prev, username: text }))
                  }
                  placeholder="Username"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.name}>
                  {editProfile.username || userData.username}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 16, justifyContent: "center" }}>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    { fontSize: 14, color: "#666", marginBottom: 2 },
                  ]}
                  value={editProfile.email}
                  onChangeText={(text) =>
                    setEditProfile((prev) => ({ ...prev, email: text }))
                  }
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoLabel}>
                  {editProfile.email || userData.email}
                </Text>
              )}
            </View>
          </View>
        </View>
        {/* Move buttons to the bottom of the card */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          {isEditing && (
            <Pressable
              style={[
                styles.editButton,
                { backgroundColor: "red", marginRight: 8 },
              ]}
              onPress={cancelEditing}
            >
              <Text style={styles.editButtonText}>Cancel</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.editButton}
            onPress={async () => {
              if (isEditing) {
                // Compose the correct data structure for saving
                const saveData = {
                  first_name: editProfile.first_name,
                  last_name: editProfile.last_name,
                  username: editProfile.username,
                  email: editProfile.email,
                  contact_number: editProfile.contact_number,
                  address: {
                    name: editAddress.name,
                    house_address: editAddress.house_address,
                    region: editAddress.region,
                    province: editAddress.province,
                    city: editAddress.city,
                    baranggay: editAddress.baranggay,
                    zip_code: editAddress.zip_code,
                  },
                };
                // If selectedImage is a local file URI, upload as file using FormData
                if (selectedImage && selectedImage.startsWith("file://")) {
                  const formData = new FormData();
                  Object.entries(saveData).forEach(([key, value]) => {
                    if (key === "address") {
                      Object.entries(value).forEach(([aKey, aValue]) => {
                        formData.append(`address[${aKey}]`, aValue);
                      });
                    } else {
                      formData.append(key, value);
                    }
                  });
                  // Append image as file
                  formData.append("profile_image", {
                    uri: selectedImage,
                    name: "profile.jpg",
                    type: "image/jpeg",
                  });
                  handleSaveEdit(formData, true); // true = isFormData
                } else if (selectedImage) {
                  saveData.profile_image = selectedImage;
                  handleSaveEdit(saveData, false);
                } else {
                  handleSaveEdit(saveData, false);
                }
              } else {
                startEditing();
              }
            }}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Personal Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {/* Email */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editProfile.email}
              onChangeText={(text) =>
                setEditProfile((prev) => ({ ...prev, email: text }))
              }
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.infoValue}>
              {editProfile.email || userData.email}
            </Text>
          )}
        </View>
        {/* First Name */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>First Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editProfile.first_name}
              onChangeText={(text) =>
                setEditProfile((prev) => ({ ...prev, first_name: text }))
              }
              placeholder="First Name"
            />
          ) : (
            <Text style={styles.infoValue}>
              {editProfile.first_name || profile.first_name || "-"}
            </Text>
          )}
        </View>
        {/* Last Name */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Last Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editProfile.last_name}
              onChangeText={(text) =>
                setEditProfile((prev) => ({ ...prev, last_name: text }))
              }
              placeholder="Last Name"
            />
          ) : (
            <Text style={styles.infoValue}>
              {editProfile.last_name || profile.last_name || "-"}
            </Text>
          )}
        </View>
        {/* Contact Number */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editProfile.contact_number}
              onChangeText={(text) =>
                setEditProfile((prev) => ({ ...prev, contact_number: text }))
              }
              placeholder="Contact Number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.infoValue}>
              {editProfile.contact_number || profile.contact_number || "-"}
            </Text>
          )}
        </View>
      </View>

      {/* Shipping Address Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {isEditing ? (
          <>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address Name</Text>
              <TextInput
                style={styles.input}
                value={editAddress.name}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, name: text }))
                }
                placeholder="Address Name"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>House Address</Text>
              <TextInput
                style={styles.input}
                value={editAddress.house_address}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, house_address: text }))
                }
                placeholder="House Address"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Region</Text>
              <TextInput
                style={styles.input}
                value={editAddress.region}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, region: text }))
                }
                placeholder="Region"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Province</Text>
              <TextInput
                style={styles.input}
                value={editAddress.province}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, province: text }))
                }
                placeholder="Province"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={editAddress.city}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, city: text }))
                }
                placeholder="City"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Barangay</Text>
              <TextInput
                style={styles.input}
                value={editAddress.baranggay}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, baranggay: text }))
                }
                placeholder="Barangay"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Zip Code</Text>
              <TextInput
                style={styles.input}
                value={editAddress.zip_code}
                onChangeText={(text) =>
                  setEditAddress((prev) => ({ ...prev, zip_code: text }))
                }
                placeholder="Zip Code"
                keyboardType="numeric"
              />
            </View>
          </>
        ) : addressDetails && addressDetails.length > 0 ? (
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#4285F4",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserAuth(Profile);
