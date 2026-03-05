export default function AnalyticsTab() {
    return (
        <div className="dashboard-section">
            <div className="page-header">
                <div>
                    <h2>📊 Platform Analytics</h2>
                    <p>Aggregated view counts and platform-level stats.</p>
                </div>
            </div>

            <div className="empty-state" style={{ borderStyle: 'solid' }}>
                <div className="empty-icon">📊</div>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                    Platform Analytics — Coming Soon
                </p>
                <p style={{ fontSize: 14 }}>
                    This section will show total views by city, boost tier distribution,
                    Pro subscriber count, and promotion approval rates.
                    It will be wired in Phase 4 of the development roadmap.
                </p>
            </div>
        </div>
    );
}
