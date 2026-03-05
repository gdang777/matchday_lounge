import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

type PendingPromotion = {
    id: string;
    name: string;
    description: string;
    dealType: string;
    daysOfWeek: string;
    startTime: string;
    endTime: string;
    source: string;
    submittedByUserId: string | null;
    flagCount: number;
    createdAt: string;
    restaurant: {
        id: string;
        name: string;
        city: string;
        neighborhood: string | null;
    };
};

const DEAL_ICONS: Record<string, string> = {
    DRINKS: '🍺',
    FOOD: '🍔',
    BOTH: '🍽',
};

const SOURCE_COLORS: Record<string, string> = {
    SCRAPED: 'badge-warning',
    USER_SUBMITTED: 'badge-blue',
};

export default function PromotionsTab() {
    const queryClient = useQueryClient();

    const { data: promotions = [], isLoading, error } = useQuery<PendingPromotion[]>({
        queryKey: ['admin-pending-promotions'],
        queryFn: async () => {
            const res = await api.get<PendingPromotion[]>('/api/admin/promotions/pending');
            return res.data;
        },
    });

    const approve = useMutation({
        mutationFn: (id: string) => api.post(`/api/admin/promotions/${id}/approve`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending-promotions'] }),
    });

    if (isLoading) {
        return <div className="loading-inline"><div className="spinner" /></div>;
    }

    if (error) {
        return <div className="alert alert-error">Failed to load pending promotions.</div>;
    }

    return (
        <div className="dashboard-section">
            <div className="page-header">
                <div>
                    <h2>🎉 Promotion Approval Queue</h2>
                    <p>Review scraped and user-submitted deals before they go live.</p>
                </div>
                <span className="badge badge-warning">{promotions.length} pending</span>
            </div>

            {promotions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✅</div>
                    <p>No promotions awaiting approval.</p>
                </div>
            ) : (
                <div className="queue-list">
                    {promotions.map(p => (
                        <PromotionCard
                            key={p.id}
                            promotion={p}
                            onApprove={() => approve.mutate(p.id)}
                            isPending={approve.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PromotionCard({
    promotion: p,
    onApprove,
    isPending,
}: {
    promotion: PendingPromotion;
    onApprove: () => void;
    isPending: boolean;
}) {
    const submitted = new Date(p.createdAt).toLocaleDateString([], {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    // Format days string e.g. "MON,TUE,WED" → "Mon · Tue · Wed"
    const days = p.daysOfWeek
        .split(',')
        .map(d => d.charAt(0) + d.slice(1).toLowerCase())
        .join(' · ');

    return (
        <div className="queue-card">
            <div className="queue-card-header">
                <div>
                    <div className="queue-card-title">
                        {DEAL_ICONS[p.dealType] ?? '🏷'} {p.name}
                    </div>
                    <div className="badge-row" style={{ marginTop: 4 }}>
                        <span className={`badge ${SOURCE_COLORS[p.source] ?? 'badge-muted'}`}>
                            {p.source.replace('_', ' ')}
                        </span>
                        <span className="badge badge-muted">{p.dealType}</span>
                        {p.flagCount > 0 && (
                            <span className="badge badge-error">⚑ {p.flagCount} flags</span>
                        )}
                    </div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{submitted}</span>
            </div>

            <p className="queue-card-desc">{p.description}</p>

            <div className="queue-card-meta">
                <span>📍 {p.restaurant.name} · {p.restaurant.city}</span>
                {p.restaurant.neighborhood && <span>{p.restaurant.neighborhood}</span>}
                <span>🕐 {p.startTime}–{p.endTime}</span>
                <span>📅 {days}</span>
                {p.submittedByUserId && (
                    <span style={{ wordBreak: 'break-all' }}>👤 UID: {p.submittedByUserId}</span>
                )}
            </div>

            <div className="queue-card-actions" style={{ marginTop: 14 }}>
                <button
                    className="btn btn-success"
                    disabled={isPending}
                    onClick={onApprove}
                >
                    ✓ Approve &amp; Publish
                </button>
            </div>
        </div>
    );
}
