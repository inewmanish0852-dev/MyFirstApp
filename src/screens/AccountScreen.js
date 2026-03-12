// src/screens/AccountScreen.js
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { removeToken } from "../utils/auth";
import { colors, spacing, shadows, typography } from "../theme";

export default function AccountScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await removeToken();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', desc: 'Update your information', screen: 'EditProfile' },
    { icon: '🔔', label: 'Notifications', desc: 'Manage your alerts', screen: 'Notifications' },
    { icon: '🔒', label: 'Change Password', desc: 'Update your security', screen: 'ChangePassword' },
    { icon: '❓', label: 'Help & Support', desc: 'Get assistance', screen: 'Helpsupport' },
    { icon: 'ℹ️', label: 'App Version', desc: 'v1.0.0', screen: 'AppVersion' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Profile Header */}
      <View style={styles.headerBg}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {user ? (
            <>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>● Active Account</Text>
              </View>
            </>
          ) : (
            <Text style={styles.userName}>My Account</Text>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>MyApp Business v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingBottom: spacing.xxl },
  profileSection: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  avatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.accent, alignItems: 'center',
    justifyContent: 'center', marginBottom: spacing.sm,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', ...shadows.button,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: colors.white },
  userName: { fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 4 },
  userEmail: { fontSize: 14, color: colors.accentLight, marginBottom: spacing.sm },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 20,
  },
  badgeText: { fontSize: 12, color: '#5EF08A', fontWeight: '600' },
  scroll: { flex: 1, marginTop: -spacing.lg },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  menuCard: {
    backgroundColor: colors.surface, borderRadius: 20,
    overflow: 'hidden', ...shadows.card, marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconContainer: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.background, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  menuIcon: { fontSize: 18 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2 },
  menuDesc: { fontSize: 12, color: colors.textLight },
  menuArrow: { fontSize: 24, color: colors.textLight },
  logoutButton: {
    backgroundColor: '#FFF0F0', borderWidth: 1.5, borderColor: '#FFCCCC',
    borderRadius: 16, height: 56, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  logoutIcon: { fontSize: 20 },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.error },
  footer: { textAlign: 'center', marginTop: spacing.lg, fontSize: 12, color: colors.textLight },
});