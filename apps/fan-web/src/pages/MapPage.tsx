import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

type City = 'VANCOUVER' | 'TORONTO';

type Restaurant = {
  id: string; name: string; description: string | null; city: string;
  neighborhood: string | null; address: string | null; cuisineType: string | null;
  phoneNumber: string | null; website: string | null; googleMapsUrl: string | null;
  photoUrls: string | null; boostTier: string; isVerified: boolean;
};

function groupByNeighborhood(restaurants: Restaurant[]): Record<string, Restaurant[]> {
  return restaurants.reduce<Record<string, Restaurant[]>>((acc, r) => {
    const key = r.neighborhood ?? 'Other';
    (acc[key] ??= []).push(r);
    return acc;
  }, {});
}

export default function MapPage() {
  const navigate          = useNavigate();
  const [city, setCity]   = useState<City>('VANCOUVER');
  const [search, setSearch] = useState('');

  const { data: restaurants, isLoading, isError } = useQuery<Restaurant[]>({
    queryKey: ['restaurants', city],
    queryFn:  () => api.get<Restaurant[]>('/api/restaurants', { params: { city } }).then(r => r.data),
  });

  const filtered = (restaurants ?? []).filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || (r.neighborhood ?? '').toLowerCase().includes(q) || (r.cuisineType ?? '').toLowerCase().includes(q);
  });

  const groups  = groupByNeighborhood(filtered);
  const sorted  = Object.keys(groups).sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));

  function handleClick(r: Restaurant) {
    api.post(`/api/restaurants/${r.id}/view`, { viewType: 'MAP_PIN', city: r.city }).catch(() => {});
    navigate(`/happy-hour/${r.id}`, { state: { restaurant: r } });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🗺 City Nav</h1>
          <p className="page-subtitle">Browse venues by neighbourhood</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="city-toggle">
          <button className={`city-btn${city === 'VANCOUVER' ? ' active' : ''}`} onClick={() => setCity('VANCOUVER')}>🏔 Vancouver</button>
          <button className={`city-btn${city === 'TORONTO' ? ' active' : ''}`}   onClick={() => setCity('TORONTO')}>🏙 Toronto</button>
        </div>
        <input
          type="text" className="search-input" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search venues or neighbourhoods…"
          style={{ flex: 1, minWidth: 180 }}
        />
      </div>

      {!isLoading && (
        <p className="stats-bar">
          {filtered.length} venue{filtered.length !== 1 ? 's' : ''} · {sorted.filter(n => n !== 'Other').length} neighbourhood{sorted.filter(n => n !== 'Other').length !== 1 ? 's' : ''}
        </p>
      )}

      {isLoading ? (
        <div className="loading-inline"><div className="spinner" /></div>
      ) : isError ? (
        <div className="alert alert-error">Failed to load venues.</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <h3>No venues found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        sorted.map(neighborhood => (
          <div key={neighborhood} className="neighborhood-group">
            <div className="neighborhood-header">
              <span className="neighborhood-name">{neighborhood}</span>
              <span className="neighborhood-count">{groups[neighborhood].length}</span>
            </div>
            {groups[neighborhood]
              .sort((a, b) => {
                const order: Record<string, number> = { PREMIUM: 0, FEATURED: 1, STANDARD: 2 };
                return (order[a.boostTier] ?? 2) - (order[b.boostTier] ?? 2) || a.name.localeCompare(b.name);
              })
              .map(r => (
                <div key={r.id} className="venue-row" onClick={() => handleClick(r)}>
                  <div>
                    <div className="venue-name">{r.name}</div>
                    {r.cuisineType && <div className="venue-cuisine">{r.cuisineType}</div>}
                  </div>
                  <div className="venue-badges">
                    {r.boostTier === 'PREMIUM'  && <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>★</span>}
                    {r.boostTier === 'FEATURED' && <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: 13 }}>◆</span>}
                    {r.isVerified              && <span style={{ color: '#22c55e', fontSize: 13 }}>✓</span>}
                    <span className="chevron">›</span>
                  </div>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
}
