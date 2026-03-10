// src/screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import api from "../api/api";
import { colors, spacing, shadows, typography } from "../theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const register = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await api.post("/register", { name, email, password });
      Alert.alert("Success", "Account created! Please sign in.", [
        { text: "Sign In", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      Alert.alert("Register Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Smith', icon: '👤', setter: setName, value: name, type: 'default' },
    { key: 'email', label: 'Email Address', placeholder: 'you@company.com', icon: '✉', setter: setEmail, value: email, type: 'email-address' },
    { key: 'password', label: 'Password', placeholder: 'Min. 8 characters', icon: '🔒', setter: setPassword, value: password, type: 'default', secure: true },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>B</Text>
          </View>
          <Text style={styles.brandName}>Create Account</Text>
          <Text style={styles.tagline}>Join MyApp Business</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Started</Text>
          <Text style={styles.cardSubtitle}>Fill in your details to create an account</Text>

          {fields.map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={[styles.inputWrapper, focusedField === field.key && styles.inputFocused]}>
                <Text style={styles.inputIcon}>{field.icon}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textLight}
                  value={field.value}
                  onChangeText={field.setter}
                  autoCapitalize="none"
                  keyboardType={field.type}
                  secureTextEntry={field.secure || false}
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
          ))}

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={register}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.primaryButtonText}>Create Account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
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
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: spacing.xl },
  backButton: { position: 'absolute', left: spacing.lg, top: 55 },
  backText: { color: colors.accentLight, fontSize: 15, fontWeight: '500' },
  logoContainer: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: colors.accent, alignItems: 'center',
    justifyContent: 'center', marginBottom: spacing.sm, ...shadows.button,
  },
  logoText: { fontSize: 28, fontWeight: '800', color: colors.white },
  brandName: { fontSize: 24, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  tagline: { fontSize: 13, color: colors.accentLight, marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' },
  card: {
    marginHorizontal: spacing.md, backgroundColor: colors.surface,
    borderRadius: 24, padding: spacing.lg, ...shadows.card,
  },
  cardTitle: { ...typography.h2, marginBottom: 4 },
  cardSubtitle: { ...typography.bodySecondary, marginBottom: spacing.lg },
  fieldGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, backgroundColor: colors.background,
    paddingHorizontal: spacing.md, height: 52,
  },
  inputFocused: { borderColor: colors.accent, backgroundColor: '#EEF4FD' },
  inputIcon: { fontSize: 16, marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.text },
  termsContainer: { marginBottom: spacing.md },
  termsText: { fontSize: 12, color: colors.textLight, lineHeight: 18, textAlign: 'center' },
  termsLink: { color: colors.accent, fontWeight: '600' },
  primaryButton: {
    backgroundColor: colors.primary, borderRadius: 12, height: 52,
    alignItems: 'center', justifyContent: 'center', ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { ...typography.button, fontSize: 16 },
  loginLink: { alignItems: 'center', marginTop: spacing.md },
  loginLinkText: { fontSize: 14, color: colors.textSecondary },
  loginLinkBold: { color: colors.primary, fontWeight: '700' },
  footer: { textAlign: 'center', marginTop: spacing.lg, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});