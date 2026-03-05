import { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            // Check admin claim before allowing entry.
            const tokenResult = await result.user.getIdTokenResult(true);
            if (tokenResult.claims['admin'] !== true) {
                await auth.signOut();
                setError('Access denied: this account does not have admin permissions.');
                return;
            }

            navigate('/dashboard');
        } catch (err: unknown) {
            const msg = (err as { message?: string }).message ?? 'Sign in failed';
            if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
                setError('Invalid email or password.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-accent">⚽</div>
                    <h1>MatchDay Lounge</h1>
                    <div className="auth-subtitle">Admin Panel</div>
                    <div className="auth-admin-badge">🔐 Admin Only</div>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@matchdaylounge.com"
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
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        style={{ marginTop: 4 }}
                    >
                        {loading ? <span className="spinner-sm spinner" /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
