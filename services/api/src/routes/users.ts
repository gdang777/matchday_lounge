// GET    /api/users/me             — fetch current user's profile
// PATCH  /api/users/me             — update profile fields (city, displayName, quietHours, preferredDealTypes, alertsEnabled)
// POST   /api/users/fcm-token      — register FCM push token (stored in Firestore for Cloud Functions)
// DELETE /api/users/fcm-token      — clear FCM push token (on sign-out)

import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { dcQuery, dcMutate } from '../lib/dataconnect';
import { db } from '../lib/firebase';

const router = Router();

const VALID_CITIES = new Set(['VANCOUVER', 'TORONTO']);
const VALID_DEAL_TYPES = new Set(['DRINKS', 'FOOD', 'BOTH']);
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:MM 24h

// ─── GET /api/users/me ───────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
    try {
        type UserRow = {
            user: {
                id: string;
                email: string;
                displayName: string | null;
                city: string | null;
                isPro: boolean;
                proExpiresAt: string | null;
                quietHoursStart: string | null;
                quietHoursEnd: string | null;
                preferredDealTypes: string | null;
            } | null;
        };

        const data = await dcQuery<UserRow>('GetUserById', { id: req.user!.uid });

        if (!data.user) {
            // User exists in Firebase Auth but not yet in Data Connect — return minimal profile
            res.json({
                id: req.user!.uid,
                email: req.user!.email ?? '',
                displayName: req.user!.name ?? null,
                city: null,
                isPro: false,
                proExpiresAt: null,
                quietHoursStart: null,
                quietHoursEnd: null,
                preferredDealTypes: null,
            });
            return;
        }

        res.json(data.user);
    } catch (err) {
        console.error('[users/me GET] error:', err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});


// ─── PATCH /api/users/me ─────────────────────────────────────────────────────
router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
    const {
        displayName,
        city,
        quietHoursStart,
        quietHoursEnd,
        preferredDealTypes,
        alertsEnabled,
    } = req.body as {
        displayName?: string;
        city?: string;
        quietHoursStart?: string;
        quietHoursEnd?: string;
        preferredDealTypes?: string;
        alertsEnabled?: boolean;
    };

    // ── Validation ─────────────────────────────────────────────────────────────
    if (city !== undefined && !VALID_CITIES.has(city)) {
        res.status(400).json({ error: 'city must be VANCOUVER or TORONTO' });
        return;
    }
    if (displayName !== undefined && (typeof displayName !== 'string' || displayName.trim().length === 0)) {
        res.status(400).json({ error: 'displayName must be a non-empty string' });
        return;
    }
    if (quietHoursStart !== undefined && !TIME_RE.test(quietHoursStart)) {
        res.status(400).json({ error: 'quietHoursStart must be HH:MM (24h)' });
        return;
    }
    if (quietHoursEnd !== undefined && !TIME_RE.test(quietHoursEnd)) {
        res.status(400).json({ error: 'quietHoursEnd must be HH:MM (24h)' });
        return;
    }
    if (preferredDealTypes !== undefined) {
        const types = preferredDealTypes.split(',').map(t => t.trim().toUpperCase());
        if (!types.every(t => VALID_DEAL_TYPES.has(t))) {
            res.status(400).json({ error: 'preferredDealTypes must be comma-separated list of DRINKS, FOOD, BOTH' });
            return;
        }
    }

    try {
        await dcMutate('UpsertUser', {
            id: req.user!.uid,
            email: req.user!.email ?? '',
            displayName: displayName?.trim() ?? null,
            city: city ?? null,
            quietHoursStart: quietHoursStart ?? null,
            quietHoursEnd: quietHoursEnd ?? null,
            preferredDealTypes: preferredDealTypes ?? null,
        });

        // Persist alertsEnabled to Firestore (read by Cloud Function alert dispatcher)
        if (alertsEnabled !== undefined) {
            await db.collection('users').doc(req.user!.uid).set(
                { alertsEnabled: Boolean(alertsEnabled) },
                { merge: true },
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error('[users/me PATCH] error:', err);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});


// ─── POST /api/users/fcm-token ───────────────────────────────────────────────
// Stores the Expo/FCM push token for the current user in Firestore.
// The Cloud Function sendMatchAlerts reads this to fan out match day alerts.
router.post('/fcm-token', requireAuth, async (req: AuthRequest, res) => {
    const { token } = req.body as { token?: string };

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
        res.status(400).json({ error: 'token is required' });
        return;
    }

    try {
        await db.collection('users').doc(req.user!.uid).set(
            {
                fcmToken: token.trim(),
                isPro: req.user!.isPro ?? false,          // cache for Cloud Function query
                uid: req.user!.uid,
                updatedAt: new Date().toISOString(),
            },
            { merge: true },
        );
        res.json({ success: true });
    } catch (err) {
        console.error('[users/fcm-token POST] error:', err);
        res.status(500).json({ error: 'Failed to register push token' });
    }
});


// ─── DELETE /api/users/fcm-token ─────────────────────────────────────────────
// Clears the FCM token when the user signs out so stale tokens aren't kept.
router.delete('/fcm-token', requireAuth, async (req: AuthRequest, res) => {
    try {
        await db.collection('users').doc(req.user!.uid).set(
            { fcmToken: null },
            { merge: true },
        );
        res.json({ success: true });
    } catch (err) {
        console.error('[users/fcm-token DELETE] error:', err);
        res.status(500).json({ error: 'Failed to clear push token' });
    }
});


// ─── GET /api/users/saved-venues ────────────────────────────────────────────
// Returns all restaurants saved by the current user.
router.get('/saved-venues', requireAuth, async (req: AuthRequest, res) => {
    try {
        type SavedRow = {
            userSavedVenues: Array<{
                savedAt: string;
                restaurant: {
                    id: string;
                    name: string;
                    city: string;
                    neighborhood: string | null;
                    address: string | null;
                    boostTier: string;
                    isVerified: boolean;
                    photoUrls: string | null;
                    googleMapsUrl: string | null;
                };
            }>;
        };

        const data = await dcQuery<SavedRow>('GetUserSavedVenues', { userId: req.user!.uid });
        const venues = (data.userSavedVenues ?? []).map(sv => ({
            savedAt: sv.savedAt,
            ...sv.restaurant,
        }));

        res.json(venues);
    } catch (err) {
        console.error('[users/saved-venues] error:', err);
        res.status(500).json({ error: 'Failed to fetch saved venues' });
    }
});


// ─── POST /api/users/saved-venues/:restaurantId ───────────────────────────
router.post('/saved-venues/:restaurantId', requireAuth, async (req: AuthRequest, res) => {
    const { restaurantId } = req.params as { restaurantId: string };
    try {
        await dcMutate('SaveVenue', { restaurantId, userId: req.user!.uid });
        res.json({ success: true });
    } catch (err) {
        // Duplicate save → treat as success (idempotent)
        const msg = String(err);
        if (msg.includes('unique') || msg.includes('duplicate')) {
            res.json({ success: true, note: 'already saved' });
            return;
        }
        console.error('[users/saved-venues POST] error:', err);
        res.status(500).json({ error: 'Failed to save venue' });
    }
});


// ─── DELETE /api/users/saved-venues/:restaurantId ────────────────────────
router.delete('/saved-venues/:restaurantId', requireAuth, async (req: AuthRequest, res) => {
    const { restaurantId } = req.params as { restaurantId: string };
    try {
        await dcMutate('UnsaveVenue', { restaurantId, userId: req.user!.uid });
        res.json({ success: true });
    } catch (err) {
        console.error('[users/saved-venues DELETE] error:', err);
        res.status(500).json({ error: 'Failed to unsave venue' });
    }
});

export default router;
