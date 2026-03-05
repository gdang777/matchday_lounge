import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import ProfileTab from '../features/profile/ProfileTab';
import PromotionsTab from '../features/promotions/PromotionsTab';
import AnalyticsTab from '../features/analytics/AnalyticsTab';
import BoostTab from '../features/boosts/BoostTab';
import RegisterForm from '../features/profile/RegisterForm';

export type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  city: string;
  neighborhood: string | null;
  address: string | null;
  cuisineType: string | null;
  phoneNumber: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  photoUrls: string | null;
  isVerified: boolean;
  isApproved: boolean;
  isSuspended: boolean;
  boostTier: string;
  boostExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Tab = 'profile' | 'promotions' | 'analytics' | 'boosts';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const {
    data: restaurant,
    isLoading,
    error,
    refetch,
  } = useQuery<Restaurant>({
    queryKey: ['my-restaurant'],
    queryFn: async () => {
      const res = await api.get<Restaurant>('/api/restaurants/mine');
      return res.data;
    },
    retry: false,
  });

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  // ─── Restaurant not yet registered ─────────────────────────────────────────
  const noRestaurant = error || !restaurant;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>⚽</span>
          <span>MatchDay Lounge</span>
        </div>

        {restaurant && !restaurant.isSuspended && (
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">🏪</span> My Listing
            </button>
            <button
              className={`nav-item ${activeTab === 'promotions' ? 'active' : ''}`}
              onClick={() => setActiveTab('promotions')}
            >
              <span className="nav-icon">🎉</span> Promotions
            </button>
            <button
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📊</span> Analytics
            </button>
            <button
              className={`nav-item ${activeTab === 'boosts' ? 'active' : ''}`}
              onClick={() => setActiveTab('boosts')}
            >
              <span className="nav-icon">🚀</span> Boost Listing
            </button>
          </nav>
        )}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {/* No restaurant registered yet */}
        {noRestaurant && (
          <div className="dashboard-section">
            <div className="page-header">
              <h2>Register Your Restaurant</h2>
              <p className="text-muted">
                Submit your restaurant to appear on MatchDay Lounge during the FIFA World Cup 2026.
              </p>
            </div>
            <RegisterForm onSuccess={() => refetch()} />
          </div>
        )}

        {/* Restaurant suspended */}
        {restaurant?.isSuspended && (
          <div className="dashboard-section">
            <div className="alert alert-error">
              <strong>Account suspended.</strong> Your restaurant listing has been suspended.
              Please contact support at support@matchdaylounge.com for assistance.
            </div>
          </div>
        )}

        {/* Pending approval */}
        {restaurant && !restaurant.isApproved && !restaurant.isSuspended && (
          <div className="dashboard-section">
            <div className="status-card status-pending">
              <div className="status-icon">⏳</div>
              <h3>Application Under Review</h3>
              <p>
                <strong>{restaurant.name}</strong> has been submitted and is awaiting approval
                from the MatchDay Lounge team. We typically review applications within 1–2 business days.
              </p>
              <p className="text-muted">You'll receive an email once your listing goes live.</p>
            </div>
          </div>
        )}

        {/* Full dashboard */}
        {restaurant?.isApproved && !restaurant.isSuspended && (
          <>
            {/* Status bar */}
            <div className="dashboard-topbar">
              <div>
                <h2 className="restaurant-name">{restaurant.name}</h2>
                <div className="badge-row">
                  {restaurant.isVerified && <span className="badge badge-blue">✓ Verified</span>}
                  <span className={`badge badge-boost-${restaurant.boostTier.toLowerCase()}`}>
                    {restaurant.boostTier}
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'profile' && <ProfileTab restaurant={restaurant} onSaved={() => refetch()} />}
            {activeTab === 'promotions' && <PromotionsTab restaurantId={restaurant.id} />}
            {activeTab === 'analytics' && <AnalyticsTab restaurantId={restaurant.id} />}
            {activeTab === 'boosts' && <BoostTab restaurant={restaurant} />}
          </>
        )}
      </main>
    </div>
  );
}
