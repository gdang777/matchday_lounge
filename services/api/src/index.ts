import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRouter from './routes/auth';
import restaurantsRouter from './routes/restaurants';
import promotionsRouter from './routes/promotions';
import adminRouter from './routes/admin';
import conciergeRouter from './routes/concierge';
import stripeRouter from './routes/stripe';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));

// ─── Body parsers ─────────────────────────────────────────────────────────────
// Stripe webhooks need the raw Buffer body for signature verification.
// Mount express.raw() on that path BEFORE the global express.json() middleware.
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'matchday-lounge-api', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/promotions', promotionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/concierge', conciergeRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/users', usersRouter);

// ─── 404 catch-all ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`MatchDay Lounge API running on port ${PORT}`);
});

export default app;
