// src/screens/GalleryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows } from '../theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GalleryScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const tabs = ['All', 'Products', 'Team'];

  useEffect(() => {
    const loadGallery = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      api.get('/gallery', { headers: { Authorization: `Bearer ${token}` } }).then(r => { setItems(r.data.data); setFiltered(r.data.data); }).catch(console.log).finally(() => setLoading(false));
    };
    loadGallery();
  }, []);

  const filterTab = (tab) => {
    setActiveTab(tab);
    setFiltered(tab === 'All' ? items : items.filter(i => i.category === tab));
  };

  const EMOJIS = { 1: '🎧', 2: '👕', 3: '📱', 4: '🎒', 5: '⌚', 6: '🏢', 7: '👥', 8: '🏭' };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <Text style={s.headerTitle}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} style={[s.tab, activeTab === tab && s.tabActive]} onPress={() => filterTab(tab)}>
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /> : (
        <FlatList
          data={filtered} numColumns={3} keyExtractor={i => i.id.toString()}
          contentContainerStyle={s.grid}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.gridItem} activeOpacity={0.85}>
              <View style={s.imgBox}><Text style={s.imgEmoji}>{EMOJIS[item.id] || '🖼️'}</Text></View>
              <Text style={s.imgTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: spacing.sm },
  tabsScroll: {},
  tab: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginRight: 8 },
  tabActive: { backgroundColor: 'white' },
  tabText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  grid: { padding: spacing.sm, paddingBottom: 40 },
  gridItem: { flex: 1, margin: 4, alignItems: 'center' },
  imgBox: { width: '100%', aspectRatio: 1, backgroundColor: 'white', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 5, ...{ shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 } },
  imgEmoji: { fontSize: 40 },
  imgTitle: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
});