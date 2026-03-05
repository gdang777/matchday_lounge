import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import ProGate from '../../src/components/ProGate';
import { auth } from '../../src/lib/firebase';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080') + '/api/concierge';

type Message = { role: 'user' | 'assistant'; text: string };

export default function ConciergeScreen() {
  const { user, isPro } = useAuth();

  if (!isPro) {
    return <ProGate feature="AI Concierge" />;
  }

  return <ConciergeChat />;
}

function ConciergeChat() {
  const scrollRef             = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm your MatchDay Lounge AI Concierge. Ask me anything about happy hour deals, match day venues, or what's on in Vancouver or Toronto during the World Cup. ⚽" },
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const token    = await auth.currentUser?.getIdToken();
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API error ${response.status}`);
      }

      // Stream SSE response
      let assistantText = '';
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data) as { text?: string };
              if (parsed.text) {
                assistantText += parsed.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', text: assistantText };
                  return updated;
                });
              }
            } catch {
              // Ignore malformed SSE chunks
            }
          }
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I had trouble connecting. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚡ AI Concierge</Text>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg, i) => (
          <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
            {msg.role === 'assistant' && (
              <Text style={styles.bubbleLabel}>⚡ Concierge</Text>
            )}
            <Text style={[styles.bubbleText, msg.role === 'user' && styles.bubbleTextUser]}>
              {msg.text}
              {loading && i === messages.length - 1 && msg.role === 'assistant' && msg.text === '' && (
                <ActivityIndicator size="small" color="#e94560" />
              )}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about venues, deals, match days..."
          placeholderTextColor="#4a4a6a"
          multiline
          maxLength={2000}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.sendIcon}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    paddingTop:        60,
    paddingHorizontal: 20,
    paddingBottom:     14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#f0f0f5' },
  proBadge: {
    backgroundColor: '#e94560',
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      6,
  },
  proBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  messages:        { flex: 1 },
  messagesContent: { padding: 16, gap: 12 },
  bubble: {
    maxWidth:     '85%',
    borderRadius: 14,
    padding:      12,
  },
  bubbleUser: {
    backgroundColor: '#e94560',
    alignSelf:       'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: '#16213e',
    alignSelf:       'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth:     1,
    borderColor:     '#1e2a4a',
  },
  bubbleLabel:    { fontSize: 10, color: '#6b6b8a', fontWeight: '700', marginBottom: 4 },
  bubbleText:     { fontSize: 14, color: '#f0f0f5', lineHeight: 21 },
  bubbleTextUser: { color: '#fff' },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'flex-end',
    padding:         12,
    paddingBottom:   Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth:  1,
    borderTopColor:  '#1a1a2e',
    gap:             10,
  },
  input: {
    flex:              1,
    backgroundColor:   '#1a1a2e',
    borderWidth:       1,
    borderColor:       '#2a2a4a',
    borderRadius:      12,
    paddingVertical:   10,
    paddingHorizontal: 14,
    color:             '#f0f0f5',
    fontSize:          14,
    maxHeight:         120,
  },
  sendBtn: {
    width:           42,
    height:          42,
    borderRadius:    21,
    backgroundColor: '#e94560',
    alignItems:      'center',
    justifyContent:  'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { fontSize: 20, color: '#fff', fontWeight: '700' },
});
