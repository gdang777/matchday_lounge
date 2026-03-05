import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { MOCK_DEALS, MOCK_RESTAURANTS, type MockDeal, type MockRestaurant } from '../lib/mockData';

type Promotion = MockDeal;
type RestaurantData = MockRestaurant;

const DEAL_COLOURS: Record<string, string> = {
  DRINKS: '#3b82f6',
  FOOD: '#22c55e',
  BOTH: '#a855f7',
};

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const restaurant = (state?.restaurant as RestaurantData | undefined) ?? MOCK_RESTAURANTS.find(r => r.id === id);

  useEffect(() => {
    if (id && restaurant?.city) {
      api.post(`/api/restaurants/${id}/view`, { viewType: 'PROFILE', city: restaurant.city }).catch(() => { });
    }
  }, [id]);

  const { data: promotions, isLoading } = useQuery<Promotion[]>({
    queryKey: ['promotions-active', id],
    queryFn: async () => MOCK_DEALS.filter(d => d.restaurantId === id),
    enabled: !!id,
  });

  if (!restaurant) {
    return (
      <div className="page">
        <p className="text-muted">Restaurant data not found. <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>Go back</button></p>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>

      {/* Header card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 28 }}>
        {restaurant.photoUrls && (
          <div style={{ height: 280, backgroundImage: `url(${restaurant.photoUrls})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border)' }} />
        )}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
                {restaurant.name}
                {restaurant.isVerified && <span className="verified-badge" style={{ marginLeft: 8, fontSize: 14 }}>✓ Verified</span>}
              </h1>
              {restaurant.cuisineType && <p className="text-muted" style={{ fontSize: 13 }}>{restaurant.cuisineType}</p>}
            </div>
            {restaurant.boostTier !== 'STANDARD' && (
              <span className={`boost-label-${restaurant.boostTier.toLowerCase()}`}>
                {restaurant.boostTier === 'PREMIUM' ? '★ PREMIUM' : '◆ FEATURED'}
              </span>
            )}
          </div>

          {restaurant.description && <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{restaurant.description}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(restaurant.neighborhood || restaurant.address) && (
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>📍 {restaurant.neighborhood ?? restaurant.address}</span>
            )}
            {restaurant.phoneNumber && (
              <a href={`tel:${restaurant.phoneNumber}`} style={{ fontSize: 14 }}>📞 {restaurant.phoneNumber}</a>
            )}
            {restaurant.website && (
              <a href={restaurant.website} target="_blank" rel="noreferrer" style={{ fontSize: 14 }}>🌐 Website</a>
            )}
            {restaurant.googleMapsUrl && (
              <a href={restaurant.googleMapsUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginTop: 8 }}>
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Promotions */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Happy Hour Deals</h2>

      {isLoading ? (
        <div className="loading-inline"><div className="spinner" /></div>
      ) : !promotions?.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍺</div>
          <h3>No active deals</h3>
          <p>This venue has no active promotions at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {promotions.map(p => (
            <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{p.name}</span>
                <span style={{ background: DEAL_COLOURS[p.dealType] ?? '#6b7280', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5 }}>{p.dealType}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{formatTime(p.startTime)} – {formatTime(p.endTime)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{p.daysOfWeek.split(',').join(' · ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
