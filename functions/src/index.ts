// MatchDay Lounge — Firebase Cloud Functions
//
// Exports:
//   ingestMatches        — Scheduled: runs every 2 minutes to sync match data
//   ingestMatchesManual  — HTTP trigger: admin-only manual refresh endpoint

import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

import { fetchMatches } from "./lib/footballApi";
import { syncMatchesToFirestore } from "./lib/firestoreWriter";
import { dispatchMatchAlerts, claudeApiKey } from "./lib/alertDispatcher";

// Initialise Firebase Admin SDK (uses default service account in Cloud Functions)
initializeApp();

// Global options — keep instances low for cost control on a scheduled job
setGlobalOptions({ maxInstances: 3, region: "northamerica-northeast1" });

const COMPETITION_CODE = process.env.FOOTBALL_COMPETITION_CODE ?? "WC";
const API_KEY = process.env.FOOTBALL_DATA_API_KEY ?? "";
const ADMIN_SECRET = process.env.INGEST_ADMIN_SECRET ?? "";

// ─── Core ingestion logic ─────────────────────────────────────────────────────
async function runIngestion(source: string): Promise<void> {
    if (!API_KEY) {
        logger.warn("[ingest] FOOTBALL_DATA_API_KEY not set — skipping", { source });
        return;
    }

    logger.info(`[ingest] Starting match sync (competition=${COMPETITION_CODE})`, { source });

    const matches = await fetchMatches(COMPETITION_CODE, API_KEY);
    logger.info(`[ingest] Fetched ${matches.length} matches from API`, { source });

    const summary = await syncMatchesToFirestore(matches);
    logger.info("[ingest] Sync complete", { source, ...summary });
}


// ─── Scheduled trigger (every 2 minutes) ─────────────────────────────────────
// Cloud Scheduler fires this regardless of whether matches are live.
// The firestoreWriter skips unchanged documents so non-live periods are cheap.
export const ingestMatches = onSchedule(
    {
        schedule: "every 2 minutes",
        timeZone: "UTC",
        retryCount: 3,
        maxRetrySeconds: 60,
        memory: "256MiB",
        timeoutSeconds: 60,
    },
    async () => {
        try {
            await runIngestion("scheduler");
        } catch (err) {
            logger.error("[ingest] Scheduled ingestion failed", { err });
            throw err; // re-throw so Cloud Scheduler marks the attempt as failed
        }
    },
);


// ─── HTTP trigger — admin manual refresh ─────────────────────────────────────
// POST https://{region}-{project}.cloudfunctions.net/ingestMatchesManual
// Header: X-Admin-Secret: <INGEST_ADMIN_SECRET>
export const ingestMatchesManual = onRequest(
    { memory: "256MiB", timeoutSeconds: 60 },
    async (req, res) => {
        // Only accept POST
        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        // Validate shared secret
        const secret = req.headers["x-admin-secret"];
        if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            await runIngestion("manual-http");
            res.json({ success: true, competition: COMPETITION_CODE });
        } catch (err) {
            logger.error("[ingest] Manual ingestion failed", { err });
            res.status(500).json({ error: "Ingestion failed", details: String(err) });
        }
    },
);


// ─── Firestore trigger — Match Day Alerts ─────────────────────────────────────
// Fires whenever a document in `matches/{matchId}` is updated.
// Calls dispatchMatchAlerts which detects the live transition, generates AI
// text via Claude, and fans out FCM push notifications to opted-in Pro users.
export const sendMatchAlerts = onDocumentUpdated(
    {
        document: "matches/{matchId}",
        region: "northamerica-northeast1",
        memory: "512MiB",
        timeoutSeconds: 120,
        secrets: [claudeApiKey],
    },
    async (event) => {
        const before = event.data?.before?.data();
        const after = event.data?.after?.data();
        const matchId = event.params.matchId;

        if (!before || !after) {
            logger.warn('[sendMatchAlerts] Missing before/after data — skipping', { matchId });
            return;
        }

        try {
            await dispatchMatchAlerts(
                before as Parameters<typeof dispatchMatchAlerts>[0],
                after as Parameters<typeof dispatchMatchAlerts>[1],
                matchId,
                claudeApiKey.value(),
            );
        } catch (err) {
            logger.error('[sendMatchAlerts] Dispatcher failed', { matchId, err });
        }
    },
);
