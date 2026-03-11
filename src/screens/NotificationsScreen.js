// ─────────────────────────────────────────────────────────────────────────
// src/screens/NotificationsScreen.js
// ─────────────────────────────────────────────────────────────────────────
import React2, { useEffect, useState as useState2 } from 'react';
import { View as View2, Text as Text2, FlatList as FlatList2, TouchableOpacity as TO2, StyleSheet as SS2, ActivityIndicator as AI2, StatusBar as SB2 } from 'react-native';
import api2 from '../api/api';
import { colors as C, spacing as SP, shadows as SH } from '../theme';

export function NotificationsScreen({ navigation }) {
  const [data, setData] = useState2(null);
  const [loading, setLoading] = useState2(true);

  useEffect(() => {
    api2.get('/notifications').then(r => setData(r.data.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await api2.post('/notifications/read-all');
    setData(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })), unread_count: 0 }));
  };

  const TYPE_COLORS = { order: '#1A3C6E', chat: '#27AE60', review: '#F39C12', promo: '#9B59B6' };

  return (
    <View2 style={n.container}>
      <SB2 barStyle="light-content" backgroundColor={C.primaryDark} />
      <View2 style={n.header}>
        <Text2 style={n.headerTitle}>Notifications {data?.unread_count > 0 && <Text2 style={n.badge}> {data.unread_count} </Text2>}</Text2>
        {data?.unread_count > 0 && <TO2 onPress={markAllRead}><Text2 style={n.markAll}>Mark all read</Text2></TO2>}
      </View2>
      {loading ? <AI2 style={{ flex: 1 }} size="large" color={C.primary} /> : (
        <FlatList2
          data={data?.notifications || []}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={n.list}
          renderItem={({ item }) => (
            <TO2 style={[n.notifItem, !item.read && n.unread]} activeOpacity={0.85}>
              <View2 style={[n.iconBox, { backgroundColor: (TYPE_COLORS[item.type] || C.primary) + '15' }]}>
                <Text2 style={n.icon}>{item.icon}</Text2>
              </View2>
              <View2 style={{ flex: 1 }}>
                <Text2 style={[n.notifTitle, !item.read && { fontWeight: '800' }]}>{item.title}</Text2>
                <Text2 style={n.notifBody}>{item.body}</Text2>
                <Text2 style={n.notifTime}>{item.time}</Text2>
              </View2>
              {!item.read && <View2 style={n.unreadDot} />}
            </TO2>
          )}
        />
      )}
    </View2>
  );
}

const n = SS2.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SP.lg, paddingTop: SP.lg, paddingBottom: SP.lg },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white' },
  badge: { fontSize: 14, backgroundColor: '#E74C3C', borderRadius: 10, paddingHorizontal: 8, color: 'white' },
  markAll: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  list: { padding: SP.md, paddingBottom: 40 },
  notifItem: { backgroundColor: 'white', borderRadius: 16, padding: SP.md, marginBottom: SP.sm, flexDirection: 'row', alignItems: 'flex-start', gap: 12, ...SH.card },
  unread: { borderLeftWidth: 3, borderLeftColor: C.accent },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icon: { fontSize: 22 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 3 },
  notifBody: { fontSize: 12, color: C.textSecondary, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11, color: C.textLight },
  unreadDot: { width: 10, height: 10, backgroundColor: C.accent, borderRadius: 5, marginTop: 4, flexShrink: 0 },
});