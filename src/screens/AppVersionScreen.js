// src/screens/AppVersionScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Linking, Animated
} from 'react-native';
import { colors, spacing, shadows } from '../theme';

const VERSION      = '1.0.0';
const BUILD        = '100';
const RELEASE_DATE = 'March 11, 2025';

const CHANGELOG = [
  {
    version: '1.0.0',
    date: 'March 11, 2025',
    tag: 'Latest',
    tagColor: '#27AE60',
    changes: [
      'Initial release of MyApp',
      'Product listing with category filter & search',
      'Shopping cart with quantity control',
      'Order placement, tracking & invoice',
      'Live chat with support team',
      'Product reviews & ratings',
      'Gallery and notifications',
      'Edit profile & change password',
    ],
  },
];

const INFO_ROWS = [
  { label: 'App Name',      value: 'MyApp' },
  { label: 'Version',       value: `v${VERSION}` },
  { label: 'Build Number',  value: BUILD },
  { label: 'Release Date',  value: RELEASE_DATE },
  { label: 'Platform',      value: 'Android' },
  { label: 'Developer',     value: 'MyApp Team' },
];

export default function AppVersionScreen({ navigation }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in on mount
    Animated.timing(fadeIn, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();

    // Pulse animation on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.00, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>App Version</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Logo Hero ── */}
        <Animated.View style={[s.hero, { opacity: fadeIn }]}>
          <Animated.View style={[s.logoBox, { transform: [{ scale: pulse }] }]}>
            <Text style={s.logoText}>M</Text>
          </Animated.View>
          <Text style={s.appName}>MyApp</Text>
          <View style={s.versionBadge}>
            <Text style={s.versionBadgeText}>v{VERSION}</Text>
          </View>
          <Text style={s.buildText}>Build {BUILD}  ·  {RELEASE_DATE}</Text>
        </Animated.View>

        {/* ── App Info Table ── */}
        <Text style={s.sectionLabel}>APP INFORMATION</Text>
        <View style={s.infoCard}>
          {INFO_ROWS.map((row, idx) => (
            <View key={idx} style={[s.infoRow, idx < INFO_ROWS.length - 1 && s.infoRowBorder]}>
              <Text style={s.infoLabel}>{row.label}</Text>
              <Text style={s.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── What's New ── */}
        <Text style={s.sectionLabel}>WHAT'S NEW</Text>
        {CHANGELOG.map((release, ri) => (
          <View key={ri} style={s.changeCard}>
            <View style={s.changeHeader}>
              <View>
                <Text style={s.changeVersion}>Version {release.version}</Text>
                <Text style={s.changeDate}>{release.date}</Text>
              </View>
              <View style={[s.tagBadge, { backgroundColor: release.tagColor + '20' }]}>
                <Text style={[s.tagText, { color: release.tagColor }]}>{release.tag}</Text>
              </View>
            </View>
            <View style={s.changeDivider} />
            {release.changes.map((c, ci) => (
              <View key={ci} style={s.changeRow}>
                <View style={s.changeDot} />
                <Text style={s.changeText}>{c}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* ── Links ── */}
        <Text style={s.sectionLabel}>LEGAL</Text>
        <View style={s.linksCard}>
          {[
            { icon: '🔒', label: 'Privacy Policy',   url: 'https://myapp.com/privacy' },
            { icon: '📄', label: 'Terms of Service',  url: 'https://myapp.com/terms' },
            { icon: '🍪', label: 'Cookie Policy',     url: 'https://myapp.com/cookies' },
          ].map((item, idx, arr) => (
            <TouchableOpacity
              key={idx}
              style={[s.linkRow, idx < arr.length - 1 && s.linkBorder]}
              onPress={() => Linking.openURL(item.url)}
              activeOpacity={0.7}
            >
              <Text style={s.linkIcon}>{item.icon}</Text>
              <Text style={s.linkLabel}>{item.label}</Text>
              <Text style={s.linkArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>Made with ❤️ by MyApp Team</Text>
          <Text style={s.footerSub}>© 2025 MyApp. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll:    { paddingBottom: 48 },

  // Header
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg, paddingBottom: spacing.lg,
  },
  backBtn:     { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 20, color: 'white', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: 'white' },

  // Hero
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 8, paddingBottom: 36,
  },
  logoBox: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  logoText:     { fontSize: 48, fontWeight: '900', color: 'white' },
  appName:      { fontSize: 26, fontWeight: '800', color: 'white', marginBottom: 8 },
  versionBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 8 },
  versionBadgeText: { fontSize: 14, fontWeight: '700', color: 'white' },
  buildText:    { fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  // Section label
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textLight,
    letterSpacing: 1.2, marginTop: spacing.lg, marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  // Info table
  infoCard: {
    backgroundColor: 'white', borderRadius: 16,
    marginHorizontal: spacing.lg, ...shadows.card, overflow: 'hidden',
  },
  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 13 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel:     { fontSize: 13, color: colors.textSecondary },
  infoValue:     { fontSize: 13, fontWeight: '700', color: colors.text },

  // Changelog
  changeCard: {
    backgroundColor: 'white', borderRadius: 16,
    marginHorizontal: spacing.lg, marginBottom: 10,
    padding: spacing.md, ...shadows.card,
  },
  changeHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  changeVersion: { fontSize: 15, fontWeight: '700', color: colors.text },
  changeDate:    { fontSize: 11, color: colors.textLight, marginTop: 2 },
  tagBadge:      { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  tagText:       { fontSize: 12, fontWeight: '700' },
  changeDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  changeRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 7 },
  changeDot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6, flexShrink: 0 },
  changeText:    { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  // Links
  linksCard: {
    backgroundColor: 'white', borderRadius: 16,
    marginHorizontal: spacing.lg, ...shadows.card, overflow: 'hidden',
  },
  linkRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 14, gap: 12 },
  linkBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  linkIcon:   { fontSize: 18, width: 26, textAlign: 'center' },
  linkLabel:  { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
  linkArrow:  { fontSize: 20, color: colors.textLight },

  // Footer
  footer:    { alignItems: 'center', paddingTop: spacing.lg + 4, paddingBottom: 8 },
  footerText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  footerSub:  { fontSize: 11, color: colors.textLight, marginTop: 4 },
});