// src/screens/HelpSupportScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Linking, Alert, Animated, LayoutAnimation,
  Platform, UIManager
} from 'react-native';
import { removeToken } from '../utils/auth';
import { colors, spacing, shadows } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    id: 1,
    q: 'How do I track my order?',
    a: 'Go to Account → My Orders, tap on your order to see the live tracking timeline with delivery status updates.',
  },
  {
    id: 2,
    q: 'How do I cancel or return an order?',
    a: 'Orders can be cancelled within 24 hours of placing. For returns, go to My Orders → Select Order → Request Return. Returns are accepted within 7 days of delivery.',
  },
  {
    id: 3,
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery (COD) for eligible orders.',
  },
  {
    id: 4,
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3–7 business days. Express delivery (1–2 days) is available in select cities.',
  },
  {
    id: 5,
    q: 'How do I change my delivery address?',
    a: 'You can update your address before the order is shipped. Go to My Orders → Select Order → Edit Address.',
  },
  {
    id: 6,
    q: 'I was charged but order not placed. What do I do?',
    a: 'Do not worry — failed transaction amounts are automatically refunded within 5–7 business days. Contact support if you do not receive it.',
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  };

  return (
    <TouchableOpacity style={styles.faqCard} onPress={toggle} activeOpacity={0.85}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{item.q}</Text>
        <View style={[styles.faqChevron, open && styles.faqChevronOpen]}>
          <Text style={styles.faqChevronText}>›</Text>
        </View>
      </View>
      {open && (
        <View style={styles.faqBody}>
          <View style={styles.faqDivider} />
          <Text style={styles.faqA}>{item.a}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HelpSupportScreen({ navigation }) {

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const openEmail = () => Linking.openURL('mailto:support@myapp.com?subject=App Support');
  const openPhone = () => Linking.openURL('tel:+911800123456');
  const openChat  = () => navigation.navigate('Chats');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero banner ── */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>🎧</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>How can we help you?</Text>
            <Text style={styles.heroSub}>We usually reply within a few hours</Text>
          </View>
        </View>

        {/* ── Contact Options ── */}
        <Text style={styles.sectionLabel}>CONTACT US</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: '#EEF4FD' }]} onPress={openChat}>
            <Text style={styles.contactEmoji}>💬</Text>
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactSub}>Instant reply</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactCard, { backgroundColor: '#EAFAF1' }]} onPress={openPhone}>
            <Text style={styles.contactEmoji}>📞</Text>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSub}>1800-123-456</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactCard, { backgroundColor: '#FEF9E7' }]} onPress={openEmail}>
            <Text style={styles.contactEmoji}>✉️</Text>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactSub}>support@myapp</Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Links ── */}
        <Text style={styles.sectionLabel}>QUICK LINKS</Text>
        <View style={styles.quickLinksCard}>
          {[
            { icon: '📦', label: 'Track My Order',       onPress: () => navigation.navigate('Orders') },
            { icon: '↩️', label: 'Returns & Refunds',    onPress: () => Alert.alert('Returns', 'Go to My Orders → Select Order → Request Return.') },
            { icon: '💳', label: 'Payment Issues',       onPress: () => Alert.alert('Payment', 'Failed payments are refunded in 5–7 business days.') },
            { icon: '🔔', label: 'Notification Settings', onPress: () => navigation.navigate('Notifications') },
            { icon: '👤', label: 'Edit My Profile',      onPress: () => navigation.navigate('EditProfile') },
            { icon: '🔒', label: 'Change Password',      onPress: () => navigation.navigate('ChangePassword') },
          ].map((item, idx, arr) => (
            <TouchableOpacity
              key={idx}
              style={[styles.quickItem, idx < arr.length - 1 && styles.quickItemBorder]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.quickIcon}>{item.icon}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── FAQ ── */}
        <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
        {FAQ_DATA.map(item => <FaqItem key={item.id} item={item} />)}

        {/* ── App Info ── */}
        <View style={styles.appInfoCard}>
          <Text style={styles.appInfoTitle}>MyApp</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <View style={styles.appInfoLinks}>
            <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', 'Visit myapp.com/privacy')}>
              <Text style={styles.appInfoLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.appInfoDot}>·</Text>
            <TouchableOpacity onPress={() => Alert.alert('Terms of Service', 'Visit myapp.com/terms')}>
              <Text style={styles.appInfoLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  scroll:     { paddingBottom: 40 },

  // Header
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: 'white', flex: 1, textAlign: 'center' },
  backBtn:     { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 20, color: 'white', fontWeight: '600' },
  logoutBtn:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  logoutIcon:  { fontSize: 14 },
  logoutText:  { fontSize: 13, fontWeight: '600', color: 'white' },

  // Hero
  heroBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
    paddingBottom: spacing.lg + 4,
  },
  heroEmoji: { fontSize: 40 },
  heroTitle:  { fontSize: 16, fontWeight: '700', color: 'white' },
  heroSub:    { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Section label
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textLight,
    letterSpacing: 1.2, paddingHorizontal: spacing.lg,
    marginTop: spacing.lg, marginBottom: spacing.sm,
  },

  // Contact cards
  contactRow:  { flexDirection: 'row', gap: 10, paddingHorizontal: spacing.lg },
  contactCard: {
    flex: 1, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', ...shadows.card,
  },
  contactEmoji: { fontSize: 26, marginBottom: 6 },
  contactTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  contactSub:   { fontSize: 10, color: colors.textLight, marginTop: 2 },

  // Quick links
  quickLinksCard: {
    backgroundColor: 'white', borderRadius: 16,
    marginHorizontal: spacing.lg, ...shadows.card, overflow: 'hidden',
  },
  quickItem:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 14, gap: 12 },
  quickItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  quickIcon:       { fontSize: 20, width: 28, textAlign: 'center' },
  quickLabel:      { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
  quickArrow:      { fontSize: 20, color: colors.textLight, fontWeight: '300' },

  // FAQ
  faqCard: {
    backgroundColor: 'white', borderRadius: 14,
    marginHorizontal: spacing.lg, marginBottom: 8,
    padding: spacing.md, ...shadows.card,
  },
  faqHeader:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  faqQ:            { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text, lineHeight: 20 },
  faqChevron:      { width: 26, height: 26, borderRadius: 8, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '0deg' }] },
  faqChevronOpen:  { backgroundColor: colors.primary },
  faqChevronText:  { fontSize: 18, color: colors.textLight, lineHeight: 22 },
  faqDivider:      { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  faqBody:         {},
  faqA:            { fontSize: 13, color: colors.textSecondary, lineHeight: 21 },

  // App info
  appInfoCard: {
    alignItems: 'center', paddingVertical: 28,
    marginHorizontal: spacing.lg, marginTop: spacing.md,
  },
  appInfoTitle:   { fontSize: 16, fontWeight: '800', color: colors.primary },
  appInfoVersion: { fontSize: 12, color: colors.textLight, marginTop: 4, marginBottom: 12 },
  appInfoLinks:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appInfoLink:    { fontSize: 12, color: colors.accent },
  appInfoDot:     { fontSize: 12, color: colors.textLight },
});