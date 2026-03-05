// Restaurant management routes.
//
// PUBLIC (no auth):
//   GET    /api/restaurants                         — public list by city
//   GET    /api/restaurants/happy-hours/now          — active happy hours right now
//   GET    /api/restaurants/:id/promotions/active    — public active promotions for a restaurant
//
// AUTH REQUIRED:
//   GET    /api/restaurants/mine            — get the caller's own restaurant
//   POST   /api/restaurants                — create restaurant (pending approval)
//   GET    /api/restaurants/:id            — get restaurant by ID (owner or admin)
//   PATCH  /api/restaurants/:id            — update restaurant profile
//   GET    /api/restaurants/:id/promotions — all promotions for this restaurant (owner or admin)
//   POST   /api/restaurants/:id/promotions — create promotion for this restaurant
//   GET    /api/restaurants/:id/analytics  — view impressions analytics
//
// OPTIONAL AUTH:
//   POST   /api/restaurants/:id/view       — record a venue view (analytics)

import { Router, Response, Request } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { dcQuery, dcMutate } from '../lib/dataconnect';

const router = Router();

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_CITIES    = new Set(['VANCOUVER', 'TORONTO']);
const VALID_DEAL_TYPES = new Set(['DRINKS', 'FOOD', 'BOTH']);
const VALID_DAYS       = new Set(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
const TIME_RE          = /^\d{2}:\d{2}$/;
const URL_RE           = /^https?:\/\/.+/;

function isValidUrl(v: string) { return URL_RE.test(v); }
function isValidTime(v: string) { return TIME_RE.test(v); }

function parseDaysOfWeek(raw: string): string | null {
  const parts = raw.split(',').map(d => d.trim().toUpperCase());
  if (parts.some(d => !VALID_DAYS.has(d))) return null;
  return parts.join(',');
}

// ─── Ownership guard ─────────────────────────────────────────────────────────

type RestaurantRow = {
  restaurant: {
    id: string;
    name: string;
    city: string;
    ownerUserId: string;
    isApproved: boolean;
    isSuspended: boolean;
    isVerified: boolean;
    boostTier: string;
    boostExpiresAt: string | null;
    stripeSubscriptionId: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

async function getAndAuthorise(
  restaurantId: string,
  req: AuthRequest,
  res: Response,
): Promise<RestaurantRow['restaurant'] | null> {
  const data = await dcQuery<RestaurantRow>('GetRestaurantById', { id: restaurantId });

  if (!data.restaurant) {
    res.status(404).json({ error: 'Restaurant not found' });
    return null;
  }

  const isOwner = data.restaurant.ownerUserId === req.user!.uid;
  const isAdmin = req.user!.admin === true;

  if (!isOwner && !isAdmin) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }

  return data.restaurant;
}


// ─── Routes ──────────────────────────────────────────────────────────────────

// PUBLIC: GET /api/restaurants?city=VANCOUVER|TORONTO
// Returns all approved, non-suspended restaurants for a city.
// Ordered: PREMIUM → FEATURED → STANDARD, then alphabetically.
// No auth required — used by fan mobile app and fan web app listing screens.
router.get('/', async (req: Request, res) => {
  const { city } = req.query as Record<string, string>;

  if (!city || !VALID_CITIES.has(city)) {
    res.status(400).json({ error: 'city query param must be VANCOUVER or TORONTO' });
    return;
  }

  try {
    type PubRestaurant = {
      id: string; name: string; description: string | null; city: string;
      neighborhood: string | null; address: string | null; cuisineType: string | null;
      phoneNumber: string | null; website: string | null; googleMapsUrl: string | null;
      photoUrls: string | null; boostTier: string; isVerified: boolean;
    };
    const data = await dcQuery<{ restaurants: PubRestaurant[] }>('GetRestaurantsByCity', { city });
    res.json(data.restaurants);
  } catch (err) {
    console.error('[restaurants GET /]', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});


// PUBLIC: GET /api/restaurants/happy-hours/now?city=&day=MON&time=14:30
// Returns active happy hour deals happening right now.
// IMPORTANT: declared before GET /:id so Express doesn't treat "happy-hours" as an ID.
router.get('/happy-hours/now', async (req: Request, res) => {
  const { city, day, time } = req.query as Record<string, string>;

  if (!city || !VALID_CITIES.has(city)) {
    res.status(400).json({ error: 'city must be VANCOUVER or TORONTO' });
    return;
  }
  if (!day || !VALID_DAYS.has(day.toUpperCase())) {
    res.status(400).json({ error: 'day must be a 3-letter day code: MON,TUE,WED,THU,FRI,SAT,SUN' });
    return;
  }
  if (!time || !TIME_RE.test(time)) {
    res.status(400).json({ error: 'time must be in HH:MM format' });
    return;
  }

  try {
    type HappyHourRow = {
      id: string; name: string; description: string; dealType: string;
      startTime: string; endTime: string; daysOfWeek: string;
      restaurant: {
        id: string; name: string; address: string | null; neighborhood: string | null;
        city: string; boostTier: string; photoUrls: string | null;
        googleMapsUrl: string | null; isVerified: boolean;
      };
    };
    const data = await dcQuery<{ promotions: HappyHourRow[] }>('GetActiveHappyHoursNow', {
      city,
      currentDay:  day.toUpperCase(),
      currentTime: time,
    });
    res.json(data.promotions);
  } catch (err) {
    console.error('[restaurants GET /happy-hours/now]', err);
    res.status(500).json({ error: 'Failed to fetch happy hours' });
  }
});


// GET /api/restaurants/mine
// Returns the restaurant owned by the authenticated caller.
// IMPORTANT: must be declared before /:id so Express doesn't match "mine" as an ID.
router.get('/mine', requireAuth, async (req: AuthRequest, res) => {
  try {
    type MyRestaurant = {
      id: string; name: string; description: string | null; city: string;
      neighborhood: string | null; address: string | null; cuisineType: string | null;
      phoneNumber: string | null; website: string | null; googleMapsUrl: string | null;
      photoUrls: string | null; isVerified: boolean; isApproved: boolean;
      isSuspended: boolean; boostTier: string; boostExpiresAt: string | null;
      createdAt: string; updatedAt: string;
    };
    const data = await dcQuery<{ restaurants: MyRestaurant[] }>('GetMyRestaurant', {
      ownerId: req.user!.uid,
    });

    if (!data.restaurants.length) {
      res.status(404).json({ error: 'No restaurant found for this account' });
      return;
    }

    res.json(data.restaurants[0]);
  } catch (err) {
    console.error('[restaurants GET /mine]', err);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});


// POST /api/restaurants
// Creates a restaurant in pending-approval state. Owner is always the caller.
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { name, city, description, neighborhood, address, cuisineType,
          phoneNumber, website, googleMapsUrl, photoUrls } = req.body as Record<string, string>;

  if (!name?.trim()) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  if (name.length > 200) {
    res.status(400).json({ error: 'name must be 200 characters or fewer' });
    return;
  }
  if (!city || !VALID_CITIES.has(city)) {
    res.status(400).json({ error: 'city must be VANCOUVER or TORONTO' });
    return;
  }
  if (description && description.length > 1000) {
    res.status(400).json({ error: 'description must be 1000 characters or fewer' });
    return;
  }
  if (website && !isValidUrl(website)) {
    res.status(400).json({ error: 'website must be a valid URL' });
    return;
  }
  if (googleMapsUrl && !isValidUrl(googleMapsUrl)) {
    res.status(400).json({ error: 'googleMapsUrl must be a valid URL' });
    return;
  }

  try {
    await dcMutate('CreateRestaurant', {
      ownerUserId: req.user!.uid,
      name: name.trim(),
      city,
      description:    description ?? null,
      neighborhood:   neighborhood ?? null,
      address:        address ?? null,
      cuisineType:    cuisineType ?? null,
      phoneNumber:    phoneNumber ?? null,
      website:        website ?? null,
      googleMapsUrl:  googleMapsUrl ?? null,
      photoUrls:      photoUrls ?? null,
    });

    res.status(201).json({ message: 'Restaurant submitted for approval' });
  } catch (err) {
    console.error('[restaurants POST]', err);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
});


// GET /api/restaurants/:id
// Returns the full restaurant record. Only the owner or an admin can access.
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const restaurant = await getAndAuthorise(String(req.params.id), req, res);
    if (!restaurant) return;
    res.json(restaurant);
  } catch (err) {
    console.error('[restaurants GET /:id]', err);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});


// PATCH /api/restaurants/:id
// Partial update of restaurant profile. Only the owner or an admin can update.
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const restaurant = await getAndAuthorise(String(req.params.id), req, res);
    if (!restaurant) return;

    const { name, description, neighborhood, address, cuisineType,
            phoneNumber, website, googleMapsUrl, photoUrls } = req.body as Record<string, string | undefined>;

    if (name !== undefined && name.length > 200) {
      res.status(400).json({ error: 'name must be 200 characters or fewer' });
      return;
    }
    if (description !== undefined && description.length > 1000) {
      res.status(400).json({ error: 'description must be 1000 characters or fewer' });
      return;
    }
    if (website !== undefined && !isValidUrl(website)) {
      res.status(400).json({ error: 'website must be a valid URL' });
      return;
    }
    if (googleMapsUrl !== undefined && !isValidUrl(googleMapsUrl)) {
      res.status(400).json({ error: 'googleMapsUrl must be a valid URL' });
      return;
    }

    await dcMutate('UpdateRestaurant', {
      id: req.params.id,
      name:          name          ?? null,
      description:   description   ?? null,
      neighborhood:  neighborhood  ?? null,
      address:       address       ?? null,
      cuisineType:   cuisineType   ?? null,
      phoneNumber:   phoneNumber   ?? null,
      website:       website       ?? null,
      googleMapsUrl: googleMapsUrl ?? null,
      photoUrls:     photoUrls     ?? null,
    });

    res.json({ message: 'Restaurant updated' });
  } catch (err) {
    console.error('[restaurants PATCH /:id]', err);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});


// POST /api/restaurants/:id/promotions
// Creates a promotion owned by this restaurant.
// Only the restaurant owner can call this — source is always PARTNER → auto-approved.
router.post('/:id/promotions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const restaurant = await getAndAuthorise(String(req.params.id), req, res);
    if (!restaurant) return;

    // Only the actual owner (not admin) creates PARTNER promotions.
    if (restaurant.ownerUserId !== req.user!.uid) {
      res.status(403).json({ error: 'Only the restaurant owner can create promotions' });
      return;
    }

    const { name, description, dealType, daysOfWeek, startTime, endTime } =
      req.body as Record<string, string>;

    if (!name?.trim()) {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    if (!description?.trim()) {
      res.status(400).json({ error: 'description is required' });
      return;
    }
    if (description.length > 500) {
      res.status(400).json({ error: 'description must be 500 characters or fewer' });
      return;
    }
    if (!dealType || !VALID_DEAL_TYPES.has(dealType)) {
      res.status(400).json({ error: 'dealType must be DRINKS, FOOD, or BOTH' });
      return;
    }
    if (!daysOfWeek) {
      res.status(400).json({ error: 'daysOfWeek is required' });
      return;
    }
    const parsedDays = parseDaysOfWeek(daysOfWeek);
    if (!parsedDays) {
      res.status(400).json({ error: 'daysOfWeek must be comma-separated day codes: MON,TUE,WED,THU,FRI,SAT,SUN' });
      return;
    }
    if (!startTime || !isValidTime(startTime)) {
      res.status(400).json({ error: 'startTime must be in HH:MM format' });
      return;
    }
    if (!endTime || !isValidTime(endTime)) {
      res.status(400).json({ error: 'endTime must be in HH:MM format' });
      return;
    }
    if (startTime >= endTime) {
      res.status(400).json({ error: 'startTime must be before endTime' });
      return;
    }

    await dcMutate('CreatePromotion', {
      restaurantId:      req.params.id,
      name:              name.trim(),
      description:       description.trim(),
      dealType,
      daysOfWeek:        parsedDays,
      startTime,
      endTime,
      source:            'PARTNER',
      isApproved:        true,   // PARTNER promotions auto-approved
      submittedByUserId: null,
    });

    res.status(201).json({ message: 'Promotion created' });
  } catch (err) {
    console.error('[restaurants POST /:id/promotions]', err);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});


// GET /api/restaurants/:id/promotions
// Returns ALL promotions for this restaurant (active, inactive, pending approval).
// Only the owner or an admin can access — public query only returns active+approved.
router.get('/:id/promotions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const restaurant = await getAndAuthorise(String(req.params.id), req, res);
    if (!restaurant) return;

    type PromRow = {
      id: string; name: string; description: string; dealType: string;
      daysOfWeek: string; startTime: string; endTime: string;
      isActive: boolean; isApproved: boolean; source: string;
      flagCount: number; createdAt: string; updatedAt: string;
    };
    const data = await dcQuery<{ promotions: PromRow[] }>('GetAllPromotionsByRestaurant', {
      restaurantId: String(req.params.id),
    });

    res.json(data.promotions);
  } catch (err) {
    console.error('[restaurants GET /:id/promotions]', err);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});


// GET /api/restaurants/:id/analytics
// Returns aggregated impression counts for the restaurant dashboard.
// Accepts ?start=YYYY-MM-DD&end=YYYY-MM-DD query params (default: last 30 days).
router.get('/:id/analytics', requireAuth, async (req: AuthRequest, res) => {
  try {
    const restaurant = await getAndAuthorise(String(req.params.id), req, res);
    if (!restaurant) return;

    const now   = new Date();
    const start = req.query.start
      ? new Date(req.query.start as string)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const end   = req.query.end ? new Date(req.query.end as string) : now;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'start and end must be valid ISO dates' });
      return;
    }

    type ViewRow = { id: string; viewType: string; city: string; userId?: string; createdAt: string };
    const data = await dcQuery<{ venueViews: ViewRow[] }>('GetRestaurantAnalytics', {
      restaurantId: req.params.id,
      startDate:    start.toISOString(),
      endDate:      end.toISOString(),
    });

    const rows = data.venueViews;

    const byType = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.viewType] = (acc[r.viewType] ?? 0) + 1;
      return acc;
    }, {});

    const byDate = rows.reduce<Record<string, number>>((acc, r) => {
      const date = r.createdAt.substring(0, 10);
      acc[date] = (acc[date] ?? 0) + 1;
      return acc;
    }, {});

    res.json({ total: rows.length, byType, byDate, start: start.toISOString(), end: end.toISOString() });
  } catch (err) {
    console.error('[restaurants GET /:id/analytics]', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// PUBLIC: GET /api/restaurants/:id/promotions/active
// Returns active, approved promotions for a restaurant.
// No auth required — fan listing and detail screens.
router.get('/:id/promotions/active', async (req: Request, res) => {
  try {
    type ActiveProm = {
      id: string; name: string; description: string; dealType: string;
      daysOfWeek: string; startTime: string; endTime: string; source: string;
    };
    const data = await dcQuery<{ promotions: ActiveProm[] }>('GetActivePromotionsByRestaurant', {
      restaurantId: String(req.params.id),
    });
    res.json(data.promotions);
  } catch (err) {
    console.error('[restaurants GET /:id/promotions/active]', err);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});


// OPTIONAL AUTH: POST /api/restaurants/:id/view
// Records a venue view event for analytics.
// Works for both anonymous and authenticated users.
// Body: { viewType: 'LISTING' | 'PROFILE' | 'MAP_PIN', city: 'VANCOUVER' | 'TORONTO' }
const VALID_VIEW_TYPES = new Set(['LISTING', 'PROFILE', 'MAP_PIN']);

router.post('/:id/view', optionalAuth, async (req: AuthRequest, res) => {
  const { viewType, city } = req.body as { viewType?: string; city?: string };

  if (!viewType || !VALID_VIEW_TYPES.has(viewType)) {
    res.status(400).json({ error: 'viewType must be LISTING, PROFILE, or MAP_PIN' });
    return;
  }
  if (!city || !VALID_CITIES.has(city)) {
    res.status(400).json({ error: 'city must be VANCOUVER or TORONTO' });
    return;
  }

  try {
    await dcMutate('RecordVenueView', {
      restaurantId: String(req.params.id),
      userId:       req.user?.uid ?? null,
      viewType,
      city,
    });
    res.status(204).send();
  } catch (err) {
    console.error('[restaurants POST /:id/view]', err);
    res.status(500).json({ error: 'Failed to record view' });
  }
});


export default router;
