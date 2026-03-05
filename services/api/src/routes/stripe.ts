// Stripe routes
//
// POST /api/stripe/checkout/pro     — Create Checkout Session for fan Pro subscription
// POST /api/stripe/checkout/boost   — Create Checkout Session for restaurant boost tier
// POST /api/stripe/webhook          — Handle incoming Stripe subscription events
//
// Webhook note: this route must receive the raw request body (Buffer) so that
// stripe.webhooks.constructEvent can verify the signature. In index.ts this
// path is mounted with express.raw() BEFORE the global express.json() middleware.
//
// Subscription metadata convention (set when creating subscriptions via Stripe API):
//   type           : 'fan_pro' | 'restaurant_boost'
//   firebaseUid    : Firebase Auth UID of the fan or restaurant owner
//   restaurantId   : UUID of the restaurant (restaurant_boost only)
//   boostTier      : 'FEATURED' | 'PREMIUM'  (restaurant_boost only)

import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { auth } from '../lib/firebase';
import { dcMutate, dcQuery } from '../lib/dataconnect';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const SUCCESS_URL = process.env.STRIPE_SUCCESS_URL ?? 'http://localhost:5173/?checkout=success';
const CANCEL_URL = process.env.STRIPE_CANCEL_URL ?? 'http://localhost:5173/?checkout=cancelled';
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;
const FEATURED_PRICE_ID = process.env.STRIPE_FEATURED_PRICE_ID!;
const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID!;

const VALID_BOOST_TIERS = new Set(['FEATURED', 'PREMIUM']);


// ─── POST /api/stripe/checkout/pro ───────────────────────────────────────────
// Creates a Stripe Checkout Session for a fan Pro subscription.
// Requires auth — fan must be signed in.
router.post('/checkout/pro', requireAuth, async (req: AuthRequest, res) => {
  const uid = req.user!.uid;
  const email = req.user!.email;

  if (!PRO_PRICE_ID) {
    res.status(500).json({ error: 'Stripe Pro price ID not configured on server' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      customer_email: email ?? undefined,
      client_reference_id: uid,
      metadata: {
        type: 'fan_pro',
        firebaseUid: uid,
      },
      subscription_data: {
        metadata: {
          type: 'fan_pro',
          firebaseUid: uid,
        },
      },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe] checkout/pro error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


// ─── POST /api/stripe/checkout/boost ─────────────────────────────────────────
// Creates a Stripe Checkout Session for a restaurant boost tier upgrade.
// Body: { restaurantId: string, boostTier: 'FEATURED' | 'PREMIUM' }
type RestaurantOwnerRow = { restaurant: { id: string; ownerUserId: string; name: string } | null };

router.post('/checkout/boost', requireAuth, async (req: AuthRequest, res) => {
  const { restaurantId, boostTier } = req.body as {
    restaurantId?: string;
    boostTier?: string;
  };

  if (!restaurantId?.trim()) {
    res.status(400).json({ error: 'restaurantId is required' });
    return;
  }
  if (!boostTier || !VALID_BOOST_TIERS.has(boostTier)) {
    res.status(400).json({ error: 'boostTier must be FEATURED or PREMIUM' });
    return;
  }

  const priceId = boostTier === 'FEATURED' ? FEATURED_PRICE_ID : PREMIUM_PRICE_ID;
  if (!priceId) {
    res.status(500).json({ error: `Stripe ${boostTier} price ID not configured on server` });
    return;
  }

  // Ownership check
  try {
    const data = await dcQuery<RestaurantOwnerRow>('GetRestaurantById', { id: restaurantId });
    if (!data.restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    if (data.restaurant.ownerUserId !== req.user!.uid) {
      res.status(403).json({ error: 'Forbidden: you do not own this restaurant' });
      return;
    }

    const uid = req.user!.uid;
    const email = req.user!.email;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      client_reference_id: uid,
      metadata: {
        type: 'restaurant_boost',
        firebaseUid: uid,
        restaurantId: data.restaurant.id,
        boostTier,
      },
      subscription_data: {
        metadata: {
          type: 'restaurant_boost',
          firebaseUid: uid,
          restaurantId: data.restaurant.id,
          boostTier,
        },
      },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe] checkout/boost error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


// ─── Helpers ─────────────────────────────────────────────────────────────────

async function handleSubscriptionActive(sub: Stripe.Subscription) {
  const meta = sub.metadata as Record<string, string>;
  const expiresAt = new Date(sub.current_period_end * 1000).toISOString();

  if (meta.type === 'fan_pro') {
    const uid = meta.firebaseUid;
    if (!uid) return;

    // Update Data Connect user record.
    await dcMutate('UpdateUserProStatus', {
      id: uid,
      isPro: true,
      proExpiresAt: expiresAt,
      stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    });

    // Set Firebase Auth custom claim so the ID token reflects Pro status.
    await auth.setCustomUserClaims(uid, { isPro: true });

    console.log(`[stripe] Pro activated for user ${uid}, expires ${expiresAt}`);
  } else if (meta.type === 'restaurant_boost') {
    const { restaurantId, boostTier, firebaseUid } = meta;
    if (!restaurantId || !boostTier) return;

    await dcMutate('UpdateRestaurantBoostTier', {
      id: restaurantId,
      boostTier: boostTier,
      boostExpiresAt: expiresAt,
      stripeSubscriptionId: sub.id,
    });

    console.log(`[stripe] Boost ${boostTier} activated for restaurant ${restaurantId}, owner ${firebaseUid}`);
  }
}

async function handleSubscriptionCancelled(sub: Stripe.Subscription) {
  const meta = sub.metadata as Record<string, string>;

  if (meta.type === 'fan_pro') {
    const uid = meta.firebaseUid;
    if (!uid) return;

    await dcMutate('UpdateUserProStatus', {
      id: uid,
      isPro: false,
      proExpiresAt: null,
      stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    });

    await auth.setCustomUserClaims(uid, { isPro: false });

    console.log(`[stripe] Pro deactivated for user ${uid}`);
  } else if (meta.type === 'restaurant_boost') {
    const { restaurantId } = meta;
    if (!restaurantId) return;

    await dcMutate('UpdateRestaurantBoostTier', {
      id: restaurantId,
      boostTier: 'STANDARD',
      boostExpiresAt: null,
      stripeSubscriptionId: null,
    });

    console.log(`[stripe] Boost cancelled for restaurant ${restaurantId}, reverted to STANDARD`);
  }
}


// ─── Webhook handler ──────────────────────────────────────────────────────────

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  let event: Stripe.Event;
  try {
    // req.body is a Buffer here because of express.raw() in index.ts.
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe] signature verification failed:', err);
    res.status(400).json({ error: 'Invalid webhook signature' });
    return;
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionActive(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      // Log unhandled events for visibility — don't fail the webhook.
      default:
        console.log(`[stripe] unhandled event type: ${event.type}`);
    }

    // Stripe requires a 2xx response to acknowledge receipt.
    res.json({ received: true });
  } catch (err) {
    console.error(`[stripe] error processing event ${event.type}:`, err);
    // Return 500 so Stripe retries — transient errors should self-resolve.
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
