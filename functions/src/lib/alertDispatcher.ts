// alertDispatcher.ts
// Fires when a Firestore `matches/{matchId}` document transitions to status=live.
//
// Flow:
//  1. Detect live transition (before.status !== 'live', after.status === 'live')
//  2. Query Firestore for Pro users who have opted in (alertsEnabled=true, fcmToken set)
//  3. Filter out users in quiet hours
//  4. Call Claude Haiku to generate a short, punchy 2-sentence push alert
//  5. Fan out via FCM multicast; clean up invalid tokens

import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import * as logger from 'firebase-functions/logger';
import Anthropic from '@anthropic-ai/sdk';
import { defineSecret } from 'firebase-functions/params';

export const claudeApiKey = defineSecret('CLAUDE_API_KEY');

// ─── Types ────────────────────────────────────────────────────────────────────
interface MatchSnap {
    homeTeam: string;
    awayTeam: string;
    homeFlag: string;
    awayFlag: string;
    venue: string;
    city: string;
    stage: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
    kickoffUtc: string;
}

interface UserDoc {
    fcmToken?: string;
    isPro?: boolean;
    alertsEnabled?: boolean;
    quietHoursStart?: string;   // HH:MM
    quietHoursEnd?: string;   // HH:MM
    city?: string;   // VANCOUVER | TORONTO
    preferredDealTypes?: string;
}

// ─── Quiet-hours guard ────────────────────────────────────────────────────────
function isQuietNow(user: UserDoc): boolean {
    if (!user.quietHoursStart || !user.quietHoursEnd) return false;

    const now = new Date();
    const hhmm = now.getUTCHours() * 60 + now.getUTCMinutes();     // minutes since midnight (UTC)
    const start = toMinutes(user.quietHoursStart);
    const end = toMinutes(user.quietHoursEnd);

    if (start <= end) {
        // Simple range: e.g. 22:00 – 06:00  (wraps midnight)
        return hhmm >= start || hhmm < end;
    }
    // Non-wrapping: e.g. 02:00 – 10:00
    return hhmm >= start && hhmm < end;
}

function toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

// ─── Build AI alert text ──────────────────────────────────────────────────────
async function generateAlertText(match: MatchSnap, secretValue: string): Promise<{ title: string; body: string }> {
    const anthropic = new Anthropic({ apiKey: secretValue });

    const prompt =
        `A football match just kicked off and you need to write a short push notification to send to fans watching it at a bar or pub. ` +
        `Match: ${match.homeFlag} ${match.homeTeam} vs ${match.awayFlag} ${match.awayTeam}. ` +
        `Stage: ${match.stage}. Venue city: ${match.city}. ` +
        `Write two sentences max. Sentence 1: announce the match has kicked off with excitement. ` +
        `Sentence 2: urge them to head to their local viewing spot and grab a deal. ` +
        `Keep it under 120 characters total. Return ONLY the notification body text, nothing else.`;

    try {
        const msg = await anthropic.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 120,
            messages: [{ role: 'user', content: prompt }],
        });

        const body = (msg.content[0] as { type: string; text: string }).type === 'text'
            ? (msg.content[0] as { type: string; text: string }).text.trim()
            : `${match.homeFlag} ${match.homeTeam} vs ${match.awayFlag} ${match.awayTeam} just kicked off! Head to your local spot.`;

        const title = `⚽ Match Day Alert — ${match.homeFlag} ${match.homeTeam} vs ${match.awayFlag} ${match.awayTeam}`;

        return { title, body };
    } catch (err) {
        logger.warn('[alertDispatcher] Claude failed — using fallback text', { err });
        return {
            title: `⚽ Match Day Alert`,
            body: `${match.homeFlag} ${match.homeTeam} vs ${match.awayFlag} ${match.awayTeam} just kicked off! Find a deal at your local venue.`,
        };
    }
}

// ─── Remove stale tokens ──────────────────────────────────────────────────────
async function pruneInvalidTokens(
    tokenToUid: Map<string, string>,
    batchResponse: import('firebase-admin/messaging').BatchResponse,
): Promise<void> {
    const db = getFirestore();
    const writes: Promise<void>[] = [];

    batchResponse.responses.forEach((resp, i) => {
        const tokens = Array.from(tokenToUid.keys());
        if (!resp.success) {
            const code = resp.error?.code;
            if (
                code === 'messaging/registration-token-not-registered' ||
                code === 'messaging/invalid-registration-token'
            ) {
                const uid = tokenToUid.get(tokens[i]);
                if (uid) {
                    writes.push(
                        db.collection('users').doc(uid).update({ fcmToken: null }).then(() => undefined),
                    );
                }
            }
        }
    });

    await Promise.allSettled(writes);
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function dispatchMatchAlerts(
    before: MatchSnap,
    after: MatchSnap,
    matchId: string,
    secretValue: string,
): Promise<void> {
    // Only act on live transitions
    if (before.status === 'live' || after.status !== 'live') {
        return;
    }

    logger.info('[alertDispatcher] Match went live — dispatching alerts', { matchId, homeTeam: after.homeTeam, awayTeam: after.awayTeam });

    const db = getFirestore();

    // Query opted-in Pro users with a token
    const snap = await db
        .collection('users')
        .where('isPro', '==', true)
        .where('alertsEnabled', '==', true)
        .get();

    if (snap.empty) {
        logger.info('[alertDispatcher] No opted-in Pro users — nothing to send');
        return;
    }

    // Build token list, applying quiet-hours filter
    const tokenToUid = new Map<string, string>();

    snap.docs.forEach((doc) => {
        const user = doc.data() as UserDoc;
        if (!user.fcmToken) return;
        if (isQuietNow(user)) {
            logger.debug('[alertDispatcher] Skipping user (quiet hours)', { uid: doc.id });
            return;
        }
        tokenToUid.set(user.fcmToken, doc.id);
    });

    const tokens = Array.from(tokenToUid.keys());
    if (tokens.length === 0) {
        logger.info('[alertDispatcher] All opted-in users are in quiet hours — done');
        return;
    }

    logger.info(`[alertDispatcher] Sending to ${tokens.length} device(s)`);

    // Generate AI alert text
    const { title, body } = await generateAlertText(after, secretValue);
    logger.info('[alertDispatcher] Alert text generated', { title, body });

    // Fan out via FCM
    const messaging = getMessaging();
    // Send in chunks of 500 (FCM multicast limit)
    const CHUNK = 500;
    for (let i = 0; i < tokens.length; i += CHUNK) {
        const chunk = tokens.slice(i, i + CHUNK);
        const chunkMap = new Map(chunk.map(t => [t, tokenToUid.get(t)!]));

        const batchResponse = await messaging.sendEachForMulticast({
            tokens: chunk,
            notification: { title, body },
            android: {
                notification: {
                    channelId: 'matchday-alerts',
                    priority: 'high',
                    color: '#e94560',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        });

        logger.info('[alertDispatcher] Batch sent', {
            successCount: batchResponse.successCount,
            failureCount: batchResponse.failureCount,
        });

        if (batchResponse.failureCount > 0) {
            await pruneInvalidTokens(chunkMap, batchResponse);
        }
    }
}
