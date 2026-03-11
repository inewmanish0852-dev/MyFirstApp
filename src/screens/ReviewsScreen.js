// src/screens/ReviewsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows } from '../theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReviewsScreen({ route, navigation }) {
  const { productId, productTitle } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      api.get(`/products/${productId}/reviews`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setData(r.data.data)).catch(console.log).finally(() => setLoading(false));
    };
    loadReviews();
  }, []);

  const Stars = ({ n }) => (
    <Text style={s.stars}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</Text>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Reviews</Text>
      </View>
      {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /> : (
        <FlatList
          data={data?.reviews || []}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={s.list}
          ListHeaderComponent={
            <View style={s.summaryCard}>
              <Text style={s.productTitle} numberOfLines={1}>{productTitle}</Text>
              <View style={s.summaryRow}>
                <Text style={s.avgRating}>{data?.avg_rating}</Text>
                <View>
                  <Stars n={Math.round(data?.avg_rating || 0)} />
                  <Text style={s.totalReviews}>Based on {data?.total} reviews</Text>
                </View>
              </View>
              <TouchableOpacity style={s.writeBtn} onPress={() => navigation.navigate('WriteReview', { productId, productTitle })}>
                <Text style={s.writeBtnText}>✏️ Write a Review</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <View style={[s.avatar, { backgroundColor: item.color }]}><Text style={s.avatarText}>{item.avatar}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.userName}>{item.user}</Text>
                  <Stars n={item.rating} />
                </View>
                <Text style={s.date}>{item.date}</Text>
              </View>
              <Text style={s.comment}>{item.comment}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  back: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: 'white' },
  list: { padding: spacing.md, paddingBottom: 40 },
  summaryCard: { backgroundColor: 'white', borderRadius: 20, padding: spacing.lg, marginBottom: spacing.md, ...shadows.card },
  productTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: spacing.md },
  avgRating: { fontSize: 48, fontWeight: '800', color: colors.primary },
  stars: { fontSize: 18, color: '#F39C12' },
  totalReviews: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  writeBtn: { backgroundColor: colors.background, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary },
  writeBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  reviewCard: { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: 'white' },
  userName: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  date: { fontSize: 11, color: colors.textLight },
  comment: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});