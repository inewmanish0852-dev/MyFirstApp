// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, StatusBar, RefreshControl
} from "react-native";
import api from "../api/api";
import { colors, spacing, shadows, typography } from "../theme";

export default function HomeScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadServices(); };

  const serviceIcons = ['💼', '📊', '🔧', '🌐', '📱', '🎯', '⚙️', '📋'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Top Header */}
      <View style={styles.headerBg}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Day 👋</Text>
            <Text style={styles.headerTitle}>Our Services</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{services.length}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Services', value: services.length },
            { label: 'Active', value: services.length },
            { label: 'Support', value: '24/7' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.sectionTitle}>Available Services</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Services Yet</Text>
            <Text style={styles.emptyText}>Services will appear here once added.</Text>
          </View>
        ) : (
          services.map((service, index) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard} activeOpacity={0.9}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>{serviceIcons[index % serviceIcons.length]}</Text>
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                {service.description && (
                  <Text style={styles.serviceDesc} numberOfLines={2}>{service.description}</Text>
                )}
              </View>
              <Text style={styles.serviceArrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  greeting: { fontSize: 14, color: colors.accentLight, fontWeight: '500', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.white },
  headerBadge: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  headerBadgeText: { fontSize: 16, fontWeight: '700', color: colors.white },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, padding: spacing.sm, alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.white },
  statLabel: { fontSize: 11, color: colors.accentLight, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md, color: colors.textSecondary },
  loadingContainer: { alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodySecondary, marginTop: spacing.sm },
  emptyContainer: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, marginBottom: spacing.xs },
  emptyText: { ...typography.bodySecondary, textAlign: 'center' },
  serviceCard: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md, marginBottom: spacing.sm,
    flexDirection: 'row', alignItems: 'center', ...shadows.card,
  },
  serviceIconContainer: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.background, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  serviceIcon: { fontSize: 22 },
  serviceContent: { flex: 1 },
  serviceTitle: { ...typography.h3, fontSize: 16, marginBottom: 3 },
  serviceDesc: { ...typography.bodySecondary, fontSize: 13 },
  serviceArrow: { fontSize: 24, color: colors.textLight, fontWeight: '300' },
});