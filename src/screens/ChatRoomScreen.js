// src/screens/ChatRoomScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import api from '../api/api';
import { colors, spacing, shadows } from '../theme';

export default function ChatRoomScreen({ route, navigation }) {
  const { chatId, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    api.get(`/chats/${chatId}/messages`).then(r => setMessages(r.data.data)).catch(console.log).finally(() => setLoading(false));
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      const res = await api.post(`/chats/${chatId}/send`, { message: text });
      setMessages(prev => [...prev, res.data.data]);
      setText('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) { console.log(e); } finally { setSending(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>←</Text></TouchableOpacity>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>{name}</Text>
          <Text style={s.headerOnline}>● Online</Text>
        </View>
      </View>
      {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} /> : (
        <FlatList ref={listRef} data={messages} keyExtractor={i => i.id.toString()} contentContainerStyle={s.list}
          renderItem={({ item, index }) => (
            <View>
              {(index === 0 || messages[index - 1]?.date !== item.date) && <Text style={s.dateLabel}>{item.date}</Text>}
              <View style={[s.bubble, item.sender === 'me' ? s.myBubble : s.theirBubble]}>
                <Text style={[s.bubbleText, item.sender === 'me' ? s.myText : s.theirText]}>{item.text}</Text>
                <Text style={[s.timeText, item.sender === 'me' ? { color: 'rgba(255,255,255,0.6)' } : { color: colors.textLight }]}>{item.time}</Text>
              </View>
            </View>
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd()}
        />
      )}
      <View style={s.inputBar}>
        <TextInput style={s.input} placeholder="Type a message..." placeholderTextColor={colors.textLight} value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={s.sendBtn} onPress={sendMessage} disabled={sending || !text.trim()}>
          {sending ? <ActivityIndicator size="small" color="white" /> : <Text style={s.sendIcon}>→</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  back: { color: 'rgba(255,255,255,0.7)', fontSize: 20 },
  headerInfo: {},
  headerName: { fontSize: 16, fontWeight: '700', color: 'white' },
  headerOnline: { fontSize: 11, color: '#5EF08A' },
  list: { padding: spacing.md, paddingBottom: 20 },
  dateLabel: { textAlign: 'center', fontSize: 11, color: colors.textLight, marginVertical: 10, backgroundColor: colors.border, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 10 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 10, marginBottom: 6 },
  myBubble: { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: 'white', alignSelf: 'flex-start', borderBottomLeftRadius: 4, ...shadows.card },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  myText: { color: 'white' },
  theirText: { color: colors.text },
  timeText: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: spacing.md, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: colors.text, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  sendIcon: { fontSize: 18, color: 'white', fontWeight: '700' },
});