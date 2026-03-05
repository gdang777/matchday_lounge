import { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet,
    TouchableOpacity, Switch, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { useAuth } from '../../src/contexts/AuthContext';
import ProGate from '../../src/components/ProGate';

type UserProfile = {
    id: string;
    email: string;
    displayName: string | null;
    city: string | null;
    isPro: boolean;
    proExpiresAt: string | null;
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
    preferredDealTypes: string | null;
    alertsEnabled: boolean | null;
};

type City = 'VANCOUVER' | 'TORONTO';
type DealFilter = 'DRINKS' | 'FOOD' | 'BOTH';

const CITIES: City[] = ['VANCOUVER', 'TORONTO'];
const DEAL_FILTERS: DealFilter[] = ['DRINKS', 'FOOD', 'BOTH'];

export default function ProfileScreen() {
    const { user, isPro, signOut } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: profile,
        isLoading,
    } = useQuery<UserProfile>({
        queryKey: ['user-profile'],
        queryFn: async () => (await api.get<UserProfile>('/api/users/me')).data,
        enabled: !!user,
    });

    // Local editable state — synced from fetched profile
    const [city, setCity] = useState<City | null>(null);
    const [dealTypes, setDealTypes] = useState<DealFilter[]>([]);
    const [quietHoursStart, setQuietHoursStart] = useState<string | null>(null);
    const [quietHoursEnd, setQuietHoursEnd] = useState<string | null>(null);
    const [alertsEnabled, setAlertsEnabled] = useState(false);

    useEffect(() => {
        if (!profile) return;
        setCity((profile.city as City) ?? null);
        setDealTypes(
            profile.preferredDealTypes
                ? (profile.preferredDealTypes.split(',').map(t => t.toUpperCase()) as DealFilter[])
                : [],
        );
        setQuietHoursStart(profile.quietHoursStart ?? null);
        setQuietHoursEnd(profile.quietHoursEnd ?? null);
        setAlertsEnabled(Boolean(profile.alertsEnabled));
    }, [profile]);

    const updateProfile = useMutation({
        mutationFn: (patch: Partial<UserProfile>) => api.patch('/api/users/me', patch),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user-profile'] }),
    });

    function handleCityChange(newCity: City) {
        setCity(newCity);
        updateProfile.mutate({ city: newCity });
    }

    function toggleDealType(type: DealFilter) {
        const next = dealTypes.includes(type)
            ? dealTypes.filter(t => t !== type)
            : [...dealTypes, type];
        setDealTypes(next);
        updateProfile.mutate({ preferredDealTypes: next.join(',') });
    }

    async function handleSignOut() {
        await signOut();
    }

    const proExpiry = profile?.proExpiresAt
        ? new Date(profile.proExpiresAt).toLocaleDateString([], {
            month: 'long', day: 'numeric', year: 'numeric',
        })
        : null;

    if (!user) {
        return (
            <View style={styles.screen}>
                <View style={styles.center}>
                    <Text style={styles.emptyIcon}>👤</Text>
                    <Text style={styles.emptyTitle}>Sign in to view your profile</Text>
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

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.headerBlock}>
                <Text style={styles.title}>👤 Profile</Text>
            </View>

            {/* ── Account ─────────────────────────────── */}
            <Section title="Account">
                <InfoRow label="Email" value={user.email ?? '—'} />
                <InfoRow label="Name" value={profile?.displayName ?? user.displayName ?? '—'} />
            </Section>

            {/* ── Pro Status ──────────────────────────── */}
            <Section title="Subscription">
                {isPro ? (
                    <View style={styles.proBanner}>
                        <Text style={styles.proBannerIcon}>⚡</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.proBannerTitle}>Pro Member</Text>
                            {proExpiry && (
                                <Text style={styles.proBannerSub}>Active until {proExpiry}</Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.infoText}>
                            Upgrade to Pro for unlimited AI Concierge access, Match Day Alerts, and more.
                        </Text>
                        <ProGate feature="Pro features" />
                    </View>
                )}
            </Section>

            {/* ── Preferences ─────────────────────────── */}
            <Section title="City">
                <View style={styles.chipRow}>
                    {CITIES.map(c => (
                        <TouchableOpacity
                            key={c}
                            style={[styles.chip, city === c && styles.chipActive]}
                            onPress={() => handleCityChange(c)}
                        >
                            <Text style={[styles.chipText, city === c && styles.chipTextActive]}>
                                {c === 'VANCOUVER' ? '🏔 Vancouver' : '🏙 Toronto'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Section>

            <Section title="Deal Type Preferences">
                <Text style={styles.helpText}>Used to personalise AI deal alerts.</Text>
                <View style={styles.chipRow}>
                    {DEAL_FILTERS.map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.chip, dealTypes.includes(type) && styles.chipActive]}
                            onPress={() => toggleDealType(type)}
                        >
                            <Text style={[styles.chipText, dealTypes.includes(type) && styles.chipTextActive]}>
                                {type === 'DRINKS' ? '🍺 Drinks' : type === 'FOOD' ? '🍔 Food' : '🍽 Both'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Section>

            {/* ── Notifications (quiet hours) ─────────── */}
            <Section title="Notification Quiet Hours">
                <Text style={styles.helpText}>AI alerts will be paused during these hours.</Text>

                <View style={styles.timeRow}>
                    {[
                        { label: 'Start', value: quietHoursStart, opts: ['22:00', '23:00', '00:00'], setter: setQuietHoursStart, field: 'quietHoursStart' },
                        { label: 'End', value: quietHoursEnd, opts: ['06:00', '07:00', '08:00'], setter: setQuietHoursEnd, field: 'quietHoursEnd' },
                    ].map(({ label, value, opts, setter, field }) => (
                        <View key={label} style={{ flex: 1 }}>
                            <Text style={styles.timeLabel}>{label}</Text>
                            <View style={styles.timeChips}>
                                {opts.map(t => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[styles.timeChip, value === t && styles.chipActive]}
                                        onPress={() => {
                                            setter(t);
                                            updateProfile.mutate({ [field]: t });
                                        }}
                                    >
                                        <Text style={[styles.chipText, value === t && styles.chipTextActive]}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </Section>

            {/* ── Match Day Alerts ─────────────────────── */}
            <Section title="Match Day Alerts">
                {isPro ? (
                    <View>
                        <View style={styles.alertRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.alertTitle}>Push Notifications</Text>
                                <Text style={styles.alertSub}>
                                    Get an AI-crafted alert the moment a match kicks off with deal recommendations.
                                </Text>
                            </View>
                            <Switch
                                value={alertsEnabled}
                                onValueChange={(val) => {
                                    setAlertsEnabled(val);
                                    updateProfile.mutate({ alertsEnabled: val });
                                }}
                                trackColor={{ false: '#2a2a4a', true: 'rgba(233,69,96,0.5)' }}
                                thumbColor={alertsEnabled ? '#e94560' : '#6b6b8a'}
                            />
                        </View>
                        {alertsEnabled && (
                            <Text style={styles.alertHint}>
                                ⚡ Alerts active. Quiet hours above will suppress notifications.
                            </Text>
                        )}
                    </View>
                ) : (
                    <View>
                        <Text style={styles.infoText}>
                            Match Day Alerts are a Pro feature. Upgrade to receive AI-curated push notifications when matches kick off.
                        </Text>
                        <ProGate feature="Match Day Alerts" />
                    </View>
                )}
            </Section>

            {/* ── Sign out ─────────────────────────────── */}
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#0f0f1a' },
    content: { paddingBottom: 32 },

    headerBlock: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a2e',
    },
    title: { fontSize: 22, fontWeight: '800', color: '#f0f0f5' },

    section: { paddingHorizontal: 16, paddingTop: 24 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b6b8a',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    sectionBody: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#1e2a4a',
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1e2a4a',
    },
    infoLabel: { fontSize: 14, color: '#a0a0b0' },
    infoValue: { fontSize: 14, color: '#f0f0f5', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
    infoText: { fontSize: 13, color: '#a0a0b0', lineHeight: 19, marginBottom: 12 },
    helpText: { fontSize: 12, color: '#6b6b8a', marginBottom: 10 },

    proBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(233,69,96,.12)',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(233,69,96,.3)',
    },
    proBannerIcon: { fontSize: 24 },
    proBannerTitle: { fontSize: 16, fontWeight: '700', color: '#f0f0f5' },
    proBannerSub: { fontSize: 13, color: '#a0a0b0', marginTop: 2 },

    chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2a2a4a',
        backgroundColor: '#0f0f1a',
    },
    chipActive: { borderColor: '#e94560', backgroundColor: 'rgba(233,69,96,.15)' },
    chipText: { fontSize: 13, fontWeight: '600', color: '#a0a0b0' },
    chipTextActive: { color: '#e94560' },

    timeRow: { flexDirection: 'row', gap: 16 },
    timeLabel: { fontSize: 12, color: '#6b6b8a', marginBottom: 6 },
    timeChips: { gap: 6 },
    timeChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#2a2a4a',
        backgroundColor: '#0f0f1a',
    },

    signOutBtn: {
        margin: 16,
        marginTop: 24,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e94560',
        alignItems: 'center',
    },
    signOutText: { fontSize: 15, fontWeight: '700', color: '#e94560' },

    alertRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    alertTitle: { fontSize: 14, fontWeight: '600', color: '#f0f0f5', marginBottom: 2 },
    alertSub: { fontSize: 12, color: '#a0a0b0', lineHeight: 17 },
    alertHint: { fontSize: 12, color: '#e94560', marginTop: 8, lineHeight: 17 },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyIcon: { fontSize: 56, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#f0f0f5', textAlign: 'center' },
});
