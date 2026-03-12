// src/screens/NotificationsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, StatusBar
} from 'react-native';
import api from '../api/api';
import { getToken } from '../utils/auth';
import { colors, spacing, shadows } from '../theme';

export default function NotificationsScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const token = await getToken();
      const res = await api.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data);
    } catch (e) {
      console.log('Notifications error:', e);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const token = await getToken();
      await api.post('/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unread_count: 0,
      }));
    } catch (e) {
      console.log('markAllRead error:', e);
    }
  };

  const TYPE_COLORS = {
    order:  '#1A3C6E',
    chat:   '#27AE60',
    review: '#F39C12',
    promo:  '#9B59B6',
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>
          Notifications{' '}
          {data?.unread_count > 0 && (
            <Text style={s.badge}> {data.unread_count} </Text>
          )}
        </Text>
        {data?.unread_count > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={s.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={data?.notifications || []}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🔔</Text>
              <Text style={s.emptyText}>No notifications yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.notifItem, !item.read && s.unread]}
              activeOpacity={0.85}
            >
              <View style={[s.iconBox, { backgroundColor: (TYPE_COLORS[item.type] || colors.primary) + '20' }]}>
                <Text style={s.icon}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.notifTitle, !item.read && { fontWeight: '800' }]}>
                  {item.title}
                </Text>
                <Text style={s.notifBody}>{item.body}</Text>
                <Text style={s.notifTime}>{item.time}</Text>
              </View>
              {!item.read && <View style={s.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background },
  header:      { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white' },
  badge:       { fontSize: 13, backgroundColor: '#E74C3C', borderRadius: 10, paddingHorizontal: 8, color: 'white', overflow: 'hidden' },
  markAll:     { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  list:        { padding: spacing.md, paddingBottom: 40 },
  notifItem:   { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'flex-start', gap: 12, ...shadows.card },
  unread:      { borderLeftWidth: 3, borderLeftColor: colors.accent },
  iconBox:     { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icon:        { fontSize: 22 },
  notifTitle:  { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  notifBody:   { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginBottom: 4 },
  notifTime:   { fontSize: 11, color: colors.textLight },
  unreadDot:   { width: 10, height: 10, backgroundColor: colors.accent, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  empty:       { alignItems: 'center', paddingTop: 80 },
  emptyIcon:   { fontSize: 48, marginBottom: 12 },
  emptyText:   { fontSize: 15, color: colors.textLight },
});