import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../components/Card';

const CollectionScreen = () => {
  // Sample data - replace with your actual data
  const products = [
    {
      id: '1',
      category: 'Pet Products',
      title: 'Pet Dental Care Kit',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '2',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '3',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '4',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '5',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '6',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '7',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '8',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },
    {
      id: '9',
      category: 'Cosmetics',
      title: 'Organic Shampoo Bar',
      price: '349',
      image: '../assets/images/devsix.jpg' 
    },

  ];

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>COLLECTION</Text>
        <Text style={styles.subheader}>
          Explore our curated selection of premium sustainable fashion pieces designed for the eco-conscious individual.
        </Text>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterItem}>
          <MaterialIcons name="check-box-outline-blank" size={20} color="#333" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterText}>Showing {products.length} products</Text>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Card item={item} style={styles.card} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,

  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  filterText: {
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%', 
  },
});

export default CollectionScreen;