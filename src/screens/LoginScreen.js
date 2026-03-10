// src/screens/LoginScreen.js
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import api from "../api/api";
import { saveToken } from "../utils/auth";
import { colors, spacing, shadows, typography } from "../theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/login", { email, password });
      if (response.data.status) {
        console.log("Login Token =", response.data.data.token);
        await saveToken(response.data.data.token);
        navigation.replace("MainTabs");
      } else {
        Alert.alert("Login Failed", response.data.message);
      }
    } catch (e) {
      Alert.alert("Login Failed", e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>B</Text>
          </View>
          <Text style={styles.brandName}>MyApp</Text>
          <Text style={styles.tagline}>Business Solutions</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputFocused]}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="you@company.com"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textLight}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={login}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.primaryButtonText}>Sign In</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>New to MyApp?</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2025 MyApp. All rights reserved.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryDark },
  scroll: { flexGrow: 1, paddingBottom: spacing.xl },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.button,
  },
  logoText: { fontSize: 28, fontWeight: '800', color: colors.white },
  brandName: { fontSize: 24, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  tagline: { fontSize: 13, color: colors.accentLight, marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' },
  card: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.card,
  },
  cardTitle: { ...typography.h2, marginBottom: 4 },
  cardSubtitle: { ...typography.bodySecondary, marginBottom: spacing.lg },
  fieldGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputFocused: { borderColor: colors.accent, backgroundColor: '#EEF4FD' },
  inputIcon: { fontSize: 16, marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.text },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { ...typography.button, fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.caption, marginHorizontal: spacing.sm, color: colors.textLight },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  footer: { textAlign: 'center', marginTop: spacing.lg, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});