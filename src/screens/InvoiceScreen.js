// src/screens/InvoiceScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows } from '../theme';

export default function InvoiceScreen({ route, navigation }) {
  const { id } = route.params;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}/invoice`).then(r => setInvoice(r.data.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Invoice</Text>
        <View style={s.paidBadge}><Text style={s.paidText}>✓ Paid</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.invoiceCard}>
          <View style={s.invoiceHeader}>
            <View style={s.logo}><Text style={s.logoText}>M</Text></View>
            <View>
              <Text style={s.invoiceNum}>{invoice.invoice_number}</Text>
              <Text style={s.invoiceDate}>Date: {invoice.date}</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.row}><Text style={s.label}>Order</Text><Text style={s.val}>{invoice.order_number}</Text></View>
          <View style={s.row}><Text style={s.label}>Address</Text><Text style={[s.val, { flex: 1, textAlign: 'right' }]}>{invoice.address}</Text></View>
          <View style={s.divider} />
          <View style={s.tableHeader}>
            <Text style={[s.col, { flex: 2 }]}>Item</Text>
            <Text style={s.col}>Qty</Text>
            <Text style={[s.col, { textAlign: 'right' }]}>Price</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.colVal, { flex: 2 }]} numberOfLines={2}>{item.title}</Text>
              <Text style={s.colVal}>{item.qty}</Text>
              <Text style={[s.colVal, { textAlign: 'right', fontWeight: '600' }]}>₹{item.price.toLocaleString()}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.row}><Text style={s.label}>Subtotal</Text><Text style={s.val}>₹{invoice.subtotal.toLocaleString()}</Text></View>
          <View style={s.row}><Text style={s.label}>Delivery</Text><Text style={[s.val, { color: '#27AE60' }]}>{invoice.delivery === 0 ? 'Free' : `₹${invoice.delivery}`}</Text></View>
          <View style={s.divider} />
          <View style={s.row}><Text style={s.totalLabel}>Total Amount</Text><Text style={s.totalVal}>₹{invoice.total.toLocaleString()}</Text></View>
        </View>
        <TouchableOpacity style={s.downloadBtn} onPress={() => Alert.alert('📄', 'PDF download feature coming soon!')}>
          <Text style={s.downloadBtnText}>📥 Download PDF</Text>
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
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: 'white' },
  paidBadge: { backgroundColor: '#EAFAF1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  paidText: { fontSize: 12, fontWeight: '700', color: '#27AE60' },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  invoiceCard: { backgroundColor: 'white', borderRadius: 20, padding: spacing.lg, ...shadows.card },
  invoiceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.md },
  logo: { width: 42, height: 42, backgroundColor: colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 20, fontWeight: '800', color: 'white' },
  invoiceNum: { fontSize: 16, fontWeight: '700', color: colors.text },
  invoiceDate: { fontSize: 12, color: colors.textLight },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  label: { fontSize: 13, color: colors.textSecondary },
  val: { fontSize: 13, fontWeight: '600', color: colors.text },
  tableHeader: { flexDirection: 'row', marginBottom: 8 },
  col: { flex: 1, fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  colVal: { flex: 1, fontSize: 13, color: colors.text },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalVal: { fontSize: 18, fontWeight: '800', color: colors.primary },
  downloadBtn: { marginTop: spacing.md, backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  downloadBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
});