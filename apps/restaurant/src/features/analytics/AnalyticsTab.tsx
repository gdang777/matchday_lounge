// AnalyticsTab — impressions summary for the restaurant dashboard.

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

type AnalyticsResponse = {
  total: number;
  byType: Record<string, number>;
  byDate: Record<string, number>;
  start: string;
  end: string;
};

type Props = { restaurantId: string };

export default function AnalyticsTab({ restaurantId }: Props) {
  const { data, isLoading, error } = useQuery<AnalyticsResponse>({
    queryKey: ['analytics', restaurantId],
    queryFn: async () => {
      const res = await api.get<AnalyticsResponse>(
        `/api/restaurants/${restaurantId}/analytics`,
      );
      return res.data;
    },
  });

  if (isLoading) return <div className="loading-inline"><div className="spinner spinner-sm" /></div>;

  if (error) {
    return (
      <div className="dashboard-section">
        <div className="alert alert-error">Failed to load analytics.</div>
      </div>
    );
  }

  const byType = data?.byType ?? {};
  const byDate = data?.byDate ?? {};

  // Sort dates ascending for the timeline
  const sortedDates = Object.keys(byDate).sort();

  const periodStart = data?.start ? new Date(data.start).toLocaleDateString() : '—';
  const periodEnd   = data?.end   ? new Date(data.end).toLocaleDateString()   : '—';

  return (
    <div className="dashboard-section">
      <div className="page-header">
        <h2>Analytics</h2>
        <span className="text-muted period-label">{periodStart} – {periodEnd}</span>
      </div>

      {/* Summary cards */}
      <div className="stat-grid">
        <StatCard label="Total Impressions" value={data?.total ?? 0} icon="👁" />
        <StatCard label="Listing Views"     value={byType['LISTING']  ?? 0} icon="📋" />
        <StatCard label="Profile Opens"     value={byType['PROFILE']  ?? 0} icon="🏪" />
        <StatCard label="Map Pin Taps"      value={byType['MAP_PIN']  ?? 0} icon="📍" />
      </div>

      {/* Daily timeline */}
      {sortedDates.length > 0 && (
        <div className="analytics-chart-section">
          <h3>Daily Impressions (last 30 days)</h3>
          <div className="bar-chart">
            {sortedDates.map(date => {
              const count = byDate[date] ?? 0;
              const max   = Math.max(...Object.values(byDate), 1);
              const pct   = Math.round((count / max) * 100);
              return (
                <div key={date} className="bar-col" title={`${date}: ${count} views`}>
                  <div className="bar-fill" style={{ height: `${pct}%` }} />
                  <span className="bar-label">{date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data?.total === 0 && (
        <div className="empty-state">
          <p>No impressions recorded yet. Once your listing is live, views will appear here.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value.toLocaleString()}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
