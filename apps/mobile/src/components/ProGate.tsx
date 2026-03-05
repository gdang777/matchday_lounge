import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Linking, ActivityIndicator,
} from 'react-native';
import { auth } from '../lib/firebase';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080') + '/api/stripe/checkout/pro';

type Props = {
  feature?: string;
};

export default function ProGate({ feature = 'this feature' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    setLoading(true);
    setError('');
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Server error ${response.status}`);
      }

      const { url } = await response.json() as { url: string };
      await Linking.openURL(url);
    } catch (err: unknown) {
      const msg = (err as Error).message ?? 'Failed to start checkout. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚡</Text>
      <Text style={styles.title}>Pro Required</Text>
      <Text style={styles.body}>
        {feature} is available to MatchDay Lounge Pro subscribers.
        Get unlimited AI Concierge access, Match Day Alerts, and more.
      </Text>
      <Text style={styles.price}>$9.99 / month</Text>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpgrade}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={styles.buttonText}>Upgrade to Pro →</Text>
        }
      </TouchableOpacity>

      <Text style={styles.legalText}>
        Billed monthly · Cancel anytime
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0f0f1a',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f0f0f5',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#a0a0b0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#e94560',
    fontWeight: '800',
    marginBottom: 28,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#ff8a80',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    maxWidth: 280,
  },
  legalText: {
    fontSize: 12,
    color: '#6b6b8a',
    textAlign: 'center',
  },
});
