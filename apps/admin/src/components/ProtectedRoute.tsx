import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div className="unauth-screen">
                <div style={{ fontSize: 56 }}>🚫</div>
                <h2>Access Denied</h2>
                <p>
                    This panel is restricted to MatchDay Lounge administrators.
                    Your account does not have the required admin permissions.
                </p>
                <button
                    className="btn btn-secondary"
                    style={{ marginTop: 8 }}
                    onClick={() => auth.signOut()}
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
