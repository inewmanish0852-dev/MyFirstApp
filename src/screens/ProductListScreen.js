// src/screens/ProductListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows, typography } from '../theme';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadByCategory(); }, [activeCategory]);

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(pRes.data.data);
      setCategories(cRes.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const loadByCategory = async () => {
    try {
      const res = await api.get(`/products/category/${activeCategory}`);
      setProducts(res.data.data);
    } catch (e) { console.log(e); }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { id: item.id })} activeOpacity={0.9}>
      <View style={styles.productImg}>
        <Text style={styles.productEmoji}>{item.category === 'Electronics' ? '📱' : item.category === 'Clothing' ? '👕' : item.category === 'Bags' ? '🎒' : '🛍️'}</Text>
        {item.discount > 0 && <View style={styles.discountBadge}><Text style={styles.discountText}>-{item.discount}%</Text></View>}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviews_count})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
          {item.original_price > item.price && <Text style={styles.originalPrice}>₹{item.original_price.toLocaleString()}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={styles.headerBg}>
        <Text style={styles.headerTitle}>Products</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder="Search products..." placeholderTextColor="rgba(255,255,255,0.5)" value={search} onChangeText={setSearch} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catChip, activeCategory === cat.slug && styles.catChipActive]} onPress={() => setActiveCategory(cat.slug)}>
              <Text style={[styles.catChipText, activeCategory === cat.slug && styles.catChipTextActive]}>{cat.icon} {cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /> : (
        <FlatList
          data={filtered}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>📭</Text><Text style={styles.emptyText}>No products found</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingBottom: spacing.md },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: spacing.lg, borderRadius: 12, paddingHorizontal: spacing.md, height: 42, marginBottom: spacing.sm },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: 'white' },
  categoryScroll: { paddingLeft: spacing.lg },
  catChip: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
  catChipActive: { backgroundColor: 'white' },
  catChipText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  catChipTextActive: { color: colors.primary },
  list: { padding: spacing.sm, paddingBottom: 80 },
  productCard: { flex: 1, backgroundColor: 'white', borderRadius: 16, margin: 6, overflow: 'hidden', ...shadows.card },
  productImg: { height: 120, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productEmoji: { fontSize: 48 },
  discountBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#E74C3C', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  discountText: { fontSize: 10, fontWeight: '700', color: 'white' },
  productInfo: { padding: 10 },
  productTitle: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 4, lineHeight: 17 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  star: { color: '#F39C12', fontSize: 11 },
  ratingText: { fontSize: 11, fontWeight: '600', color: colors.text, marginLeft: 2 },
  reviewCount: { fontSize: 10, color: colors.textLight, marginLeft: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 14, fontWeight: '700', color: colors.primary },
  originalPrice: { fontSize: 11, color: colors.textLight, textDecorationLine: 'line-through' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...typography.bodySecondary },
});