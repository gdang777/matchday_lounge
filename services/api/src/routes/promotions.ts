// Promotion management routes.
//
// PATCH /api/promotions/:id         — update promotion content/schedule (owner only)
// PATCH /api/promotions/:id/toggle  — pause or resume a promotion (owner only)
// POST  /api/promotions/:id/flag    — flag a promotion as inaccurate (any user)

import { Router } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { dcQuery, dcMutate } from '../lib/dataconnect';

const router = Router();

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_DEAL_TYPES = new Set(['DRINKS', 'FOOD', 'BOTH']);
const VALID_DAYS = new Set(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
const TIME_RE = /^\d{2}:\d{2}$/;

function parseDaysOfWeek(raw: string): string | null {
  const parts = raw.split(',').map(d => d.trim().toUpperCase());
  if (parts.some(d => !VALID_DAYS.has(d))) return null;
  return parts.join(',');
}

// ─── Ownership helper ─────────────────────────────────────────────────────────

type PromotionRow = {
  promotion: {
    id: string;
    isActive: boolean;
    flagCount: number;
    restaurant: { id: string; ownerUserId: string };
  } | null;
};

async function getPromotion(id: string) {
  const data = await dcQuery<PromotionRow>('GetPromotionWithRestaurant', { id });
  return data.promotion;
}

const FLAG_THRESHOLD = 5; // auto-deactivate when flagCount reaches this


// ─── Routes ──────────────────────────────────────────────────────────────────

// PATCH /api/promotions/:id
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const promo = await getPromotion(String(req.params.id));
    if (!promo) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    const isOwner = promo.restaurant.ownerUserId === req.user!.uid;
    const isAdmin = req.user!.admin === true;
    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { name, description, dealType, daysOfWeek, startTime, endTime } =
      req.body as Record<string, string | undefined>;

    if (description !== undefined && description.length > 500) {
      res.status(400).json({ error: 'description must be 500 characters or fewer' });
      return;
    }
    if (dealType !== undefined && !VALID_DEAL_TYPES.has(dealType)) {
      res.status(400).json({ error: 'dealType must be DRINKS, FOOD, or BOTH' });
      return;
    }
    let parsedDays: string | null = null;
    if (daysOfWeek !== undefined) {
      parsedDays = parseDaysOfWeek(daysOfWeek);
      if (!parsedDays) {
        res.status(400).json({ error: 'Invalid daysOfWeek value' });
        return;
      }
    }
    if (startTime !== undefined && !TIME_RE.test(startTime)) {
      res.status(400).json({ error: 'startTime must be HH:MM' });
      return;
    }
    if (endTime !== undefined && !TIME_RE.test(endTime)) {
      res.status(400).json({ error: 'endTime must be HH:MM' });
      return;
    }

    await dcMutate('UpdatePromotion', {
      id: req.params.id,
      name: name ?? null,
      description: description ?? null,
      dealType: dealType ?? null,
      daysOfWeek: parsedDays ?? null,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
    });

    res.json({ message: 'Promotion updated' });
  } catch (err) {
    console.error('[promotions PATCH /:id]', err);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});


// PATCH /api/promotions/:id/toggle
router.patch('/:id/toggle', requireAuth, async (req: AuthRequest, res) => {
  try {
    const promo = await getPromotion(String(req.params.id));
    if (!promo) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    const isOwner = promo.restaurant.ownerUserId === req.user!.uid;
    const isAdmin = req.user!.admin === true;
    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { isActive } = req.body as { isActive: boolean };
    if (typeof isActive !== 'boolean') {
      res.status(400).json({ error: 'isActive must be a boolean' });
      return;
    }

    await dcMutate('TogglePromotionActive', { id: req.params.id, isActive });
    res.json({ message: isActive ? 'Promotion resumed' : 'Promotion paused' });
  } catch (err) {
    console.error('[promotions PATCH /:id/toggle]', err);
    res.status(500).json({ error: 'Failed to toggle promotion' });
  }
});


// POST /api/promotions/:id/flag
// Any user (including anonymous) can flag a promotion. If the flag count reaches
// the threshold the promotion is automatically deactivated pending admin review.
router.post('/:id/flag', optionalAuth, async (_req: AuthRequest, res) => {
  try {
    const promo = await getPromotion(String(_req.params.id));
    if (!promo) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    const newCount = promo.flagCount + 1;
    const isActive = newCount < FLAG_THRESHOLD ? promo.isActive : false;

    await dcMutate('SetPromotionFlagCount', {
      id: _req.params.id,
      flagCount: newCount,
      isActive,
    });

    res.json({
      message: 'Flagged',
      autoDeactivated: !isActive,
    });
  } catch (err) {
    console.error('[promotions POST /:id/flag]', err);
    res.status(500).json({ error: 'Failed to flag promotion' });
  }
});

export default router;
