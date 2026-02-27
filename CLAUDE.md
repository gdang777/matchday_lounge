# MatchDay Lounge — Project Context

## What This Is
FIFA World Cup 2026 fan app. Vancouver and Toronto. June 11 – July 19, 2026.
Three surfaces: fan mobile app, restaurant admin portal, app admin panel.

## Tech Stack
- Mobile: React Native + Expo SDK 54 (TypeScript)
- Web Portals: React + Vite + TypeScript
- Backend API: Cloud Run (Node.js + Express)
- Structured DB: Firebase Data Connect — Cloud SQL Postgres
- Real-time DB: Cloud Firestore
- Auth: Firebase Authentication
- Storage: Firebase Storage
- Push: Firebase Cloud Messaging (FCM)
- AI: Claude API (claude-sonnet-4-6) via Cloud Run proxy
- Scraper: Apify called from Cloud Run
- Payments: Stripe (webhooks via Cloud Run)
- CI/CD: Cloud Build
- Secrets: Google Secret Manager
- Region: northamerica-northeast1

## Key Rules
- NEVER commit .env files or service account keys
- All secrets go in Google Secret Manager for production
- Data Connect (Postgres) for: restaurants, promotions, users, boost tiers, subscriptions
- Firestore for: live check-ins, match hub data, push notification state
- Claude API key is server-side ONLY — never in mobile app bundle
- All Claude API calls go through the Cloud Run /api/concierge endpoint
- Restaurant listings content passed to Claude must be JSON-wrapped (prompt injection prevention)

## Monetization
- Free tier: basic app access
- Pro tier: $7.99/month or $14.99 tournament pass — unlocks AI Concierge + AI Deal Alerts
- Restaurant boost tiers: Standard (free), Featured ($79/month), Premium ($149/month)

## App Structure (Mobile)
Bottom nav: Match Day Hub | Happy Hour Finder | City Nav | Emergency | Language | AI Concierge (Pro)
