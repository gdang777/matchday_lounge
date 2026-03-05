import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import api from '../lib/api';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Sync user profile to Data Connect after any sign-in.
  async function syncProfile(city?: string) {
    try {
      await api.post('/api/auth/sync', { city: city ?? null });
    } catch {
      // Non-fatal — the user can still use the portal.
    }
  }

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider);
    await syncProfile();
  }

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    await syncProfile();
  }

  async function signUpWithEmail(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
    await syncProfile();
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
