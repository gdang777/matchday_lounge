import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSavedVenues } from '../contexts/SavedVenuesContext';
import { useAuth } from '../contexts/AuthContext';

export type Deal = {
  id: string;
  name: string;
  description: string;
  dealType: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string;
  restaurant: {
    id: string;
    name: string;
    address: string | null;
    neighborhood: string | null;
    city: string;
    boostTier: string;
    photoUrls: string | null;
    googleMapsUrl: string | null;
    isVerified: boolean;
  };
};

type Props = {
  deal: Deal;
  onPress?: () => void;
};

const DEAL_COLOURS: Record<string, string> = {
  DRINKS: '#3b82f6',
  FOOD: '#22c55e',
  BOTH: '#a855f7',
};

const BOOST_COLOURS: Record<string, string> = {
  PREMIUM: '#f59e0b',
  FEATURED: '#3b82f6',
  STANDARD: 'transparent',
};

export default function DealCard({ deal, onPress }: Props) {
  const { savedIds, save, unsave } = useSavedVenues();
  const { user } = useAuth();
  const isSaved = savedIds.has(deal.restaurant.id);
  const dealColour = DEAL_COLOURS[deal.dealType] ?? '#6b7280';
  const boostColour = BOOST_COLOURS[deal.restaurant.boostTier] ?? 'transparent';
  const isPremium = deal.restaurant.boostTier === 'PREMIUM';
  const isFeatured = deal.restaurant.boostTier === 'FEATURED';

  function handleSave() {
    if (!user) return;
    isSaved ? unsave(deal.restaurant.id) : save(deal.restaurant.id);
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, isPremium && styles.cardPremium]}>
      {/* Boost stripe */}
      {(isPremium || isFeatured) && (
        <View style={[styles.boostStripe, { backgroundColor: boostColour }]} />
      )}

      <View style={styles.body}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {deal.restaurant.name}
              {deal.restaurant.isVerified && <Text style={styles.verified}> ✓</Text>}
            </Text>
            {(deal.restaurant.neighborhood || deal.restaurant.address) && (
              <Text style={styles.location} numberOfLines={1}>
                {deal.restaurant.neighborhood ?? deal.restaurant.address}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            {user && (
              <TouchableOpacity onPress={handleSave} hitSlop={8} style={styles.heartBtn}>
                <Text style={[styles.heartText, isSaved && styles.heartTextSaved]}>
                  {isSaved ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            )}
            <View style={[styles.dealBadge, { backgroundColor: dealColour }]}>
              <Text style={styles.dealBadgeText}>{deal.dealType}</Text>
            </View>
          </View>
        </View>

        {/* Deal info */}
        <Text style={styles.dealName}>{deal.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{deal.description}</Text>

        {/* Time */}
        <Text style={styles.time}>
          {formatTime(deal.startTime)} – {formatTime(deal.endTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e2a4a',
  },
  cardPremium: {
    borderColor: '#f59e0b44',
  },
  boostStripe: {
    height: 3,
    width: '100%',
  },
  body: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartBtn: { padding: 2 },
  heartText: { fontSize: 20, color: '#555' },
  heartTextSaved: { color: '#e94560' },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f0f0f5',
  },
  verified: {
    color: '#22c55e',
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: '#a0a0b0',
    marginTop: 2,
  },
  dealBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dealBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  dealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e94560',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#a0a0b0',
    lineHeight: 20,
    marginBottom: 10,
  },
  time: {
    fontSize: 13,
    color: '#f0f0f5',
    fontWeight: '600',
  },
});
