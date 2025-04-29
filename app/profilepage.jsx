import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProfilePage = () => {
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>Zanjoe Gonzales</Text>
            <Text style={styles.memberStatus}>Active Member</Text>
            <Text style={styles.email}>zanjoegonzales519@gmail.com</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="#4285F4" />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>zanjoegonzales519@gmail.com</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mobile</Text>
            <Text style={styles.infoValue}>09*******</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Birthday</Text>
            <Text style={styles.infoValue}>May 19 2006</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>Male</Text>
          </View>
        </View>
      </View>

      {/* Shipping Address Card */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>FullName</Text>
            <Text style={styles.infoValue}>Zanjoe Gonzales</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>Pateros</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Postcode</Text>
            <Text style={styles.infoValue}>Metro Manila–Pasig,Pasig</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>City–Maybunga</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>PhoneNumber</Text>
            <Text style={styles.infoValue}>09** *** ***</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityItem}>
            <View style={styles.activityStatus}>
              <MaterialIcons name="radio-button-unchecked" size={20} color="#666" />
              <Text style={styles.activityText}>Left a Review</Text>
            </View>
            <Text style={styles.activityDetail}>Natural Face Serum - 5 stars</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.activityItem}>
            <View style={styles.activityStatus}>
              <MaterialIcons name="check-circle" size={20} color="#4285F4" />
              <Text style={styles.activityText}>Made a Purchase</Text>
            </View>
            <Text style={styles.activityDetail}>2 items - P1,748.00</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
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

      <View style={styles.card}>
        <View style={styles.section}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productItem}>
            <Text style={styles.productName}>Bamboo Toothbrush Set</Text>
            <Text style={styles.productPrice}>P399</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <MaterialIcons name="star" size={16} color="#FFD700" />
            </View>
          </View>
          
          <View style={styles.productItem}>
            <Text style={styles.productName}>Natural Clay Face Mask</Text>
            <Text style={styles.productPrice}>P799</Text>
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
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberStatus: {
    fontSize: 14,
    color: '#4285F4',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    color: '#4285F4',
    marginLeft: 4,
    fontSize: 14,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  activityItem: {
    marginBottom: 15,
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  activityDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  productItem: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#4285F4',
    fontSize: 14,
  },
});

export default ProfilePage;