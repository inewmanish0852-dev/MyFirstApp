// src/screens/ChangePasswordScreen.js
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator,
  StatusBar, KeyboardAvoidingView, Platform
} from "react-native";
import api from "../api/api";
import { getToken } from "../utils/auth";
import { colors, spacing, shadows, typography } from "../theme";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, label: '', color: colors.border };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: colors.error };
    if (score === 2) return { level: 2, label: 'Fair', color: '#F39C12' };
    if (score === 3) return { level: 3, label: 'Good', color: '#2980B9' };
    return { level: 4, label: 'Strong', color: colors.success };
  };

  const strength = getPasswordStrength(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      Alert.alert("Error", "New password must be different from current password.");
      return;
    }
    try {
      setLoading(true);
      const token = await getToken(); // AsyncStorage directly nahi, auth.js se
      await api.post("/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Success 🔒", "Password changed successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      console.log("error = ", e);
      Alert.alert("Failed", e.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ fieldKey, label, placeholder, value, setter, show, toggleShow }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, focusedField === fieldKey && styles.inputFocused]}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={setter}
          secureTextEntry={!show}
          autoCapitalize="none"
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
        />
        <TouchableOpacity onPress={toggleShow} style={styles.eyeButton}>
          <Text style={styles.eyeIcon}>{show ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.headerBg}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
        </View>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🔐</Text>
          <Text style={styles.headerSubtitle}>Keep your account secure</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🛡️ Password Tips</Text>
          {[
            'At least 8 characters long',
            'Include uppercase letters (A-Z)',
            'Include numbers (0-9)',
            'Include special characters (!@#$)',
          ].map((tip, i) => (
            <Text key={i} style={styles.tipItem}>• {tip}</Text>
          ))}
        </View>

        <View style={styles.formCard}>
          <PasswordField
            fieldKey="current"
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            setter={setCurrentPassword}
            show={showCurrent}
            toggleShow={() => setShowCurrent(!showCurrent)}
          />
          <View style={styles.divider} />
          <PasswordField
            fieldKey="new"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            setter={setNewPassword}
            show={showNew}
            toggleShow={() => setShowNew(!showNew)}
          />
          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4].map((bar) => (
                  <View key={bar} style={[styles.strengthBar, { backgroundColor: bar <= strength.level ? strength.color : colors.border }]} />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
            </View>
          )}
          <PasswordField
            fieldKey="confirm"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            setter={setConfirmPassword}
            show={showConfirm}
            toggleShow={() => setShowConfirm(!showConfirm)}
          />
          {confirmPassword.length > 0 && (
            <View style={styles.matchRow}>
              <Text style={[styles.matchText, { color: newPassword === confirmPassword ? colors.success : colors.error }]}>
                {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <><Text style={styles.saveButtonText}>Update Password</Text><Text style={styles.saveIcon}>🔒</Text></>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backButton: { marginRight: spacing.md },
  backText: { color: colors.accentLight, fontSize: 15, fontWeight: '500' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  headerIcon: { alignItems: 'center', paddingBottom: spacing.sm },
  headerIconText: { fontSize: 42, marginBottom: 6 },
  headerSubtitle: { fontSize: 13, color: colors.accentLight, letterSpacing: 0.5 },
  scroll: { flex: 1, marginTop: -spacing.md },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  tipsCard: { backgroundColor: '#EEF4FD', borderRadius: 16, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.accent },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: spacing.sm },
  tipItem: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },
  formCard: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.lg, marginBottom: spacing.md, ...shadows.card },
  fieldGroup: { marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.background, paddingHorizontal: spacing.md, height: 52 },
  inputFocused: { borderColor: colors.accent, backgroundColor: '#EEF4FD' },
  inputIcon: { fontSize: 15, marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.text },
  eyeButton: { padding: 4 },
  eyeIcon: { fontSize: 18 },
  strengthContainer: { flexDirection: 'row', alignItems: 'center', marginTop: -spacing.sm, marginBottom: spacing.md, gap: spacing.sm },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '700', minWidth: 45, textAlign: 'right' },
  matchRow: { marginTop: -spacing.sm, marginBottom: spacing.sm },
  matchText: { fontSize: 13, fontWeight: '600' },
  saveButton: { backgroundColor: colors.primary, borderRadius: 14, height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.sm, ...shadows.button },
  buttonDisabled: { opacity: 0.7 },
  saveButtonText: { ...typography.button, fontSize: 16 },
  saveIcon: { fontSize: 18 },
  cancelButton: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
});