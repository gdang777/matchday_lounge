// firestoreWriter.ts
// Syncs an array of MatchDoc objects to the Firestore `matches` collection.
//
// Strategy:
//   • Document ID = `match-{apiId}` (stable, avoids duplicates)
//   • Only writes documents that have actually changed (status, scores)
//   • Uses batched writes (max 500 per batch) to stay within Firestore limits
//   • Returns a summary of how many were written vs. skipped

import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { type MatchDoc } from "./footballApi";

const BATCH_SIZE = 400; // stay well below 500 limit

export interface SyncSummary {
    total: number;
    written: number;
    skipped: number;
}

export async function syncMatchesToFirestore(
    matches: MatchDoc[],
): Promise<SyncSummary> {
    const db = getFirestore();
    const col = db.collection("matches");

    let written = 0;
    let skipped = 0;

    // Process in chunks to respect batch size limits
    for (let i = 0; i < matches.length; i += BATCH_SIZE) {
        const chunk = matches.slice(i, i + BATCH_SIZE);
        const batch = db.batch();
        let batchHasWrites = false;

        // Fetch current snapshots for this chunk in parallel
        const refs = chunk.map((m) => col.doc(`match-${m.apiId}`));
        const snaps = await db.getAll(...refs);

        for (let j = 0; j < chunk.length; j++) {
            const match = chunk[j];
            const snap = snaps[j];
            const ref = refs[j];

            if (snap.exists) {
                const existing = snap.data() as Partial<MatchDoc>;
                // Skip if nothing material has changed
                if (
                    existing.status === match.status &&
                    existing.homeScore === match.homeScore &&
                    existing.awayScore === match.awayScore
                ) {
                    skipped++;
                    continue;
                }
            }

            batch.set(
                ref,
                {
                    ...match,
                    updatedAt: FieldValue.serverTimestamp(),
                },
                { merge: true },
            );
            batchHasWrites = true;
            written++;
        }

        if (batchHasWrites) {
            await batch.commit();
        }
    }

    return { total: matches.length, written, skipped };
}
