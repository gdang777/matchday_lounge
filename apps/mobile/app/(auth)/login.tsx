import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import CitySelector from '../../src/components/CitySelector';

type Mode = 'signin' | 'signup';
type City = 'VANCOUVER' | 'TORONTO';

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode,       setMode]       = useState<Mode>('signin');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [city,       setCity]       = useState<City | null>(null);
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && !city) {
      setError('Please select your city.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, city!);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Authentication failed.';
      setError(msg.replace('Firebase: ', '').replace(/\s*\(auth\/.*\)/, ''));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚽</Text>
          <Text style={styles.title}>MatchDay Lounge</Text>
          <Text style={styles.subtitle}>FIFA World Cup 2026 · Vancouver · Toronto</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'signin' && styles.toggleBtnActive]}
            onPress={() => { setMode('signin'); setError(''); }}
          >
            <Text style={[styles.toggleText, mode === 'signin' && styles.toggleTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
            onPress={() => { setMode('signup'); setError(''); }}
          >
            <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#4a4a6a"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
            placeholderTextColor="#4a4a6a"
            secureTextEntry
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          {mode === 'signup' && (
            <>
              <Text style={styles.label}>Your City</Text>
              <CitySelector value={city} onChange={setCity} />
            </>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.legal}>
          By continuing you agree to the MatchDay Lounge Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow:        1,
    backgroundColor: '#0f0f1a',
    padding:         24,
    paddingTop:      60,
  },
  header: {
    alignItems:   'center',
    marginBottom: 36,
  },
  logo: {
    fontSize:     56,
    marginBottom: 8,
  },
  title: {
    fontSize:     28,
    fontWeight:   '800',
    color:        '#f0f0f5',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color:    '#a0a0b0',
  },
  toggle: {
    flexDirection:   'row',
    backgroundColor: '#1a1a2e',
    borderRadius:    10,
    padding:         4,
    marginBottom:    24,
  },
  toggleBtn: {
    flex:            1,
    paddingVertical: 10,
    borderRadius:    8,
    alignItems:      'center',
  },
  toggleBtnActive: {
    backgroundColor: '#e94560',
  },
  toggleText: {
    fontSize:   14,
    fontWeight: '600',
    color:      '#a0a0b0',
  },
  toggleTextActive: {
    color: '#fff',
  },
  form: {
    gap: 12,
  },
  error: {
    backgroundColor: '#e9456020',
    borderWidth:     1,
    borderColor:     '#e94560',
    borderRadius:    8,
    padding:         12,
    color:           '#e94560',
    fontSize:        13,
  },
  label: {
    fontSize:    13,
    fontWeight:  '600',
    color:       '#a0a0b0',
    marginBottom: -4,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth:     1,
    borderColor:     '#2a2a4a',
    borderRadius:    10,
    paddingVertical:   13,
    paddingHorizontal: 14,
    color:           '#f0f0f5',
    fontSize:        15,
  },
  submitBtn: {
    backgroundColor: '#e94560',
    paddingVertical: 15,
    borderRadius:    12,
    alignItems:      'center',
    marginTop:       8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '700',
  },
  legal: {
    fontSize:  11,
    color:     '#4a4a6a',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
