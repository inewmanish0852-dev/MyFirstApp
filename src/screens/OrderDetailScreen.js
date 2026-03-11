// src/screens/OrderDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows } from '../theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OrderDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      api.get(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setOrder(r.data.data)).catch(console.log).finally(() => setLoading(false));
    };
    loadOrder();
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!order) return <View style={s.center}><Text>Order not found</Text></View>;

  const STATUS = { delivered: '#27AE60', shipped: '#E67E22', processing: '#2980B9', cancelled: '#E74C3C' };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Order Detail</Text>
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.card}>
          <View style={s.row}><Text style={s.label}>Order Number</Text><Text style={s.val}>{order.order_number}</Text></View>
          <View style={s.row}><Text style={s.label}>Status</Text><Text style={[s.val, { color: STATUS[order.status] || colors.primary, fontWeight: '700' }]}>{order.status_label}</Text></View>
          <View style={s.row}><Text style={s.label}>Placed On</Text><Text style={s.val}>{order.placed_at}</Text></View>
          <View style={s.row}><Text style={s.label}>Delivery Address</Text><Text style={[s.val, { flex: 1, textAlign: 'right' }]}>{order.address}</Text></View>
        </View>

        <Text style={s.sectionTitle}>Items</Text>
        <View style={s.card}>
          {order.items.map((item, i) => (
            <View key={i} style={[s.itemRow, i < order.items.length - 1 && s.itemBorder]}>
              <View style={s.itemImg}><Text style={{ fontSize: 22 }}>🛍️</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemQty}>Qty: {item.qty}</Text>
              </View>
              <Text style={s.itemPrice}>₹{item.price.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>Tracking</Text>
        <View style={s.card}>
          {order.timeline.map((step, i) => (
            <View key={i} style={s.timelineRow}>
              <View style={[s.dot, { backgroundColor: step.done ? '#27AE60' : colors.border }]} />
              {i < order.timeline.length - 1 && <View style={[s.line, { backgroundColor: step.done ? '#27AE60' : colors.border }]} />}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[s.stepLabel, { color: step.done ? colors.text : colors.textLight }]}>{step.label}</Text>
                <Text style={s.stepDate}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.invoiceBtn} onPress={() => navigation.navigate('Invoice', { id })}>
          <Text style={s.invoiceBtnText}>📄 View Invoice</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  back: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: 'white' },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, ...shadows.card },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 13, color: colors.textSecondary },
  val: { fontSize: 13, fontWeight: '600', color: colors.text },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingLeft: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemImg: { width: 44, height: 44, backgroundColor: colors.background, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 13, fontWeight: '600', color: colors.text },
  itemQty: { fontSize: 11, color: colors.textLight },
  itemPrice: { fontSize: 14, fontWeight: '700', color: colors.primary },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 16, position: 'relative' },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 3, flexShrink: 0 },
  line: { position: 'absolute', left: 5, top: 16, width: 2, height: 20 },
  stepLabel: { fontSize: 13, fontWeight: '600' },
  stepDate: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  invoiceBtn: { backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  invoiceBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
});