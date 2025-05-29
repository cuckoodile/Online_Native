import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import UserAuth from "../../components/higher-order-components/UserAuth";
import { useSelector } from "react-redux";
import useUser from "../../functions/API/hooks/useUser";

function Profile() {
  const auth = useSelector((state) => state.auth.user);
  // const useUserQuery = new useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userIsError,
  } = useUser(auth?.id, auth?.token);

  const genderOptions = ["Male", "Female", "Others"];

  const handleEditPress = () => {
    setIsEditing(!isEditing);
    setShowGenderDropdown(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setUserData({
        ...userData,
        birthday: selectedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        birthdayDate: selectedDate,
      });
    }
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const handleGenderSelect = (gender) => {
    setUserData({ ...userData, gender });
    setShowGenderDropdown(false);
  };

  if (userLoading) {
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

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            {isEditing ? (
              <TextInput
                style={[styles.name, styles.input]}
                value={userData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            ) : (
              <Text style={styles.name}>{userData?.username}</Text>
            )}

            <Text style={styles.memberStatus}>Active Member</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <MaterialIcons
              name={isEditing ? "save" : "edit"}
              size={20}
              color="#4285F4"
            />
            <Text style={styles.editText}>
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoValue, styles.input]}
                value={userData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.infoValue}>{userData?.email}</Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mobile</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoValue, styles.input]}
                value={userData.mobile}
                onChangeText={(text) => handleInputChange("mobile", text)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>
                {userData?.profile?.contact_number || "No Mobile in DB!!"}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>FullName</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoValue, styles.input]}
                value={userData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            ) : (
              <Text style={styles.infoValue}>
                {userData?.profile?.first_name} {userData?.profile?.last_name}
              </Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoValue, styles.input]}
                value={userData.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />
            ) : (
              <Text style={styles.infoValue}>
                No address in stored auth profile
              </Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Postcode</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoValue, styles.input]}
                value={userData.postcode}
                onChangeText={(text) => handleInputChange("postcode", text)}
              />
            ) : (
              <Text style={styles.infoValue}>{userData.postcode}</Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>City–Maybunga</Text>
            {isEditing ? (
              <TextInput
                style={[styles.infoValue, styles.input]}
                value={userData.city}
                onChangeText={(text) => handleInputChange("city", text)}
              />
            ) : (
              <Text style={styles.infoValue}>{userData.city}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Purchases</Text>

          <View style={styles.productItem}>
            <Text style={styles.productName}>Natural Face Serum</Text>
            <Text style={styles.productPrice}>P1,299</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
            </View>
          </View>

          <View style={styles.productItem}>
            <Text style={styles.productName}>Eco Laundry Detergent</Text>
            <Text style={styles.productPrice}>P449</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
            </View>
          </View>
        </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  memberStatus: {
    fontSize: 14,
    color: "#4285F4",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    color: "#4285F4",
    marginLeft: 4,
    fontSize: 14,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  activityItem: {
    marginBottom: 15,
  },
  activityStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  activityText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  activityDetail: {
    fontSize: 14,
    color: "#666",
    marginLeft: 28,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
    marginLeft: 28,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  productItem: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: "#4285F4",
    fontSize: 14,
  },
  dateInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    marginTop: 10,
  },
  iosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    padding: 8,
  },
  doneButton: {
    padding: 8,
  },
  cancelText: {
    color: "#888",
    fontSize: 16,
  },
  doneText: {
    color: "#4285F4",
    fontWeight: "600",
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: Platform.OS === "ios" ? "black" : "transparent",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
    overflow: "visible",
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserAuth(Profile);
