import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState<Mode>('signin');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleGoogle() {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-accent">⚽</span>
          <h1>MatchDay Lounge</h1>
          <p className="auth-subtitle">Restaurant Partner Portal</p>
        </div>

        <div className="tab-switch">
          <button
            className={`tab-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-google" onClick={handleGoogle} disabled={submitting}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="divider"><span>or</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
