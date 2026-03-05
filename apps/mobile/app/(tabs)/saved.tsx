import {
    View, Text, ScrollView, StyleSheet,
    TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { useSavedVenues } from '../../src/contexts/SavedVenuesContext';
import { useAuth } from '../../src/contexts/AuthContext';

type SavedRestaurant = {
    id: string;
    name: string;
    city: string;
    neighborhood: string | null;
    address: string | null;
    boostTier: string;
    isVerified: boolean;
    googleMapsUrl: string | null;
    savedAt: string;
};

const BOOST_LABELS: Record<string, string> = {
    PREMIUM: '🔥 Premium',
    FEATURED: '⭐ Featured',
    STANDARD: '',
};

export default function SavedScreen() {
    const { user } = useAuth();
    const router = useRouter();

    const {
        data: venues = [],
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery<SavedRestaurant[]>({
        queryKey: ['saved-venues'],
        queryFn: async () => {
            const res = await api.get<SavedRestaurant[]>('/api/users/saved-venues');
            return res.data;
        },
        enabled: !!user,
    });

    const { unsave } = useSavedVenues();

    function handlePress(venue: SavedRestaurant) {
        router.push({
            pathname: '/(tabs)/happy-hour/[id]',
            params: { id: venue.id, restaurantJson: JSON.stringify(venue) },
        });
    }

    if (!user) {
        return (
            <View style={styles.screen}>
                <View style={styles.center}>
                    <Text style={styles.emptyIcon}>♥</Text>
                    <Text style={styles.emptyTitle}>Sign in to save venues</Text>
                    <Text style={styles.emptyBody}>Create an account to keep track of your favourite spots.</Text>
                </View>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.screen}>
                <View style={styles.center}>
                    <ActivityIndicator color="#e94560" size="large" />
                </View>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.screen}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>Failed to load saved venues. Pull to refresh.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>♥ Saved Venues</Text>
                <Text style={styles.subtitle}>{venues.length} saved</Text>
            </View>

            {venues.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyIcon}>🏪</Text>
                    <Text style={styles.emptyTitle}>No saved venues yet</Text>
                    <Text style={styles.emptyBody}>Tap ♥ on any listing in Happy Hour Finder to save it here.</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#e94560" />
                    }
                >
                    {venues.map(venue => (
                        <TouchableOpacity
                            key={venue.id}
                            style={styles.card}
                            onPress={() => handlePress(venue)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardBody}>
                                <View style={styles.cardLeft}>
                                    <Text style={styles.venueName} numberOfLines={1}>
                                        {venue.name}
                                        {venue.isVerified && <Text style={styles.verified}> ✓</Text>}
                                    </Text>
                                    <Text style={styles.venueMeta} numberOfLines={1}>
                                        {[venue.neighborhood, venue.city].filter(Boolean).join(' · ')}
                                    </Text>
                                    {BOOST_LABELS[venue.boostTier] ? (
                                        <Text style={styles.boostLabel}>{BOOST_LABELS[venue.boostTier]}</Text>
                                    ) : null}
                                </View>

                                <TouchableOpacity
                                    onPress={() => unsave(venue.id)}
                                    hitSlop={8}
                                    style={styles.heartBtn}
                                >
                                    <Text style={styles.heartFilled}>♥</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#0f0f1a' },
    header: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a2e',
    },
    title: { fontSize: 22, fontWeight: '800', color: '#f0f0f5' },
    subtitle: { fontSize: 13, color: '#6b6b8a', marginTop: 4 },
    list: { flex: 1 },
    listContent: { padding: 16, gap: 10 },
    card: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e2a4a',
        overflow: 'hidden',
    },
    cardBody: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    cardLeft: { flex: 1, marginRight: 12 },
    venueName: { fontSize: 16, fontWeight: '700', color: '#f0f0f5' },
    verified: { color: '#22c55e', fontSize: 14 },
    venueMeta: { fontSize: 13, color: '#a0a0b0', marginTop: 3 },
    boostLabel: { fontSize: 12, color: '#f59e0b', marginTop: 4, fontWeight: '600' },
    heartBtn: { padding: 4 },
    heartFilled: { fontSize: 22, color: '#e94560' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyIcon: { fontSize: 56, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#f0f0f5', marginBottom: 8, textAlign: 'center' },
    emptyBody: { fontSize: 14, color: '#a0a0b0', textAlign: 'center', lineHeight: 20 },
    errorText: { fontSize: 14, color: '#e94560', textAlign: 'center' },
});
