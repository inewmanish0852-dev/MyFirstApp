// src/screens/AboutScreen.js
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, StatusBar
} from "react-native";
import api from "../api/api";
import { colors, spacing, shadows, typography } from "../theme";

export default function AboutScreen() {
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPage(); }, []);

  const loadPage = async () => {
    try {
      const response = await api.get("/page/about");
      setPage(response.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: '🏆', label: 'Excellence', desc: 'Award winning service' },
    { icon: '🤝', label: 'Trust', desc: '10+ years in business' },
    { icon: '🌍', label: 'Reach', desc: 'Global clientele' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.headerBg}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Company</Text>
          <Text style={styles.headerTitle}>About Us</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Highlights */}
            <View style={styles.highlightsRow}>
              {highlights.map((h, i) => (
                <View key={i} style={styles.highlightCard}>
                  <Text style={styles.highlightIcon}>{h.icon}</Text>
                  <Text style={styles.highlightLabel}>{h.label}</Text>
                  <Text style={styles.highlightDesc}>{h.desc}</Text>
                </View>
              ))}
            </View>

            {/* Content Card */}
            <View style={styles.contentCard}>
              {page.title && (
                <Text style={styles.contentTitle}>{page.title}</Text>
              )}
              <View style={styles.divider} />
              {page.content ? (
                <Text style={styles.contentText}>{page.content}</Text>
              ) : (
                <Text style={styles.contentText}>
                  We are a dedicated business solutions company committed to delivering excellence in every project. Our team of professionals brings expertise and innovation to help your business grow.
                </Text>
              )}
            </View>

            {/* Mission Card */}
            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <Text style={styles.missionIcon}>🎯</Text>
                <Text style={styles.missionTitle}>Our Mission</Text>
              </View>
              <Text style={styles.missionText}>
                To empower businesses with cutting-edge solutions and unparalleled support, driving growth and success in an ever-evolving market.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingBottom: spacing.xl },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  headerLabel: { fontSize: 13, color: colors.accentLight, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.white },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  loadingContainer: { alignItems: 'center', paddingTop: spacing.xxl },
  highlightsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  highlightCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md, alignItems: 'center', ...shadows.card,
  },
  highlightIcon: { fontSize: 24, marginBottom: spacing.xs },
  highlightLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  highlightDesc: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  contentCard: {
    backgroundColor: colors.surface, borderRadius: 20,
    padding: spacing.lg, marginBottom: spacing.md, ...shadows.card,
  },
  contentTitle: { ...typography.h2, marginBottom: spacing.sm },
  divider: { height: 3, width: 40, backgroundColor: colors.accent, borderRadius: 2, marginBottom: spacing.md },
  contentText: { ...typography.body, lineHeight: 26, color: colors.textSecondary },
  missionCard: {
    backgroundColor: colors.primary, borderRadius: 20,
    padding: spacing.lg, ...shadows.button,
  },
  missionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  missionIcon: { fontSize: 22, marginRight: spacing.sm },
  missionTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  missionText: { fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 24 },
});