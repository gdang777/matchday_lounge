import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Switch, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import DealCard, { type Deal } from '../../../src/components/DealCard';
import RestaurantCard, { type Restaurant } from '../../../src/components/RestaurantCard';
import { useAuth } from '../../../src/contexts/AuthContext';

type City   = 'VANCOUVER' | 'TORONTO';
type Mode   = 'open-now' | 'all';
type DealFilter = 'ALL' | 'DRINKS' | 'FOOD' | 'BOTH';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function nowParams() {
  const d = new Date();
  return {
    day:  DAYS[d.getDay()],
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  };
}

export default function HappyHourScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [city,        setCity]        = useState<City>('VANCOUVER');
  const [mode,        setMode]        = useState<Mode>('open-now');
  const [dealFilter,  setDealFilter]  = useState<DealFilter>('ALL');

  // Open Now query
  const { day, time } = nowParams();
  const openNowQuery = useQuery<Deal[]>({
    queryKey: ['happy-hours-now', city, day, time.slice(0, 2)], // re-query each hour
    queryFn:  () => api.get<Deal[]>('/api/restaurants/happy-hours/now', {
      params: { city, day, time },
    }).then(r => r.data),
    enabled: mode === 'open-now',
  });

  // All restaurants query
  const allQuery = useQuery<Restaurant[]>({
    queryKey: ['restaurants', city],
    queryFn:  () => api.get<Restaurant[]>('/api/restaurants', { params: { city } }).then(r => r.data),
    enabled:  mode === 'all',
  });

  const isLoading = mode === 'open-now' ? openNowQuery.isLoading : allQuery.isLoading;
  const isError   = mode === 'open-now' ? openNowQuery.isError   : allQuery.isError;

  const deals = (openNowQuery.data ?? []).filter(
    d => dealFilter === 'ALL' || d.dealType === dealFilter
  );
  const restaurants = allQuery.data ?? [];

  function handleDealPress(deal: Deal) {
    router.push({ pathname: '/(tabs)/happy-hour/[id]', params: { id: deal.restaurant.id, restaurantJson: JSON.stringify(deal.restaurant) } });
    // Fire-and-forget analytics
    api.post(`/api/restaurants/${deal.restaurant.id}/view`, { viewType: 'LISTING', city: deal.restaurant.city }).catch(() => {});
  }

  function handleRestaurantPress(r: Restaurant) {
    router.push({ pathname: '/(tabs)/happy-hour/[id]', params: { id: r.id, restaurantJson: JSON.stringify(r) } });
    api.post(`/api/restaurants/${r.id}/view`, { viewType: 'LISTING', city: r.city }).catch(() => {});
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🍺 Happy Hour Finder</Text>

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

        {/* Open Now toggle */}
        <View style={styles.openNowRow}>
          <View>
            <Text style={styles.openNowLabel}>Open Now</Text>
            <Text style={styles.openNowSub}>{day} · {time}</Text>
          </View>
          <Switch
            value={mode === 'open-now'}
            onValueChange={v => setMode(v ? 'open-now' : 'all')}
            trackColor={{ false: '#2a2a4a', true: '#e9456060' }}
            thumbColor={mode === 'open-now' ? '#e94560' : '#6b6b8a'}
          />
        </View>

        {/* Deal type filter (only in Open Now mode) */}
        {mode === 'open-now' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
            {(['ALL', 'DRINKS', 'FOOD', 'BOTH'] as DealFilter[]).map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, dealFilter === f && styles.filterChipActive]}
                onPress={() => setDealFilter(f)}
              >
                <Text style={[styles.filterText, dealFilter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
      ) : mode === 'open-now' ? (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={openNowQuery.isFetching} onRefresh={() => openNowQuery.refetch()} tintColor="#e94560" />}
        >
          {deals.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍺</Text>
              <Text style={styles.emptyTitle}>No deals open right now</Text>
              <Text style={styles.emptyBody}>Check back later or switch to "All Restaurants".</Text>
            </View>
          ) : (
            deals.map(deal => <DealCard key={deal.id} deal={deal} onPress={() => handleDealPress(deal)} />)
          )}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={allQuery.isFetching} onRefresh={() => allQuery.refetch()} tintColor="#e94560" />}
        >
          {restaurants.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏪</Text>
              <Text style={styles.emptyTitle}>No restaurants yet</Text>
              <Text style={styles.emptyBody}>Partner venues will appear here soon.</Text>
            </View>
          ) : (
            restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onPress={() => handleRestaurantPress(r)} />)
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    paddingTop:        60,
    paddingHorizontal: 16,
    paddingBottom:     0,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#f0f0f5', marginBottom: 14 },
  cityRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  cityBtn: {
    flex:              1,
    paddingVertical:   10,
    borderRadius:      8,
    borderWidth:       1,
    borderColor:       '#2a2a4a',
    alignItems:        'center',
    backgroundColor:   '#1a1a2e',
  },
  cityBtnActive:  { borderColor: '#e94560', backgroundColor: '#e9456015' },
  cityText:       { fontSize: 13, fontWeight: '600', color: '#a0a0b0' },
  cityTextActive: { color: '#e94560' },
  openNowRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 12,
  },
  openNowLabel: { fontSize: 15, fontWeight: '700', color: '#f0f0f5' },
  openNowSub:   { fontSize: 12, color: '#a0a0b0', marginTop: 2 },
  filterRow:    { marginBottom: 12 },
  filterContent: { gap: 8, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:      16,
    backgroundColor:   '#1a1a2e',
    borderWidth:       1,
    borderColor:       '#2a2a4a',
  },
  filterChipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  filterText:       { fontSize: 12, fontWeight: '600', color: '#a0a0b0' },
  filterTextActive: { color: '#fff' },
  list:        { flex: 1 },
  listContent: { padding: 16 },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText:   { fontSize: 14, color: '#e94560' },
  empty:       { alignItems: 'center', paddingTop: 60 },
  emptyIcon:   { fontSize: 48, marginBottom: 12 },
  emptyTitle:  { fontSize: 17, fontWeight: '700', color: '#f0f0f5', marginBottom: 8 },
  emptyBody:   { fontSize: 14, color: '#a0a0b0', textAlign: 'center' },
});
