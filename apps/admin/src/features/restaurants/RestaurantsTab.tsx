import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

type PendingRestaurant = {
    id: string;
    name: string;
    description: string | null;
    city: string;
    neighborhood: string | null;
    address: string | null;
    cuisineType: string | null;
    phoneNumber: string | null;
    website: string | null;
    ownerUserId: string;
    createdAt: string;
};

export default function RestaurantsTab() {
    const queryClient = useQueryClient();

    const { data: restaurants = [], isLoading, error } = useQuery<PendingRestaurant[]>({
        queryKey: ['admin-pending-restaurants'],
        queryFn: async () => {
            const res = await api.get<PendingRestaurant[]>('/api/admin/restaurants/pending');
            return res.data;
        },
    });

    const approve = useMutation({
        mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
            api.post(`/api/admin/restaurants/${id}/approve`, { isVerified }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending-restaurants'] }),
    });

    const suspend = useMutation({
        mutationFn: (id: string) =>
            api.post(`/api/admin/restaurants/${id}/suspend`, { isSuspended: true }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending-restaurants'] }),
    });

    if (isLoading) {
        return <div className="loading-inline"><div className="spinner" /></div>;
    }

    if (error) {
        return <div className="alert alert-error">Failed to load pending restaurants.</div>;
    }

    return (
        <div className="dashboard-section">
            <div className="page-header">
                <div>
                    <h2>🏪 Restaurant Approval Queue</h2>
                    <p>Review and approve new restaurant submissions before they go live.</p>
                </div>
                <span className="badge badge-warning">{restaurants.length} pending</span>
            </div>

            {restaurants.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✅</div>
                    <p>All caught up — no pending restaurant submissions.</p>
                </div>
            ) : (
                <div className="queue-list">
                    {restaurants.map(r => (
                        <RestaurantCard
                            key={r.id}
                            restaurant={r}
                            onApprove={(isVerified) => approve.mutate({ id: r.id, isVerified })}
                            onSuspend={() => suspend.mutate(r.id)}
                            isPending={approve.isPending || suspend.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function RestaurantCard({
    restaurant: r,
    onApprove,
    onSuspend,
    isPending,
}: {
    restaurant: PendingRestaurant;
    onApprove: (isVerified: boolean) => void;
    onSuspend: () => void;
    isPending: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const submitted = new Date(r.createdAt).toLocaleDateString([], {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <div className="queue-card">
            <div className="queue-card-header">
                <div>
                    <div className="queue-card-title">{r.name}</div>
                    <div className="badge-row" style={{ marginTop: 4 }}>
                        <span className="badge badge-muted">{r.city}</span>
                        {r.cuisineType && <span className="badge badge-blue">{r.cuisineType}</span>}
                    </div>
                </div>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setExpanded(v => !v)}
                >
                    {expanded ? '▲ Less' : '▼ More'}
                </button>
            </div>

            <div className="queue-card-meta">
                {r.neighborhood && <span>📍 {r.neighborhood}</span>}
                {r.address && <span>🗺 {r.address}</span>}
                <span>📅 Submitted {submitted}</span>
                <span style={{ wordBreak: 'break-all' }}>👤 UID: {r.ownerUserId}</span>
            </div>

            {expanded && (
                <>
                    {r.description && <p className="queue-card-desc">{r.description}</p>}
                    <div className="queue-card-meta" style={{ marginBottom: 14 }}>
                        {r.phoneNumber && <span>📞 {r.phoneNumber}</span>}
                        {r.website && (
                            <span>
                                🌐 <a href={r.website} target="_blank" rel="noreferrer">{r.website}</a>
                            </span>
                        )}
                    </div>
                </>
            )}

            <div className="queue-card-actions">
                <button
                    className="btn btn-success"
                    disabled={isPending}
                    onClick={() => onApprove(false)}
                >
                    ✓ Approve
                </button>
                <button
                    className="btn btn-success"
                    disabled={isPending}
                    onClick={() => onApprove(true)}
                    title="Approve and mark as ownership-verified"
                >
                    ✓✓ Approve + Verify
                </button>
                <button
                    className="btn btn-danger"
                    disabled={isPending}
                    onClick={onSuspend}
                >
                    🚫 Reject / Suspend
                </button>
            </div>
        </div>
    );
}
