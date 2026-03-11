// src/screens/ProductDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows, typography } from '../theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [addingCart, setAddingCart] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => { loadProduct(); }, []);

  const loadProduct = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const res = await api.get(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProduct(res.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const addToCart = async () => {
    try {
      setAddingCart(true);
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      await api.post('/cart/add', { product_id: id, quantity: qty }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Added! 🛒', 'Item added to your cart.', [
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
        { text: 'Continue', style: 'cancel' },
      ]);
    } catch (e) { Alert.alert('Error', 'Could not add to cart.'); }
    finally { setAddingCart(false); }
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!product) return <View style={styles.loading}><Text>Product not found</Text></View>;

  const emoji = product.category === 'Electronics' ? '📱' : product.category === 'Clothing' ? '👕' : product.category === 'Bags' ? '🎒' : '🛍️';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Area */}
        <View style={styles.imageArea}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
          <Text style={styles.productEmoji}>{emoji}</Text>
          {product.discount > 0 && <View style={styles.discountBadge}><Text style={styles.discountText}>-{product.discount}% OFF</Text></View>}
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</Text>
            <Text style={styles.ratingVal}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviews_count} reviews)</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reviews', { productId: id, productTitle: product.title })}>
              <Text style={styles.seeReviews}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
            {product.original_price > product.price && (
              <Text style={styles.originalPrice}>₹{product.original_price.toLocaleString()}</Text>
            )}
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>✓ In Stock ({product.stock})</Text>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Size Selector */}
          <Text style={styles.sectionLabel}>Select Size</Text>
          <View style={styles.sizesRow}>
            {sizes.map(s => (
              <TouchableOpacity key={s} style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]} onPress={() => setSelectedSize(s)}>
                <Text style={[styles.sizeBtnText, selectedSize === s && styles.sizeBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}><Text style={styles.qtyBtnText}>−</Text></TouchableOpacity>
            <Text style={styles.qtyVal}>{qty}</Text>
            <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnPlus]} onPress={() => setQty(qty + 1)}><Text style={[styles.qtyBtnText, { color: 'white' }]}>+</Text></TouchableOpacity>
            <Text style={styles.totalHint}>Total: ₹{(product.price * qty).toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={addToCart} disabled={addingCart}>
          {addingCart ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.cartBtnText}>🛒 Add to Cart</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageArea: { height: 260, backgroundColor: '#EEF4FD', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 38, height: 38, backgroundColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center', ...shadows.card },
  backBtnText: { fontSize: 20, color: colors.text },
  productEmoji: { fontSize: 100 },
  discountBadge: { position: 'absolute', top: 50, right: 20, backgroundColor: '#E74C3C', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  discountText: { fontSize: 12, fontWeight: '700', color: 'white' },
  content: { padding: spacing.lg, paddingBottom: 100 },
  category: { fontSize: 12, fontWeight: '700', color: colors.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, lineHeight: 30, marginBottom: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: 6 },
  stars: { color: '#F39C12', fontSize: 14 },
  ratingVal: { fontSize: 14, fontWeight: '700', color: colors.text },
  reviewCount: { fontSize: 13, color: colors.textLight },
  seeReviews: { fontSize: 13, color: colors.accent, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.md },
  price: { fontSize: 24, fontWeight: '800', color: colors.primary },
  originalPrice: { fontSize: 16, color: colors.textLight, textDecorationLine: 'line-through' },
  stockBadge: { backgroundColor: '#EAFAF1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  stockText: { fontSize: 11, color: '#27AE60', fontWeight: '600' },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.lg },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  sizesRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  sizeBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  sizeBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  sizeBtnText: { fontSize: 13, fontWeight: '600', color: colors.text },
  sizeBtnTextActive: { color: 'white' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyBtnPlus: { backgroundColor: colors.primary, borderColor: colors.primary },
  qtyBtnText: { fontSize: 18, fontWeight: '600', color: colors.text },
  qtyVal: { fontSize: 18, fontWeight: '700', color: colors.text, minWidth: 30, textAlign: 'center' },
  totalHint: { fontSize: 14, color: colors.textSecondary, marginLeft: 8 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: spacing.md, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border, ...shadows.card },
  cartBtn: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  cartBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  buyBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  buyBtnText: { fontSize: 14, fontWeight: '700', color: 'white' },
});