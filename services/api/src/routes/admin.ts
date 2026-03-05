// Admin-only routes — all require the `admin` Firebase Auth custom claim.
//
// GET  /api/admin/restaurants/pending     — approval queue
// POST /api/admin/restaurants/:id/approve — approve a restaurant listing
// POST /api/admin/restaurants/:id/suspend — suspend or un-suspend a listing
// GET  /api/admin/promotions/pending      — promotion approval queue
// POST /api/admin/promotions/:id/approve  — approve a promotion

import { Router } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { dcQuery, dcMutate } from '../lib/dataconnect';

const router = Router();

// All routes in this file require admin.
router.use(requireAdmin);


// GET /api/admin/restaurants/pending
router.get('/restaurants/pending', async (_req: AuthRequest, res) => {
  try {
    type PendingRestaurant = {
      id: string;
      name: string;
      description: string | null;
      city: string;
      neighborhood: string | null;
      address: string | null;
      cuisineType: string | null;
      phoneNumber: string | null;
      website: string | null;
      ownerUserId: string;
      createdAt: string;
    };
    const data = await dcQuery<{ restaurants: PendingRestaurant[] }>(
      'GetPendingApprovalRestaurants',
    );
    res.json(data.restaurants);
  } catch (err) {
    console.error('[admin GET /restaurants/pending]', err);
    res.status(500).json({ error: 'Failed to fetch pending restaurants' });
  }
});


// POST /api/admin/restaurants/:id/approve
// Body: { isVerified?: boolean }
router.post('/restaurants/:id/approve', async (req: AuthRequest, res) => {
  const { isVerified = false } = req.body as { isVerified?: boolean };

  try {
    await dcMutate('ApproveRestaurant', {
      id: req.params.id,
      isVerified: Boolean(isVerified),
    });
    res.json({ message: 'Restaurant approved' });
  } catch (err) {
    console.error('[admin POST /restaurants/:id/approve]', err);
    res.status(500).json({ error: 'Failed to approve restaurant' });
  }
});


// POST /api/admin/restaurants/:id/suspend
// Body: { isSuspended: boolean }
router.post('/restaurants/:id/suspend', async (req: AuthRequest, res) => {
  const { isSuspended } = req.body as { isSuspended?: boolean };

  if (typeof isSuspended !== 'boolean') {
    res.status(400).json({ error: 'isSuspended must be a boolean' });
    return;
  }

  try {
    await dcMutate('SuspendRestaurant', {
      id: req.params.id,
      isSuspended,
    });
    res.json({ message: isSuspended ? 'Restaurant suspended' : 'Restaurant reinstated' });
  } catch (err) {
    console.error('[admin POST /restaurants/:id/suspend]', err);
    res.status(500).json({ error: 'Failed to update restaurant suspension status' });
  }
});


// GET /api/admin/promotions/pending
router.get('/promotions/pending', async (_req: AuthRequest, res) => {
  try {
    type PendingPromotion = {
      id: string;
      name: string;
      description: string;
      dealType: string;
      daysOfWeek: string;
      startTime: string;
      endTime: string;
      source: string;
      submittedByUserId: string | null;
      flagCount: number;
      createdAt: string;
      restaurant: { id: string; name: string; city: string; neighborhood: string | null };
    };
    const data = await dcQuery<{ promotions: PendingPromotion[] }>(
      'GetPendingApprovalPromotions',
    );
    res.json(data.promotions);
  } catch (err) {
    console.error('[admin GET /promotions/pending]', err);
    res.status(500).json({ error: 'Failed to fetch pending promotions' });
  }
});


// POST /api/admin/promotions/:id/approve
router.post('/promotions/:id/approve', async (req: AuthRequest, res) => {
  try {
    await dcMutate('ApprovePromotion', { id: req.params.id });
    res.json({ message: 'Promotion approved' });
  } catch (err) {
    console.error('[admin POST /promotions/:id/approve]', err);
    res.status(500).json({ error: 'Failed to approve promotion' });
  }
});

export default router;
