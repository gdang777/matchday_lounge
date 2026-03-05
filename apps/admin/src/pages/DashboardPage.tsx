import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RestaurantsTab from '../features/restaurants/RestaurantsTab';
import PromotionsTab from '../features/promotions/PromotionsTab';
import AnalyticsTab from '../features/analytics/AnalyticsTab';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

type Tab = 'restaurants' | 'promotions' | 'analytics';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('restaurants');

    async function handleSignOut() {
        await signOut();
        navigate('/login');
    }

    // Fetch queue counts for nav badges
    const { data: pendingRestaurants = [] } = useQuery<{ id: string }[]>({
        queryKey: ['admin-pending-restaurants'],
        queryFn: async () => {
            const res = await api.get('/api/admin/restaurants/pending');
            return res.data;
        },
    });

    const { data: pendingPromotions = [] } = useQuery<{ id: string }[]>({
        queryKey: ['admin-pending-promotions'],
        queryFn: async () => {
            const res = await api.get('/api/admin/promotions/pending');
            return res.data;
        },
    });

    const navItems: { key: Tab; label: string; icon: string; count?: number }[] = [
        { key: 'restaurants', label: 'Restaurants', icon: '🏪', count: pendingRestaurants.length },
        { key: 'promotions', label: 'Promotions', icon: '🎉', count: pendingPromotions.length },
        { key: 'analytics', label: 'Analytics', icon: '📊' },
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span>⚽</span>
                    <div>
                        <div>MatchDay Lounge</div>
                        <div className="sidebar-logo-sub">Admin Panel</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.key)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                            {item.count !== undefined && item.count > 0 && (
                                <span className="nav-badge">{item.count}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-email">{user?.email}</div>
                    <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="dashboard-main">
                {activeTab === 'restaurants' && <RestaurantsTab />}
                {activeTab === 'promotions' && <PromotionsTab />}
                {activeTab === 'analytics' && <AnalyticsTab />}
            </main>
        </div>
    );
}
