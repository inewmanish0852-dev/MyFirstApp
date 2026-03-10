// src/screens/ContactScreen.js
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator,
  StatusBar, KeyboardAvoidingView, Platform
} from "react-native";
import api from "../api/api";
import { colors, spacing, shadows, typography } from "../theme";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const sendMessage = async () => {
    if (!name || !email || !message) {
      Alert.alert("Missing Fields", "Please fill in all fields before sending.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/contact", { name, email, message });
      Alert.alert("Message Sent! ✉️", "We'll get back to you within 24 hours.");
      setName(""); setEmail(""); setMessage("");
    } catch (e) {
      Alert.alert("Failed to Send", "Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: '📍', label: 'Address', value: '123 Business Ave, City' },
    { icon: '📞', label: 'Phone', value: '+1 (555) 000-0000' },
    { icon: '🕒', label: 'Hours', value: 'Mon–Fri, 9am–6pm' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.headerBg}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Get In Touch</Text>
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Info */}
        <View style={styles.infoCard}>
          {contactInfo.map((item, i) => (
            <View key={i} style={[styles.infoRow, i < contactInfo.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send a Message</Text>
          <Text style={styles.formSubtitle}>We'll respond within 24 hours</Text>

          {[
            { key: 'name', label: 'Your Name', placeholder: 'John Smith', icon: '👤', value: name, setter: setName },
            { key: 'email', label: 'Email Address', placeholder: 'you@company.com', icon: '✉', value: email, setter: setEmail, keyboard: 'email-address' },
          ].map((field) => (
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
                  keyboardType={field.keyboard || 'default'}
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Message</Text>
            <View style={[styles.textAreaWrapper, focusedField === 'message' && styles.inputFocused]}>
              <TextInput
                style={styles.textArea}
                placeholder="How can we help you today?"
                placeholderTextColor={colors.textLight}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            <Text style={styles.charCount}>{message.length} / 500</Text>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.buttonDisabled]}
            onPress={sendMessage}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <>
                  <Text style={styles.sendButtonText}>Send Message</Text>
                  <Text style={styles.sendIcon}>→</Text>
                </>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  infoCard: {
    backgroundColor: colors.surface, borderRadius: 20,
    padding: spacing.md, marginBottom: spacing.md, ...shadows.card,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon: { fontSize: 22, marginRight: spacing.md, width: 36, textAlign: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  formCard: {
    backgroundColor: colors.surface, borderRadius: 20,
    padding: spacing.lg, ...shadows.card,
  },
  formTitle: { ...typography.h2, marginBottom: 4 },
  formSubtitle: { ...typography.bodySecondary, marginBottom: spacing.lg },
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
  textAreaWrapper: {
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, backgroundColor: colors.background,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, minHeight: 120,
  },
  textArea: { fontSize: 15, color: colors.text, minHeight: 100 },
  charCount: { fontSize: 12, color: colors.textLight, textAlign: 'right', marginTop: 4 },
  sendButton: {
    backgroundColor: colors.primary, borderRadius: 12, height: 52,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.sm, ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  sendButtonText: { ...typography.button, fontSize: 16 },
  sendIcon: { fontSize: 20, color: colors.white },
});