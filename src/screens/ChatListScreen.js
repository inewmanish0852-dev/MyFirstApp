// src/screens/ChatListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows } from '../theme';

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chats').then(r => setChats(r.data.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}><Text style={s.headerTitle}>Messages</Text></View>
      {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /> : (
        <FlatList data={chats} keyExtractor={i => i.id.toString()} contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.chatItem} onPress={() => navigation.navigate('ChatRoom', { chatId: item.id, name: item.name })} activeOpacity={0.85}>
              <View style={[s.avatar, { backgroundColor: item.color }]}><Text style={s.avatarText}>{item.avatar}</Text></View>
              <View style={s.chatInfo}>
                <View style={s.chatTop}>
                  <Text style={s.chatName}>{item.name}</Text>
                  <Text style={s.chatTime}>{item.time}</Text>
                </View>
                <View style={s.chatBottom}>
                  <Text style={s.chatMsg} numberOfLines={1}>{item.last_message}</Text>
                  {item.unread > 0 && <View style={s.unreadBadge}><Text style={s.unreadText}>{item.unread}</Text></View>}
                </View>
              </View>
              {item.online && <View style={s.onlineDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '700', color: 'white' },
  list: { padding: spacing.md },
  chatItem: { backgroundColor: 'white', borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadows.card, position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: 'white' },
  chatInfo: { flex: 1 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 15, fontWeight: '700', color: colors.text },
  chatTime: { fontSize: 11, color: colors.textLight },
  chatBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatMsg: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  unreadBadge: { width: 20, height: 20, backgroundColor: colors.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  unreadText: { fontSize: 11, fontWeight: '700', color: 'white' },
  onlineDot: { position: 'absolute', top: 12, left: 52, width: 12, height: 12, backgroundColor: '#27AE60', borderRadius: 6, borderWidth: 2, borderColor: 'white' },
});