// src/screens/CartScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows, typography } from '../theme';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const updateQty = async (itemId, qty) => {
    if (qty < 1) { removeItem(itemId); return; }
    try {
      await api.post('/cart/update', { cart_item_id: itemId, quantity: qty });
      setCart(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === itemId ? { ...i, quantity: qty, subtotal: i.price * qty } : i),
      }));
    } catch (e) { console.log(e); }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCart(prev => ({ ...prev, items: prev.items.filter(i => i.id !== itemId) }));
    } catch (e) { console.log(e); }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImg}><Text style={styles.itemEmoji}>🛍️</Text></View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemSize}>Size: {item.size}</Text>
        <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.qtyControl}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity - 1)}><Text style={styles.qtyBtnText}>−</Text></TouchableOpacity>
        <Text style={styles.qtyVal}>{item.quantity}</Text>
        <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnPlus]} onPress={() => updateQty(item.id, item.quantity + 1)}><Text style={[styles.qtyBtnText, { color: 'white' }]}>+</Text></TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const subtotal = cart?.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={styles.headerBg}>
        <Text style={styles.headerTitle}>My Cart <Text style={styles.cartCount}>{cart?.items?.length || 0}</Text></Text>
      </View>
      {!cart?.items?.length ? (
        <View style={styles.empty}><Text style={styles.emptyIcon}>🛒</Text><Text style={styles.emptyTitle}>Cart is Empty</Text><TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Products')}><Text style={styles.shopBtnText}>Start Shopping</Text></TouchableOpacity></View>
      ) : (
        <>
          <FlatList data={cart.items} renderItem={renderItem} keyExtractor={i => i.id.toString()} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
          <View style={styles.summary}>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryVal}>₹{subtotal.toLocaleString()}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={[styles.summaryVal, { color: '#27AE60' }]}>{subtotal > 500 ? 'Free' : '₹99'}</Text></View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalVal}>₹{(subtotal + (subtotal > 500 ? 0 : 99)).toLocaleString()}</Text></View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout', { total: subtotal })}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerBg: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white' },
  cartCount: { fontSize: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 8 },
  list: { padding: spacing.md, paddingBottom: 220 },
  cartItem: { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', gap: spacing.sm, ...shadows.card },
  itemImg: { width: 64, height: 64, backgroundColor: colors.background, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 30 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 3 },
  itemSize: { fontSize: 11, color: colors.textLight, marginBottom: 4 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: colors.primary },
  qtyControl: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyBtnPlus: { backgroundColor: colors.primary, borderColor: colors.primary },
  qtyBtnText: { fontSize: 16, fontWeight: '600', color: colors.text },
  qtyVal: { fontSize: 15, fontWeight: '700', color: colors.text },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.textSecondary, marginBottom: 20 },
  shopBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14, ...shadows.button },
  shopBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: spacing.lg, borderTopLeftRadius: 24, borderTopRightRadius: 24, ...shadows.card },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryVal: { fontSize: 14, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalVal: { fontSize: 18, fontWeight: '800', color: colors.primary },
  checkoutBtn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  checkoutBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
});