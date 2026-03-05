import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';
import { registerForPushNotifications, unregisterPushToken } from '../lib/notifications';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isPro: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, city: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Read isPro from custom claims (refreshed after Stripe webhook sets it)
        const token = await firebaseUser.getIdTokenResult();
        setIsPro(Boolean(token.claims['isPro']));
        // Sync profile to backend (non-fatal)
        api.post('/api/auth/sync', {}).catch(() => { });
        // Register push notification token (non-fatal)
        registerForPushNotifications().catch(() => { });
      } else {
        setIsPro(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUpWithEmail(email: string, password: string, city: string) {
    await createUserWithEmailAndPassword(auth, email, password);
    // Sync with city on first sign-up
    await api.post('/api/auth/sync', { city }).catch(() => { });
  }

  async function signOut() {
    // Deregister push token before signing out (non-fatal)
    await unregisterPushToken().catch(() => { });
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isPro, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
