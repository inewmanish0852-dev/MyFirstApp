// src/screens/WriteReviewScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows, typography } from '../theme';

export default function WriteReviewScreen({ route, navigation }) {
  const { productId, productTitle } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating) { Alert.alert('Error', 'Please select a rating.'); return; }
    if (comment.length < 10) { Alert.alert('Error', 'Review must be at least 10 characters.'); return; }
    try {
      setLoading(true);
      await api.post('/reviews', { product_id: productId, rating, comment });
      Alert.alert('Thank you! ⭐', 'Your review has been submitted.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) { Alert.alert('Error', 'Could not submit review.'); } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>← Back</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Write Review</Text>
      </View>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.productCard}>
          <Text style={s.productEmoji}>🛍️</Text>
          <View><Text style={s.productTitle}>{productTitle}</Text><Text style={s.productSub}>Share your experience</Text></View>
        </View>
        <View style={s.card}>
          <Text style={s.label}>Your Rating *</Text>
          <View style={s.starsRow}>
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Text style={[s.star, { color: n <= rating ? '#F39C12' : colors.border }]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && <Text style={s.ratingLabel}>{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}</Text>}
          <Text style={[s.label, { marginTop: spacing.md }]}>Your Review *</Text>
          <TextInput
            style={s.textArea}
            placeholder="Write your experience with this product..."
            placeholderTextColor={colors.textLight}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={s.charCount}>{comment.length} / 500</Text>
          <TouchableOpacity style={[s.submitBtn, loading && s.btnDisabled]} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={s.submitBtnText}>Submit Review ✓</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  back: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: 'white' },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  productCard: { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.md, ...shadows.card },
  productEmoji: { fontSize: 40 },
  productTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  productSub: { fontSize: 12, color: colors.textLight },
  card: { backgroundColor: 'white', borderRadius: 20, padding: spacing.lg, ...shadows.card },
  label: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  star: { fontSize: 40 },
  ratingLabel: { fontSize: 14, fontWeight: '700', color: '#F39C12', marginBottom: spacing.sm },
  textArea: { backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: spacing.md, fontSize: 14, color: colors.text, minHeight: 120 },
  charCount: { fontSize: 12, color: colors.textLight, textAlign: 'right', marginTop: 4, marginBottom: spacing.md },
  submitBtn: { backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  btnDisabled: { opacity: 0.7 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
});