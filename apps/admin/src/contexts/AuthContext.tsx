import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import {
    User,
    onAuthStateChanged,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

type AuthContextValue = {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    user: null,
    isAdmin: false,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Force-refresh to get latest custom claims.
                const idTokenResult = await firebaseUser.getIdTokenResult(/* forceRefresh */ true);
                setIsAdmin(idTokenResult.claims['admin'] === true);
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });
    }, []);

    async function signOut() {
        await firebaseSignOut(auth);
    }

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
