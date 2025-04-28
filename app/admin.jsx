import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: 'P4,132,500', period: 'Last 30 days', change: '↑ 11% vs. previous period', isPositive: true },
    { title: 'Total Orders', value: '1,645', period: 'Last 30 days', change: '↑ 11% vs. previous period', isPositive: true },
    { title: 'Total Customers', value: '1,462', period: 'Last 30 days', change: '↓ 17% vs. previous period', isPositive: false },
    { title: 'Pending Orders', value: '11', period: 'Last 30 days', change: '↑ 0% vs. previous period', isPositive: true },
  ];

  const cardData = [
    { title: 'Income', value: 'P1,163,100.00', change: '+20%' },
    { title: 'Expenses', value: 'P556,750.00', change: '+15%' },
    { title: 'Balance', value: 'P2,406,750.00', change: '+30%' },
  ];

  const currentOffers = [
    { title: '40% Discount', endsIn: 'Ends in 2 days' },
    { title: 'Summer Sale', endsIn: 'Ends in 5 days' }
  ];

  const chartData = {
    labels: ['22 Jul', '23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul', '29 Jul'],
    datasets: [
      {
        data: [1500, 3000, 4500, 6000, 4500, 3000, 1500, 0],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Overview</Text>
        <Text style={styles.subheader}>Welcome back, Admin! Here's what's happening today.</Text>
        
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{stat.title}</Text>
              <Text style={styles.cardPeriod}>{stat.period}</Text>
              <Text style={styles.cardValue}>{stat.value}</Text>
              <Text style={[styles.cardChange, stat.isPositive ? styles.positive : styles.negative]}>
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
            <View key={index} style={[styles.salesCard, { width: '30%' }]}>
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
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardPeriod: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  cardChange: {
    fontSize: 12,
  },
  positive: {
    color: '#28a745',
  },
  negative: {
    color: '#dc3545',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salesCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  salesCardTitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  salesCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  salesCardChange: {
    fontSize: 12,
    color: '#28a745',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  targetCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  targetItem: {
    width: '48%',
  },
  targetLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  targetValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  offersHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  offerEnds: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  viewButton: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Dashboard; 