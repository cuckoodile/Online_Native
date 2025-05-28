import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Dimensions } from "react-native";
import { Link, router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import UserAuth from "../components/higher-order-components/UserAuth";
import { useSelector } from "react-redux";
import { useGetTransaction } from "../functions/API/hooks/useTransaction";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const auth = useSelector((state) => state.auth.user) ?? null;
  const [shippingOrders, setShippingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateTransactionStatus } = useGetTransaction();

  const fetchShippingOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://apidevsixtech.styxhydra.com/transactions"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ordersWithStatus = (data.orders || data.data || data).map(order => ({
        ...order,
        status: order.status || "pending" 
      }));
      setShippingOrders(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(ordersWithStatus)) {
          return ordersWithStatus;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching shipping orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Profile id: ", auth);

    if (!auth) {
      router.replace("login");
    } else {
      fetchShippingOrders();
    }
  }, [auth, fetchShippingOrders]);

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      setLoading(true);
      setShippingOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      await updateTransactionStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      setShippingOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId 
            ? { ...order, status: order.status } 
            : order
        )
      );
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  }, [updateTransactionStatus]);

  const fetchTrackingInfo = useCallback(async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://apidevsixtech.styxhydra.com/transactions`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrackingInfo(data.tracking || data.data || data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching tracking info:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "#FFA500" },
    { value: "processing", label: "Processing", color: "#007BFF" },
    { value: "shipped", label: "Shipped", color: "#17A2B8" },
    { value: "delivered", label: "Delivered", color: "#28A745" },
    { value: "cancelled", label: "Cancelled", color: "#DC3545" },
  ];
  const stats = [
    {
      title: "Total Revenue",
      value: "P4,132,500",
      period: "Last 30 days",
      change: "↑ 11% vs. previous period",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: "1,645",
      period: "Last 30 days",
      change: "↑ 11% vs. previous period",
      isPositive: true,
    },
    {
      title: "Total Customers",
      value: "1,462",
      period: "Last 30 days",
      change: "↓ 17% vs. previous period",
      isPositive: false,
    },
    {
      title: "Pending Orders",
      value: "11",
      period: "Last 30 days",
      change: "↑ 0% vs. previous period",
      isPositive: true,
    },
  ];

  const cardData = [
    { title: "Income", value: "P1,163,100.00", change: "+20%" },
    { title: "Expenses", value: "P556,750.00", change: "+15%" },
    { title: "Balance", value: "P2,406,750.00", change: "+30%" },
  ];

  const currentOffers = [
    { title: "40% Discount", endsIn: "Ends in 2 days" },
    { title: "Summer Sale", endsIn: "Ends in 5 days" },
  ];

  const chartData = {
    labels: [
      "22 Jul",
      "23 Jul",
      "24 Jul",
      "25 Jul",
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
    ],
    datasets: [
      {
        data: [1500, 3000, 4500, 6000, 4500, 3000, 1500, 0],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const handleNavigation = (path) => {
    router.replace(`${path}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.header}>Overview</Text>
            <Text style={styles.subheader}>
              Welcome back, Admin! Here's what's happening today.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.productManagementButton}
            onPress={() => {
              handleNavigation("productmanagement");
            }}
          >
            <Text style={styles.productManagementButtonText}>
              Product Management
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{stat.title}</Text>
              <Text style={styles.cardPeriod}>{stat.period}</Text>
              <Text style={styles.cardValue}>{stat.value}</Text>
              <Text
                style={[
                  styles.cardChange,
                  stat.isPositive ? styles.positive : styles.negative,
                ]}
              >
                {stat.change}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Sales Analytics</Text>

        <View style={[styles.cardContainer, { marginBottom: 20 }]}>
          {cardData.map((card, index) => (
            <View key={index} style={[styles.salesCard, { width: "30%" }]}>
              <Text style={styles.salesCardTitle}>{card.title}</Text>
              <Text style={styles.salesCardValue}>{card.value}</Text>
              <Text style={styles.salesCardChange}>{card.change}</Text>
            </View>
          ))}
        </View>

        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={styles.chart}
        />
        <View style={styles.section}>
          <Text style={styles.header}>Sales Target</Text>
          <View style={styles.targetCard}>
            <View style={styles.targetRow}>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Daily Target</Text>
                <Text style={styles.targetValue}>32,500</Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Monthly Target</Text>
                <Text style={styles.targetValue}>P725,000.00</Text>
              </View>
            </View>

            <Text style={styles.offersHeader}>Current Offers</Text>
            {currentOffers.map((offer, index) => (
              <View key={index} style={styles.offerCard}>
                <View style={styles.offerTextContainer}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerEnds}>{offer.endsIn}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>

            <View style={styles.section}>
        <Text style={styles.header}>Shipping Orders</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : shippingOrders.length > 0 ? (
          shippingOrders.map((order) => (
            <View key={order.id} style={styles.shippingCard}>
              <View style={styles.shippingInfo}>
                <Text style={styles.shippingOrderId}>Order #{order.id}</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.shippingStatusLabel}>Status:</Text>
                  <View style={styles.statusDropdown}>
                    {statusOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.statusOption,
                          order.status === option.value && styles.statusSelected,
                          { backgroundColor: option.color }
                        ]}
                        onPress={() => handleStatusChange(order.id, option.value)}
                      >
                        <Text style={styles.statusOptionText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={styles.shippingDate}>
                  Shipped on: {new Date(order.shippedDate).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => {
                  setSelectedOrder(order);
                  fetchTrackingInfo(order.id);
                }}
              >
                <Text style={styles.trackButtonText}>Track</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No shipping orders found</Text>
        )}
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : trackingInfo ? (
              <>
                <Text style={styles.modalHeader}>
                  Tracking Order #{selectedOrder?.id}
                </Text>
              </>
              
            ) : (
              <Text>No tracking information available</Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardPeriod: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  cardChange: {
    fontSize: 12,
  },
  positive: {
    color: "#28a745",
  },
  negative: {
    color: "#dc3545",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  salesCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  salesCardTitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  salesCardValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  salesCardChange: {
    fontSize: 12,
    color: "#28a745",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  productManagementButton: {
    backgroundColor: "#084c3c",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    alignSelf: "flex-start",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productManagementButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  targetCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  targetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  targetItem: {
    width: "48%",
  },
  targetLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  targetValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  offersHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  offerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  offerEnds: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  viewButton: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  shippingCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shippingInfo: {
    flex: 1,
  },
  shippingOrderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  shippingStatusLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  shippingDate: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  trackButton: {
    backgroundColor: "#084c3c",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusDropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  statusOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    opacity: 0.7,
  },
  statusSelected: {
    opacity: 1,
    borderWidth: 1,
    borderColor: '#000',
  },
  statusOptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noOrdersText: {
    textAlign: "center",
    color: "#6c757d",
    marginVertical: 20,
  },
  errorText: {
    color: "#dc3545",
    textAlign: "center",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#084c3c",
  },
  trackingInfoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  trackingLabel: {
    fontWeight: "600",
    width: 120,
    color: "#495057",
  },
  trackingValue: {
    flex: 1,
  },
  deliveredStatus: {
    color: "#28a745",
    fontWeight: "600",
  },
  inTransitStatus: {
    color: "#007bff",
    fontWeight: "600",
  },
  pendingStatus: {
    color: "#6c757d",
    fontWeight: "600",
  },
  timelineHeader: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#495057",
  },
  eventItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  eventDate: {
    fontWeight: "600",
    color: "#495057",
  },
  eventDescription: {
    marginTop: 4,
  },
  eventLocation: {
    marginTop: 2,
    fontSize: 12,
    color: "#6c757d",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    borderRadius: 4,
    padding: 12,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default UserAuth(Dashboard);
