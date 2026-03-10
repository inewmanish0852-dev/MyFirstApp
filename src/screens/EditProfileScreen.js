// src/screens/EditProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator,
  StatusBar, KeyboardAvoidingView, Platform, Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import api from "../api/api";
import { colors, spacing, shadows, typography } from "../theme";

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("The token=", token);
      const response = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = response.data.data;
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setCity(user.city || "");
      setState(user.state || "");
      setAddress(user.address || "");
      if (user.profile_image) {
        setProfileImage({ uri: user.profile_image });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePhoto = () => {
    Alert.alert(
      "Change Profile Photo",
      "Choose an option",
      [
        { text: "📷  Camera", onPress: openCamera },
        { text: "🖼️  Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.8, maxWidth: 800, maxHeight: 800 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) { Alert.alert("Error", "Could not open gallery."); return; }
        const asset = response.assets[0];
        setProfileImage({
          uri: asset.uri,
          fileName: asset.fileName || "profile.jpg",
          type: asset.type || "image/jpeg",
        });
      }
    );
  };

  const openCamera = () => {
    launchCamera(
      { mediaType: "photo", quality: 0.8, maxWidth: 800, maxHeight: 800, saveToPhotos: false },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) { Alert.alert("Error", "Could not open camera."); return; }
        const asset = response.assets[0];
        setProfileImage({
          uri: asset.uri,
          fileName: asset.fileName || "profile.jpg",
          type: asset.type || "image/jpeg",
        });
      }
    );
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and Email are required.");
      return;
    }
    try {
      setSaving(true);

      // FormData use karo taaki image bhi bhej sako
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);

      // Naya image select hua hai toh attach karo field name = profile_image
      if (profileImage && profileImage.fileName) {
        formData.append("profile_image", {
          uri: profileImage.uri,
          name: profileImage.fileName,
          type: profileImage.type,
        });
      }
      const token = await AsyncStorage.getItem("token");
      await api.put("/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      Alert.alert("Success ✅", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const fields = [
    {
      section: "Personal Info",
      items: [
        { key: 'name', label: 'Full Name', placeholder: 'John Smith', icon: '👤', value: name, setter: setName, keyboard: 'default' },
        { key: 'email', label: 'Email Address', placeholder: 'you@company.com', icon: '✉', value: email, setter: setEmail, keyboard: 'email-address' },
        { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', icon: '📞', value: phone, setter: setPhone, keyboard: 'phone-pad' },
      ]
    },
    {
      section: "Location",
      items: [
        { key: 'address', label: 'Street Address', placeholder: '123 Main Street', icon: '📍', value: address, setter: setAddress, keyboard: 'default' },
        { key: 'city', label: 'City', placeholder: 'New York', icon: '🏙️', value: city, setter: setCity, keyboard: 'default' },
        { key: 'state', label: 'State', placeholder: 'NY', icon: '🗺️', value: state, setter: setState, keyboard: 'default' },
      ]
    }
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={styles.headerBg}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        {/* Avatar with tap to change */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.85}>
            <View style={styles.avatarWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage.uri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Text style={styles.cameraBadgeIcon}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.changePhotoBtn} onPress={handleChangePhoto}>
            <Text style={styles.changePhotoIcon}>📷</Text>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

          {profileImage && profileImage.fileName && (
            <TouchableOpacity onPress={() => setProfileImage(null)} style={styles.removePhotoBtn}>
              <Text style={styles.removePhotoText}>✕ Remove Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {fields.map((section) => (
          <View key={section.section} style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.card}>
              {section.items.map((field, i) => (
                <View
                  key={field.key}
                  style={[styles.fieldGroup, i < section.items.length - 1 && styles.fieldBorder]}
                >
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
                      keyboardType={field.keyboard}
                      onFocus={() => setFocusedField(field.key)}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator color={colors.white} />
            : <>
                <Text style={styles.saveButtonText}>Save Changes</Text>
                <Text style={styles.saveIcon}>✓</Text>
              </>
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
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  headerBg: { backgroundColor: colors.primary, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  backButton: { marginRight: spacing.md },
  backText: { color: colors.accentLight, fontSize: 15, fontWeight: '500' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  avatarSection: { alignItems: 'center', paddingBottom: spacing.md },
  avatarWrapper: { position: 'relative', marginBottom: spacing.sm },
  avatar: {
    width: 84, height: 84, borderRadius: 26,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)', ...shadows.button,
  },
  avatarImage: {
    width: 84, height: 84, borderRadius: 26,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.white },
  cameraBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 10,
    backgroundColor: colors.white, alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: colors.primary,
  },
  cameraBadgeIcon: { fontSize: 13 },
  changePhotoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: 20, marginBottom: 6,
  },
  changePhotoIcon: { fontSize: 14 },
  changePhotoText: { fontSize: 13, fontWeight: '600', color: colors.white },
  removePhotoBtn: { marginTop: 4 },
  removePhotoText: { fontSize: 12, color: 'rgba(255,100,100,0.9)', fontWeight: '500' },
  scroll: { flex: 1, marginTop: -spacing.md },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionBlock: { marginBottom: spacing.md },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm, marginLeft: 4,
  },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.md, ...shadows.card },
  fieldGroup: { paddingVertical: spacing.sm },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, backgroundColor: colors.background,
    paddingHorizontal: spacing.md, height: 50,
  },
  inputFocused: { borderColor: colors.accent, backgroundColor: '#EEF4FD' },
  inputIcon: { fontSize: 15, marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.text },
  saveButton: {
    backgroundColor: colors.primary, borderRadius: 14, height: 54,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.sm,
    marginBottom: spacing.sm, ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  saveButtonText: { ...typography.button, fontSize: 16 },
  saveIcon: { fontSize: 18, color: colors.white, fontWeight: '700' },
  cancelButton: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
});