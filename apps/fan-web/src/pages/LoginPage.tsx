import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'signin' | 'signup';
type City = 'VANCOUVER' | 'TORONTO';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode,       setMode]       = useState<Mode>('signin');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [city,       setCity]       = useState<City>('VANCOUVER');
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleGoogle() {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Email and password are required.'); return; }
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, city);
      }
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(msg.replace('Firebase: ', '').replace(/\s*\(auth\/.*\)/, ''));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚽</div>
          <h1>MatchDay Lounge</h1>
          <p className="auth-subtitle">FIFA World Cup 2026 · Vancouver · Toronto</p>
        </div>

        <div className="tab-switch">
          <button className={`tab-btn${mode === 'signin' ? ' active' : ''}`} onClick={() => { setMode('signin'); setError(''); }}>Sign In</button>
          <button className={`tab-btn${mode === 'signup' ? ' active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>Create Account</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-google" onClick={handleGoogle} disabled={submitting}>
          <span>G</span> Continue with Google
        </button>

        <div className="divider">or</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label>Your City</label>
              <div className="city-toggle">
                <button type="button" className={`city-btn${city === 'VANCOUVER' ? ' active' : ''}`} onClick={() => setCity('VANCOUVER')}>🏔 Vancouver</button>
                <button type="button" className={`city-btn${city === 'TORONTO' ? ' active' : ''}`} onClick={() => setCity('TORONTO')}>🏙 Toronto</button>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
