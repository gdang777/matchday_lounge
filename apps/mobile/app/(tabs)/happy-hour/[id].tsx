import { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';

type Promotion = {
  id:          string;
  name:        string;
  description: string;
  dealType:    string;
  daysOfWeek:  string;
  startTime:   string;
  endTime:     string;
  source:      string;
};

type RestaurantParam = {
  id:           string;
  name:         string;
  address:      string | null;
  neighborhood: string | null;
  city:         string;
  boostTier:    string;
  photoUrls:    string | null;
  googleMapsUrl: string | null;
  isVerified:   boolean;
  description?: string | null;
  cuisineType?: string | null;
  phoneNumber?: string | null;
  website?:     string | null;
};

const DEAL_COLOURS: Record<string, string> = {
  DRINKS: '#3b82f6',
  FOOD:   '#22c55e',
  BOTH:   '#a855f7',
};

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id, restaurantJson } = useLocalSearchParams<{ id: string; restaurantJson: string }>();

  const restaurant: RestaurantParam | null = restaurantJson
    ? JSON.parse(restaurantJson)
    : null;

  // Record profile view (fire-and-forget)
  useEffect(() => {
    if (id && restaurant?.city) {
      api.post(`/api/restaurants/${id}/view`, { viewType: 'PROFILE', city: restaurant.city }).catch(() => {});
    }
  }, [id]);

  const { data: promotions, isLoading } = useQuery<Promotion[]>({
    queryKey: ['promotions-active', id],
    queryFn:  () => api.get<Promotion[]>(`/api/restaurants/${id}/promotions/active`).then(r => r.data),
    enabled:  !!id,
  });

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Restaurant header */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{restaurant.name}</Text>
              {restaurant.isVerified && <Text style={styles.verified}>✓ Verified Venue</Text>}
              {restaurant.cuisineType && <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>}
            </View>
            {(restaurant.boostTier === 'PREMIUM' || restaurant.boostTier === 'FEATURED') && (
              <View style={[styles.boostBadge, { borderColor: restaurant.boostTier === 'PREMIUM' ? '#f59e0b' : '#3b82f6' }]}>
                <Text style={[styles.boostText, { color: restaurant.boostTier === 'PREMIUM' ? '#f59e0b' : '#3b82f6' }]}>
                  {restaurant.boostTier === 'PREMIUM' ? '★ PREMIUM' : '◆ FEATURED'}
                </Text>
              </View>
            )}
          </View>

          {restaurant.description && (
            <Text style={styles.description}>{restaurant.description}</Text>
          )}

          {/* Location & links */}
          <View style={styles.metaList}>
            {(restaurant.neighborhood || restaurant.address) && (
              <Text style={styles.metaItem}>
                📍 {restaurant.neighborhood ?? restaurant.address}
              </Text>
            )}
            {restaurant.address && restaurant.neighborhood && (
              <Text style={styles.metaItem}>🗺 {restaurant.address}</Text>
            )}
            {restaurant.phoneNumber && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${restaurant.phoneNumber}`)}>
                <Text style={[styles.metaItem, styles.metaLink]}>📞 {restaurant.phoneNumber}</Text>
              </TouchableOpacity>
            )}
            {restaurant.website && (
              <TouchableOpacity onPress={() => Linking.openURL(restaurant.website!)}>
                <Text style={[styles.metaItem, styles.metaLink]}>🌐 Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {restaurant.googleMapsUrl && (
            <TouchableOpacity
              style={styles.mapsBtn}
              onPress={() => Linking.openURL(restaurant.googleMapsUrl!)}
              activeOpacity={0.8}
            >
              <Text style={styles.mapsBtnText}>Open in Google Maps</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Promotions */}
        <Text style={styles.sectionTitle}>Happy Hour Deals</Text>

        {isLoading ? (
          <ActivityIndicator color="#e94560" style={{ marginTop: 20 }} />
        ) : !promotions?.length ? (
          <View style={styles.emptyDeals}>
            <Text style={styles.emptyDealsText}>No active deals at this venue.</Text>
          </View>
        ) : (
          promotions.map(p => (
            <View key={p.id} style={styles.promoCard}>
              <View style={styles.promoHeader}>
                <Text style={styles.promoName}>{p.name}</Text>
                <View style={[styles.dealBadge, { backgroundColor: DEAL_COLOURS[p.dealType] ?? '#6b7280' }]}>
                  <Text style={styles.dealBadgeText}>{p.dealType}</Text>
                </View>
              </View>
              <Text style={styles.promoDesc}>{p.description}</Text>
              <Text style={styles.promoTime}>
                {formatTime(p.startTime)} – {formatTime(p.endTime)}
              </Text>
              <Text style={styles.promoDays}>{p.daysOfWeek.split(',').join(' · ')}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#0f0f1a' },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#e94560', fontSize: 14 },
  backBtn: {
    paddingTop:        56,
    paddingHorizontal: 20,
    paddingBottom:     8,
  },
  backText: { fontSize: 15, color: '#e94560', fontWeight: '600' },
  content:  { padding: 16, paddingBottom: 40 },
  heroCard: {
    backgroundColor: '#16213e',
    borderRadius:    16,
    padding:         20,
    marginBottom:    24,
    borderWidth:     1,
    borderColor:     '#1e2a4a',
  },
  heroTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   12,
  },
  name:        { fontSize: 22, fontWeight: '800', color: '#f0f0f5', marginBottom: 4 },
  verified:    { fontSize: 13, color: '#22c55e', fontWeight: '600', marginBottom: 4 },
  cuisine:     { fontSize: 13, color: '#a0a0b0' },
  boostBadge:  { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  boostText:   { fontSize: 10, fontWeight: '700' },
  description: { fontSize: 14, color: '#a0a0b0', lineHeight: 21, marginBottom: 16 },
  metaList:    { gap: 8, marginBottom: 16 },
  metaItem:    { fontSize: 14, color: '#a0a0b0' },
  metaLink:    { color: '#e94560' },
  mapsBtn: {
    backgroundColor: '#1e2a4a',
    paddingVertical:   10,
    borderRadius:      8,
    alignItems:        'center',
    borderWidth:       1,
    borderColor:       '#3b82f6',
  },
  mapsBtnText: { color: '#3b82f6', fontWeight: '600', fontSize: 14 },
  sectionTitle: {
    fontSize:     18,
    fontWeight:   '700',
    color:        '#f0f0f5',
    marginBottom: 12,
  },
  emptyDeals: {
    backgroundColor: '#16213e',
    borderRadius:    10,
    padding:         20,
    alignItems:      'center',
  },
  emptyDealsText: { color: '#a0a0b0', fontSize: 14 },
  promoCard: {
    backgroundColor: '#16213e',
    borderRadius:    10,
    padding:         14,
    marginBottom:    10,
    borderWidth:     1,
    borderColor:     '#1e2a4a',
  },
  promoHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   6,
  },
  promoName:    { fontSize: 15, fontWeight: '700', color: '#e94560', flex: 1, marginRight: 8 },
  dealBadge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      5,
  },
  dealBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  promoDesc:   { fontSize: 13, color: '#a0a0b0', lineHeight: 19, marginBottom: 8 },
  promoTime:   { fontSize: 13, fontWeight: '600', color: '#f0f0f5' },
  promoDays:   { fontSize: 12, color: '#6b6b8a', marginTop: 3 },
});
