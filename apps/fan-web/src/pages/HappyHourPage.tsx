import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { MOCK_DEALS, MOCK_RESTAURANTS, type MockDeal, type MockRestaurant } from '../lib/mockData';

type City = 'VANCOUVER' | 'TORONTO';
type DealFilter = 'ALL' | 'DRINKS' | 'FOOD' | 'BOTH';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function nowParams() {
  const d = new Date();
  return {
    day: DAYS[d.getDay()],
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  };
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

type Deal = MockDeal;
type Restaurant = MockRestaurant;

export default function HappyHourPage() {
  const navigate = useNavigate();
  const [city, setCity] = useState<City>('VANCOUVER');
  const [openNow, setOpenNow] = useState(true);
  const [dealFilter, setDealFilter] = useState<DealFilter>('ALL');
  const { day, time } = nowParams();

  const openNowQuery = useQuery<Deal[]>({
    queryKey: ['happy-hours-now', city, day, time.slice(0, 2)],
    queryFn: async () => MOCK_DEALS.filter(d => d.restaurant.city === city),
    enabled: openNow,
  });

  const allQuery = useQuery<Restaurant[]>({
    queryKey: ['restaurants', city],
    queryFn: async () => MOCK_RESTAURANTS.filter(r => r.city === city),
    enabled: !openNow,
  });

  const isLoading = openNow ? openNowQuery.isLoading : allQuery.isLoading;
  const deals = (openNowQuery.data ?? []).filter(d => dealFilter === 'ALL' || d.dealType === dealFilter);

  function goToRestaurant(id: string, data: unknown) {
    api.post(`/api/restaurants/${id}/view`, { viewType: 'LISTING', city }).catch(() => { });
    navigate(`/happy-hour/${id}`, { state: { restaurant: data } });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🍺 Happy Hour Finder</h1>
          <p className="page-subtitle">Find the best deals near you</p>
        </div>
      </div>

      {/* Controls */}
      <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
        {/* City */}
        <div className="city-toggle">
          <button className={`city-btn${city === 'VANCOUVER' ? ' active' : ''}`} onClick={() => setCity('VANCOUVER')}>🏔 Vancouver</button>
          <button className={`city-btn${city === 'TORONTO' ? ' active' : ''}`} onClick={() => setCity('TORONTO')}>🏙 Toronto</button>
        </div>

        {/* Open Now */}
        <div className="open-now-toggle">
          <span>Open Now</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={openNow} onChange={e => setOpenNow(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Deal type filter */}
      {openNow && (
        <div className="filter-bar">
          {(['ALL', 'DRINKS', 'FOOD', 'BOTH'] as DealFilter[]).map(f => (
            <button key={f} className={`filter-chip${dealFilter === f ? ' active' : ''}`} onClick={() => setDealFilter(f)}>{f}</button>
          ))}
          <span className="text-muted" style={{ fontSize: 12, marginLeft: 'auto' }}>
            {day} · {time}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="loading-inline"><div className="spinner" /></div>
      ) : openNow ? (
        deals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍺</div>
            <h3>No deals open right now</h3>
            <p>Check back later or switch to "All Restaurants".</p>
          </div>
        ) : (
          <div className="deals-grid">
            {deals.map(deal => (
              <div
                key={deal.id}
                className={`deal-card${deal.restaurant.boostTier === 'PREMIUM' ? ' premium' : deal.restaurant.boostTier === 'FEATURED' ? ' featured' : ''}`}
                onClick={() => goToRestaurant(deal.restaurant.id, deal.restaurant)}
              >
                <div className="deal-card-image" style={{ backgroundImage: `url(${deal.restaurant.photoUrls})` }} />
                <div className="deal-card-content">
                  <div className="deal-card-header">
                    <div>
                      <div className="deal-restaurant">
                        {deal.restaurant.name}
                        {deal.restaurant.isVerified && <span className="verified-badge"> ✓</span>}
                      </div>
                      <div className="deal-location">{deal.restaurant.neighborhood ?? deal.restaurant.address}</div>
                    </div>
                    <span className={`deal-badge badge-${deal.dealType.toLowerCase()}`}>{deal.dealType}</span>
                  </div>
                  <div className="deal-name">{deal.name}</div>
                  <div className="deal-desc">{deal.description}</div>
                  <div className="deal-time">{formatTime(deal.startTime)} – {formatTime(deal.endTime)}</div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        allQuery.data?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏪</div>
            <h3>No venues yet</h3>
            <p>Partner venues will appear here soon.</p>
          </div>
        ) : (
          <div className="deals-grid">
            {(allQuery.data ?? []).map(r => (
              <div key={r.id} className="restaurant-card" onClick={() => goToRestaurant(r.id, r)}>
                <div className="restaurant-card-image" style={{ backgroundImage: `url(${r.photoUrls})` }} />
                <div className="restaurant-card-content">
                  <div className="restaurant-info">
                    <div className="restaurant-name">
                      {r.name}
                      {r.isVerified && <span className="verified-badge">✓</span>}
                    </div>
                    {r.cuisineType && <div className="restaurant-cuisine">{r.cuisineType}</div>}
                    {(r.neighborhood || r.address) && (
                      <div className="restaurant-location">📍 {r.neighborhood ?? r.address}</div>
                    )}
                    {r.description && <div className="restaurant-desc">{r.description}</div>}
                  </div>
                  {r.boostTier !== 'STANDARD' && (
                    <span className={`boost-label-${r.boostTier.toLowerCase()}`}>
                      {r.boostTier === 'PREMIUM' ? '★ PREMIUM' : '◆ FEATURED'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
