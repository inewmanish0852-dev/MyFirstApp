// src/screens/OrderListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows, typography } from '../theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATUS_COLORS = {
  delivered:  { bg: '#EAFAF1', text: '#27AE60' },
  shipped:    { bg: '#FEF9E7', text: '#E67E22' },
  processing: { bg: '#EEF4FD', text: '#2980B9' },
  cancelled:  { bg: '#FDEDEC', text: '#E74C3C' },
};

export default function OrderListScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {    
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      api.get('/orders', { headers: { Authorization: `Bearer ${token}` } }).then(res => setOrders(res.data.data)).catch(console.log).finally(() => setLoading(false));
    };
    loadOrders();
  }, []);

  const renderOrder = ({ item }) => {
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.processing;
    return (
      <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('OrderDetail', { id: item.id })} activeOpacity={0.9}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNum}>{item.order_number}</Text>
            <Text style={styles.orderDate}>{item.placed_at}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.statusText, { color: sc.text }]}>{item.status_label}</Text>
          </View>
        </View>
        <View style={styles.orderDivider} />
        <View style={styles.orderFooter}>
          <Text style={styles.orderItems}>{item.items_count} item{item.items_count > 1 ? 's' : ''}</Text>
          <Text style={styles.orderTotal}>₹{item.total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.invoiceBtn} onPress={() => navigation.navigate('Invoice', { id: item.id })}>
          <Text style={styles.invoiceBtnText}>📄 View Invoice</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={styles.headerBg}><Text style={styles.headerTitle}>My Orders</Text></View>
      {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /> : (
        <FlatList data={orders} renderItem={renderOrder} keyExtractor={i => i.id.toString()} contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>📦</Text><Text style={styles.emptyText}>No orders yet</Text></View>}
        />
      )}
    </View>
  );
}

const orderListStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white' },
  list: { padding: spacing.md, paddingBottom: 40 },
  orderCard: { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  orderNum: { fontSize: 14, fontWeight: '700', color: colors.text },
  orderDate: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderDivider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.sm },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  orderItems: { fontSize: 13, color: colors.textSecondary },
  orderTotal: { fontSize: 16, fontWeight: '800', color: colors.primary },
  invoiceBtn: { backgroundColor: colors.background, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  invoiceBtnText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...typography.bodySecondary },
});

// Merge styles
const styles = { ...orderListStyles };