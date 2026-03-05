import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { type Restaurant } from '../../src/components/RestaurantCard';

type City = 'VANCOUVER' | 'TORONTO';

// Neighbourhood groups — expands as data comes in
function groupByNeighborhood(restaurants: Restaurant[]): Record<string, Restaurant[]> {
  return restaurants.reduce<Record<string, Restaurant[]>>((acc, r) => {
    const key = r.neighborhood ?? 'Other';
    (acc[key] ??= []).push(r);
    return acc;
  }, {});
}

export default function MapScreen() {
  const router             = useRouter();
  const [city, setCity]    = useState<City>('VANCOUVER');
  const [search, setSearch] = useState('');

  const { data: restaurants, isLoading, isError, refetch, isFetching } = useQuery<Restaurant[]>({
    queryKey: ['restaurants', city],
    queryFn:  () => api.get<Restaurant[]>('/api/restaurants', { params: { city } }).then(r => r.data),
  });

  const filtered = (restaurants ?? []).filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.neighborhood ?? '').toLowerCase().includes(q) ||
      (r.cuisineType ?? '').toLowerCase().includes(q)
    );
  });

  const groups = groupByNeighborhood(filtered);
  const sortedNeighborhoods = Object.keys(groups).sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));

  function handlePress(r: Restaurant) {
    router.push({ pathname: '/(tabs)/happy-hour/[id]', params: { id: r.id, restaurantJson: JSON.stringify(r) } });
    api.post(`/api/restaurants/${r.id}/view`, { viewType: 'MAP_PIN', city: r.city }).catch(() => {});
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🗺 City Nav</Text>

        {/* City toggle */}
        <View style={styles.cityRow}>
          {(['VANCOUVER', 'TORONTO'] as City[]).map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.cityBtn, city === c && styles.cityBtnActive]}
              onPress={() => setCity(c)}
            >
              <Text style={[styles.cityText, city === c && styles.cityTextActive]}>
                {c === 'VANCOUVER' ? '🏔 Vancouver' : '🏙 Toronto'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants or neighbourhoods..."
          placeholderTextColor="#4a4a6a"
        />

        {/* Stats bar */}
        {!isLoading && (
          <Text style={styles.stats}>
            {filtered.length} venue{filtered.length !== 1 ? 's' : ''} · {sortedNeighborhoods.filter(n => n !== 'Other').length} neighbourhood{sortedNeighborhoods.filter(n => n !== 'Other').length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#e94560" size="large" />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load. Pull to refresh.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} tintColor="#e94560" />}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏪</Text>
              <Text style={styles.emptyText}>No venues found.</Text>
            </View>
          ) : (
            sortedNeighborhoods.map(neighborhood => (
              <View key={neighborhood} style={styles.group}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName}>{neighborhood}</Text>
                  <Text style={styles.groupCount}>{groups[neighborhood].length}</Text>
                </View>
                {groups[neighborhood]
                  .sort((a, b) => {
                    const tierOrder: Record<string, number> = { PREMIUM: 0, FEATURED: 1, STANDARD: 2 };
                    return (tierOrder[a.boostTier] ?? 2) - (tierOrder[b.boostTier] ?? 2) || a.name.localeCompare(b.name);
                  })
                  .map(r => (
                    <TouchableOpacity key={r.id} style={styles.venueRow} onPress={() => handlePress(r)} activeOpacity={0.7}>
                      <View style={styles.venueLeft}>
                        <Text style={styles.venueName}>{r.name}</Text>
                        {r.cuisineType && <Text style={styles.venueCuisine}>{r.cuisineType}</Text>}
                      </View>
                      <View style={styles.venueRight}>
                        {r.boostTier !== 'STANDARD' && (
                          <Text style={[styles.boostDot, { color: r.boostTier === 'PREMIUM' ? '#f59e0b' : '#3b82f6' }]}>
                            {r.boostTier === 'PREMIUM' ? '★' : '◆'}
                          </Text>
                        )}
                        {r.isVerified && <Text style={styles.verifiedDot}>✓</Text>}
                        <Text style={styles.chevron}>›</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    paddingTop:        60,
    paddingHorizontal: 16,
    paddingBottom:     8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  title:  { fontSize: 22, fontWeight: '800', color: '#f0f0f5', marginBottom: 14 },
  cityRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  cityBtn: {
    flex:            1,
    paddingVertical: 10,
    borderRadius:    8,
    borderWidth:     1,
    borderColor:     '#2a2a4a',
    alignItems:      'center',
    backgroundColor: '#1a1a2e',
  },
  cityBtnActive:  { borderColor: '#e94560', backgroundColor: '#e9456015' },
  cityText:       { fontSize: 13, fontWeight: '600', color: '#a0a0b0' },
  cityTextActive: { color: '#e94560' },
  search: {
    backgroundColor:   '#1a1a2e',
    borderWidth:       1,
    borderColor:       '#2a2a4a',
    borderRadius:      10,
    paddingVertical:   10,
    paddingHorizontal: 14,
    color:             '#f0f0f5',
    fontSize:          14,
    marginBottom:      8,
  },
  stats:    { fontSize: 12, color: '#6b6b8a', marginBottom: 4 },
  list:     { flex: 1 },
  listContent: { padding: 16 },
  center:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#e94560', fontSize: 14 },
  empty:    { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#a0a0b0' },
  group: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2a4a',
    marginBottom: 4,
  },
  groupName:  { fontSize: 14, fontWeight: '700', color: '#e94560', textTransform: 'uppercase', letterSpacing: 0.5 },
  groupCount: { fontSize: 12, color: '#6b6b8a' },
  venueRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  venueLeft:    { flex: 1 },
  venueName:    { fontSize: 15, fontWeight: '600', color: '#f0f0f5' },
  venueCuisine: { fontSize: 12, color: '#a0a0b0', marginTop: 2 },
  venueRight:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  boostDot:     { fontSize: 14, fontWeight: '700' },
  verifiedDot:  { fontSize: 13, color: '#22c55e' },
  chevron:      { fontSize: 20, color: '#4a4a6a', marginLeft: 4 },
});
