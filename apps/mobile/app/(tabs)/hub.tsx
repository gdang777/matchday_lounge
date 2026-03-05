import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

type MatchStatus = 'scheduled' | 'live' | 'finished';

type MatchDoc = {
  id:          string;
  homeTeam:    string;
  awayTeam:    string;
  homeFlag:    string;
  awayFlag:    string;
  kickoffUtc:  string;
  venue:       string;
  city:        string;
  stage:       string;
  status:      MatchStatus;
  homeScore?:  number;
  awayScore?:  number;
};

type Filter = 'all' | 'live' | 'upcoming' | 'finished';

export default function HubScreen() {
  const [matches,  setMatches]  = useState<MatchDoc[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<Filter>('all');

  useEffect(() => {
    // Real-time Firestore listener on matches collection
    const q   = query(collection(db, 'matches'), orderBy('kickoffUtc', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as MatchDoc));
      setMatches(docs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = matches.filter(m => {
    if (filter === 'all')      return true;
    if (filter === 'live')     return m.status === 'live';
    if (filter === 'upcoming') return m.status === 'scheduled';
    if (filter === 'finished') return m.status === 'finished';
    return true;
  });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚽ Match Day Hub</Text>
        <Text style={styles.headerSub}>FIFA World Cup 2026</Text>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        {(['all', 'live', 'upcoming', 'finished'] as Filter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            {f === 'live' && <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>🔴 </Text>}
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#e94560" size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {filtered.map(match => <MatchCard key={match.id} match={match} />)}
        </ScrollView>
      )}
    </View>
  );
}

function MatchCard({ match }: { match: MatchDoc }) {
  const isLive     = match.status === 'live';
  const isFinished = match.status === 'finished';
  const kickoff    = new Date(match.kickoffUtc);
  const timeStr    = kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr    = kickoff.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <View style={[styles.card, isLive && styles.cardLive]}>
      {isLive && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>● LIVE</Text>
        </View>
      )}

      {/* Teams */}
      <View style={styles.teams}>
        <View style={styles.team}>
          <Text style={styles.flag}>{match.homeFlag}</Text>
          <Text style={styles.teamName} numberOfLines={1}>{match.homeTeam}</Text>
        </View>

        <View style={styles.scoreBlock}>
          {(isLive || isFinished) && match.homeScore !== undefined ? (
            <Text style={styles.score}>{match.homeScore} – {match.awayScore}</Text>
          ) : (
            <Text style={styles.vs}>VS</Text>
          )}
        </View>

        <View style={[styles.team, styles.teamRight]}>
          <Text style={styles.flag}>{match.awayFlag}</Text>
          <Text style={styles.teamName} numberOfLines={1}>{match.awayTeam}</Text>
        </View>
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <Text style={styles.metaText}>{dateStr} · {timeStr}</Text>
        <Text style={styles.metaText}>{match.venue} · {match.city}</Text>
        <Text style={styles.stage}>{match.stage}</Text>
      </View>
    </View>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  const messages: Record<Filter, string> = {
    all:      'No matches scheduled yet. Check back soon!',
    live:     'No matches are live right now.',
    upcoming: 'No upcoming matches.',
    finished: 'No finished matches yet.',
  };
  return (
    <View style={styles.center}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyText}>{messages[filter]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    paddingTop:    60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#f0f0f5' },
  headerSub:   { fontSize: 13, color: '#a0a0b0', marginTop: 2 },
  chipRow:     { maxHeight: 56, paddingTop: 12 },
  chipContent: { paddingHorizontal: 16, gap: 8, flexDirection: 'row' },
  chip: {
    flexDirection:     'row',
    paddingHorizontal: 14,
    paddingVertical:   7,
    borderRadius:      20,
    backgroundColor:   '#1a1a2e',
    borderWidth:       1,
    borderColor:       '#2a2a4a',
  },
  chipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText:   { fontSize: 13, fontWeight: '600', color: '#a0a0b0' },
  chipTextActive: { color: '#fff' },
  list:        { flex: 1 },
  listContent: { padding: 16 },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#16213e',
    borderRadius:    12,
    padding:         16,
    marginBottom:    12,
    borderWidth:     1,
    borderColor:     '#1e2a4a',
  },
  cardLive: { borderColor: '#e94560' },
  liveBadge: {
    backgroundColor: '#e94560',
    alignSelf:       'flex-start',
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:    6,
    marginBottom:    10,
  },
  liveBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  teams: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   12,
  },
  team: {
    flex:       1,
    alignItems: 'center',
  },
  teamRight: {},
  flag:     { fontSize: 36, marginBottom: 4 },
  teamName: { fontSize: 13, fontWeight: '700', color: '#f0f0f5', textAlign: 'center' },
  scoreBlock: { width: 72, alignItems: 'center' },
  score:  { fontSize: 26, fontWeight: '800', color: '#e94560' },
  vs:     { fontSize: 16, fontWeight: '700', color: '#4a4a6a' },
  meta: { borderTopWidth: 1, borderTopColor: '#1e2a4a', paddingTop: 10, gap: 3 },
  metaText: { fontSize: 12, color: '#a0a0b0', textAlign: 'center' },
  stage:    { fontSize: 11, color: '#e94560', fontWeight: '600', textAlign: 'center', marginTop: 2 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#a0a0b0', textAlign: 'center' },
});
