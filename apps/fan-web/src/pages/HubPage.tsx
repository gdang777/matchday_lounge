import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

type MatchStatus = 'scheduled' | 'live' | 'finished';
type Filter      = 'all' | 'live' | 'upcoming' | 'finished';

type MatchDoc = {
  id:         string;
  homeTeam:   string;
  awayTeam:   string;
  homeFlag:   string;
  awayFlag:   string;
  kickoffUtc: string;
  venue:      string;
  city:       string;
  stage:      string;
  status:     MatchStatus;
  homeScore?: number;
  awayScore?: number;
};

export default function HubPage() {
  const [matches, setMatches] = useState<MatchDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<Filter>('all');

  useEffect(() => {
    const q     = query(collection(db, 'matches'), orderBy('kickoffUtc', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchDoc)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const filtered = matches.filter(m => {
    if (filter === 'all')      return true;
    if (filter === 'live')     return m.status === 'live';
    if (filter === 'upcoming') return m.status === 'scheduled';
    return m.status === 'finished';
  });

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all',      label: 'All' },
    { id: 'live',     label: '🔴 Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'finished', label: 'Finished' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚽ Match Day Hub</h1>
          <p className="page-subtitle">FIFA World Cup 2026 — live scores and schedules</p>
        </div>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button key={f.id} className={`filter-chip${filter === f.id ? ' active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-inline"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No matches found</h3>
          <p>Check back as the tournament progresses.</p>
        </div>
      ) : (
        <div className="matches-list">
          {filtered.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match: m }: { match: MatchDoc }) {
  const isLive     = m.status === 'live';
  const isFinished = m.status === 'finished';
  const kickoff    = new Date(m.kickoffUtc);
  const timeStr    = kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr    = kickoff.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`match-card${isLive ? ' live' : ''}`}>
      {isLive && <span className="live-badge">● LIVE</span>}

      <div className="match-teams">
        <div className="match-team" style={{ textAlign: 'right' }}>
          <span className="team-flag">{m.homeFlag}</span>
          <div className="team-name">{m.homeTeam}</div>
        </div>

        <div className="match-score-block">
          {(isLive || isFinished) && m.homeScore !== undefined
            ? <div className="match-score">{m.homeScore}–{m.awayScore}</div>
            : <div className="match-vs">VS</div>
          }
        </div>

        <div className="match-team">
          <span className="team-flag">{m.awayFlag}</span>
          <div className="team-name">{m.awayTeam}</div>
        </div>
      </div>

      <div className="match-meta">
        <span>{dateStr} · {timeStr}</span>
        <span>{m.venue} · {m.city}</span>
        <span className="match-stage">{m.stage}</span>
      </div>
    </div>
  );
}
