import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Sustainable and eco-friendly cotton t-shirt',
      category: 'Clothing',
      color: 'White'
    },
    {
      name: 'Recycled Denim Jeans',
      description: 'High-waisted jeans made from recycled materials',
      category: 'Pants',
      color: 'Blue'
    },
    {
      name: 'Bamboo Fiber Dress',
      description: 'Elegant midi dress made from sustainable bamboo',
      category: 'Dresses',
      color: 'Green'
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Product Management</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, category, color..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredProducts.map((product, index) => (
        <View key={index} style={styles.productCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{product.category}</Text>
            <Text style={styles.metaText}>{product.color}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  productCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6da7',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
});

export default ProductManagement;