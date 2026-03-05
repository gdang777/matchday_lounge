// PromotionsTab — list, create, toggle, and manage promotions.

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import PromotionForm from './PromotionForm';

type Promotion = {
  id: string;
  name: string;
  description: string;
  dealType: string;
  daysOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isApproved: boolean;
  source: string;
  flagCount: number;
  createdAt: string;
};

type Props = { restaurantId: string };

const DEAL_LABELS: Record<string, string> = {
  DRINKS: 'Drinks', FOOD: 'Food', BOTH: 'Drinks & Food',
};

function formatDays(raw: string) {
  return raw.split(',').map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ');
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function PromotionsTab({ restaurantId }: Props) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: promotions = [], isLoading, error } = useQuery<Promotion[]>({
    queryKey: ['promotions', restaurantId],
    queryFn: async () => {
      const res = await api.get<Promotion[]>(`/api/restaurants/${restaurantId}/promotions`);
      return res.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/api/promotions/${id}/toggle`, { isActive });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotions', restaurantId] }),
  });

  if (isLoading) return <div className="loading-inline"><div className="spinner spinner-sm" /></div>;

  if (error) {
    return (
      <div className="dashboard-section">
        <div className="alert alert-error">Failed to load promotions.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="page-header">
        <h2>Promotions</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Promotion
          </button>
        )}
      </div>

      {showForm && (
        <PromotionForm
          restaurantId={restaurantId}
          onSuccess={() => {
            setShowForm(false);
            qc.invalidateQueries({ queryKey: ['promotions', restaurantId] });
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {promotions.length === 0 && !showForm && (
        <div className="empty-state">
          <p>No promotions yet. Add your first happy hour deal to attract World Cup fans.</p>
        </div>
      )}

      <div className="promo-list">
        {promotions.map(promo => (
          <div key={promo.id} className={`promo-card ${!promo.isActive ? 'promo-inactive' : ''}`}>
            <div className="promo-header">
              <div>
                <h3 className="promo-name">{promo.name}</h3>
                <div className="badge-row">
                  <span className="badge badge-deal">{DEAL_LABELS[promo.dealType] ?? promo.dealType}</span>
                  {!promo.isApproved && <span className="badge badge-warning">Pending Review</span>}
                  {promo.flagCount >= 3 && <span className="badge badge-error">Flagged ({promo.flagCount})</span>}
                </div>
              </div>
              <label className="toggle-switch" title={promo.isActive ? 'Pause promotion' : 'Resume promotion'}>
                <input
                  type="checkbox"
                  checked={promo.isActive}
                  onChange={() => toggleMutation.mutate({ id: promo.id, isActive: !promo.isActive })}
                  disabled={toggleMutation.isPending}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <p className="promo-description">{promo.description}</p>

            <div className="promo-meta">
              <span>📅 {formatDays(promo.daysOfWeek)}</span>
              <span>🕐 {formatTime(promo.startTime)} – {formatTime(promo.endTime)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
