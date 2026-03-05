import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type Restaurant = {
  id:           string;
  name:         string;
  description:  string | null;
  city:         string;
  neighborhood: string | null;
  address:      string | null;
  cuisineType:  string | null;
  phoneNumber:  string | null;
  website:      string | null;
  googleMapsUrl: string | null;
  photoUrls:    string | null;
  boostTier:    string;
  isVerified:   boolean;
};

type Props = {
  restaurant: Restaurant;
  onPress?:   () => void;
};

const BOOST_LABEL: Record<string, string> = {
  PREMIUM:  '★ PREMIUM',
  FEATURED: '◆ FEATURED',
};

const BOOST_COLOURS: Record<string, string> = {
  PREMIUM:  '#f59e0b',
  FEATURED: '#3b82f6',
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  const boostLabel  = BOOST_LABEL[restaurant.boostTier];
  const boostColour = BOOST_COLOURS[restaurant.boostTier];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
            {restaurant.isVerified && <Text style={styles.verified}> ✓</Text>}
          </View>

          {restaurant.cuisineType && (
            <Text style={styles.cuisine}>{restaurant.cuisineType}</Text>
          )}

          {(restaurant.neighborhood || restaurant.address) && (
            <Text style={styles.location} numberOfLines={1}>
              📍 {restaurant.neighborhood ?? restaurant.address}
            </Text>
          )}
        </View>

        {boostLabel && (
          <View style={[styles.boostBadge, { borderColor: boostColour }]}>
            <Text style={[styles.boostText, { color: boostColour }]}>{boostLabel}</Text>
          </View>
        )}
      </View>

      {restaurant.description && (
        <Text style={styles.description} numberOfLines={2}>{restaurant.description}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius:    12,
    padding:         16,
    marginBottom:    10,
    borderWidth:     1,
    borderColor:     '#1e2a4a',
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  info: {
    flex:        1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  2,
  },
  name: {
    fontSize:   16,
    fontWeight: '700',
    color:      '#f0f0f5',
    flexShrink: 1,
  },
  verified: {
    color:    '#22c55e',
    fontSize: 14,
  },
  cuisine: {
    fontSize:     12,
    color:        '#a0a0b0',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color:    '#a0a0b0',
  },
  boostBadge: {
    borderWidth:       1,
    borderRadius:      6,
    paddingHorizontal: 7,
    paddingVertical:   3,
  },
  boostText: {
    fontSize:   10,
    fontWeight: '700',
  },
  description: {
    fontSize:  13,
    color:     '#8888a0',
    marginTop: 8,
    lineHeight: 18,
  },
});
