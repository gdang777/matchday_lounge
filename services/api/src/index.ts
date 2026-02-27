import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'matchday-lounge-api', timestamp: new Date().toISOString() });
});

// TODO: Mount route handlers here
// app.use('/api/v1/matches', matchesRouter);
// app.use('/api/v1/restaurants', restaurantsRouter);
// app.use('/api/v1/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`MatchDay Lounge API running on port ${PORT}`);
});

export default app;
