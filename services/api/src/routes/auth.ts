// POST /api/auth/sync
// Called by the mobile app and web portals on first sign-in (and on profile updates).
// Creates or updates the caller's User record in Data Connect (Cloud SQL).
// This ensures every Firebase Auth user has a corresponding row in the User table
// before any other API calls that FK to User.id.

import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { dcMutate } from '../lib/dataconnect';

const router = Router();

const VALID_CITIES = new Set(['VANCOUVER', 'TORONTO']);

router.post('/sync', requireAuth, async (req: AuthRequest, res) => {
  const { uid, email, name } = req.user!;
  const { city } = req.body as { city?: string };

  if (city && !VALID_CITIES.has(city)) {
    res.status(400).json({ error: 'city must be VANCOUVER or TORONTO' });
    return;
  }

  try {
    await dcMutate('UpsertUser', {
      id: uid,
      email: email ?? '',
      displayName: name ?? null,
      city: city ?? null,
    });

    res.json({ uid, email, city: city ?? null });
  } catch (err) {
    console.error('[auth/sync] error:', err);
    res.status(500).json({ error: 'Failed to sync user profile' });
  }
});

export default router;
