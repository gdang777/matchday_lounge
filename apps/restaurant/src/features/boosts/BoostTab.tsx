import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import type { Restaurant } from '../../pages/DashboardPage';

type Props = { restaurant: Restaurant };

type Tier = {
    id: 'STANDARD' | 'FEATURED' | 'PREMIUM';
    label: string;
    price: string;
    color: string;
    features: string[];
    boostTier: 'FEATURED' | 'PREMIUM';
};

const TIERS: Tier[] = [
    {
        id: 'FEATURED',
        label: 'Featured',
        price: '$79 / month',
        color: 'var(--warning)',
        boostTier: 'FEATURED',
        features: [
            'Elevated placement in city listing',
            '⭐ Featured badge on your card',
            'Appears above Standard listings',
            'Included in "Featured Picks" section',
        ],
    },
    {
        id: 'PREMIUM',
        label: 'Premium',
        price: '$149 / month',
        color: 'var(--accent)',
        boostTier: 'PREMIUM',
        features: [
            'Top placement in city listing',
            '🔥 Premium badge on your card',
            'Pinned above all other listings',
            'Featured on Match Day Hub screen',
            'AI Concierge recommends your venue first',
        ],
    },
];

export default function BoostTab({ restaurant }: Props) {
    const currentTier = restaurant.boostTier as 'STANDARD' | 'FEATURED' | 'PREMIUM';
    const [error, setError] = useState('');

    const checkout = useMutation({
        mutationFn: async (boostTier: 'FEATURED' | 'PREMIUM') => {
            const res = await api.post<{ url: string }>('/api/stripe/checkout/boost', {
                restaurantId: restaurant.id,
                boostTier,
            });
            return res.data.url;
        },
        onSuccess: (url) => {
            window.open(url, '_blank', 'noopener,noreferrer');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { error?: string } } })
                ?.response?.data?.error ?? 'Failed to start checkout. Please try again.';
            setError(msg);
        },
    });

    const boostExpiry = restaurant.boostExpiresAt
        ? new Date(restaurant.boostExpiresAt).toLocaleDateString([], {
            month: 'long', day: 'numeric', year: 'numeric',
        })
        : null;

    return (
        <div className="dashboard-section">
            <div className="page-header">
                <div>
                    <h2>🚀 Boost Your Listing</h2>
                    <p>Stand out during the FIFA World Cup 2026 and attract more fans.</p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    {error}
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginLeft: 8 }}
                        onClick={() => setError('')}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Current status */}
            <div className="form-card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                            Current Tier
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                                className={`badge badge-boost-${currentTier.toLowerCase()}`}
                                style={{ fontSize: 14, padding: '4px 12px' }}
                            >
                                {currentTier}
                            </span>
                            {currentTier === 'STANDARD' && (
                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Free listing</span>
                            )}
                        </div>
                    </div>
                    {boostExpiry && currentTier !== 'STANDARD' && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active until</div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{boostExpiry}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tier cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {TIERS.map(tier => {
                    const isCurrentTier = currentTier === tier.id;
                    return (
                        <div
                            key={tier.id}
                            className="form-card"
                            style={{
                                borderColor: isCurrentTier ? tier.color : 'var(--border)',
                                position: 'relative',
                            }}
                        >
                            {isCurrentTier && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -1,
                                        right: 16,
                                        background: tier.color,
                                        color: '#fff',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: '0 0 4px 4px',
                                        letterSpacing: '.04em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Current Plan
                                </div>
                            )}

                            <div style={{ marginBottom: 6 }}>
                                <span style={{ fontSize: 18, fontWeight: 700, color: tier.color }}>
                                    {tier.label}
                                </span>
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{tier.price}</div>

                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                                {tier.features.map(f => (
                                    <li key={f} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                                        <span style={{ color: tier.color }}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="btn btn-primary btn-full"
                                disabled={isCurrentTier || checkout.isPending}
                                onClick={() => {
                                    setError('');
                                    checkout.mutate(tier.boostTier);
                                }}
                                style={isCurrentTier ? { opacity: 0.5, cursor: 'default' } : {}}
                            >
                                {checkout.isPending && checkout.variables === tier.boostTier
                                    ? <span className="spinner spinner-sm" />
                                    : isCurrentTier
                                        ? 'Current Plan'
                                        : `Upgrade to ${tier.label} →`}
                            </button>
                        </div>
                    );
                })}
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
                Boost tiers are billed monthly via Stripe. Cancelling reverts your listing to Standard.
                Contact <a href="mailto:support@matchdaylounge.com">support@matchdaylounge.com</a> with any questions.
            </p>
        </div>
    );
}
