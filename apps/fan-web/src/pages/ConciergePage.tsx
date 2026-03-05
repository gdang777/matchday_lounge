import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import ProGate from '../components/ProGate';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080') + '/api/concierge';

type Message = { role: 'user' | 'assistant'; text: string };

export default function ConciergePage() {
  const { isPro } = useAuth();
  return isPro ? <ConciergeChat /> : <ProGate feature="AI Concierge" />;
}

function ConciergeChat() {
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm your MatchDay Lounge AI Concierge. Ask me anything about happy hour deals, match day venues, or what's on in Vancouver or Toronto. ⚽" },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ message: text }),
      });

      if (!response.ok || !response.body) throw new Error(`${response.status}`);

      let assistantText = '';
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split('\n');
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
            } catch { /* ignore malformed SSE */ }
          }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="chat-layout">
      <div className="chat-header">
        <h1 className="chat-title">⚡ AI Concierge</h1>
        <span className="pro-badge">PRO</span>
      </div>

      <div className="chat-messages" ref={messagesRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.role === 'assistant' && <div className="bubble-label">⚡ Concierge</div>}
            {msg.text || (loading && i === messages.length - 1 ? <span className="spinner-sm spinner" /> : '')}
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about venues, deals, match days… (Enter to send)"
          rows={1}
          maxLength={2000}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          {loading ? <span className="spinner-sm spinner" /> : '↑'}
        </button>
      </div>
    </div>
  );
}
