// footballApi.ts
// Thin wrapper around football-data.org v4 API.
// Fetches all matches for a given competition and maps them
// to the MatchDoc shape used by the Firestore `matches` collection.

import fetch from "node-fetch";

const BASE_URL = "https://api.football-data.org/v4";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MatchStatus = "scheduled" | "live" | "finished";

export interface MatchDoc {
    homeTeam: string;
    awayTeam: string;
    homeFlag: string;
    awayFlag: string;
    kickoffUtc: string;
    venue: string;
    city: string;
    stage: string;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    apiId: number;    // football-data.org match ID — used as Firestore doc ID
}

// Raw types from football-data.org v4
interface RawTeam { name: string; shortName: string; crest?: string; }
interface RawScore {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
}
interface RawMatch {
    id: number;
    status: string;         // TIMED | SCHEDULED | IN_PLAY | PAUSED | FINISHED | CANCELLED | POSTPONED
    utcDate: string;
    homeTeam: RawTeam;
    awayTeam: RawTeam;
    score: RawScore;
    stage: string;
    group: string | null;
    venue: string | null;
}
interface RawResponse { matches: RawMatch[]; }

// ─── Country flag emoji lookup ────────────────────────────────────────────────
// Covers all 48 qualified nations (expanded as qualifiers complete).
const FLAG: Record<string, string> = {
    "Argentina": "🇦🇷", "Australia": "🇦🇺", "Belgium": "🇧🇪", "Brazil": "🇧🇷",
    "Cameroon": "🇨🇲", "Canada": "🇨🇦", "Chile": "🇨🇱", "Colombia": "🇨🇴",
    "Costa Rica": "🇨🇷", "Croatia": "🇭🇷", "Denmark": "🇩🇰", "Ecuador": "🇪🇨",
    "Egypt": "🇪🇬", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "France": "🇫🇷", "Germany": "🇩🇪",
    "Ghana": "🇬🇭", "Honduras": "🇭🇳", "Hungary": "🇭🇺", "Iran": "🇮🇷",
    "Italy": "🇮🇹", "Japan": "🇯🇵", "Mexico": "🇲🇽", "Morocco": "🇲🇦",
    "Netherlands": "🇳🇱", "New Zealand": "🇳🇿", "Nigeria": "🇳🇬", "Panama": "🇵🇦",
    "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Poland": "🇵🇱", "Portugal": "🇵🇹",
    "Qatar": "🇶🇦", "Romania": "🇷🇴", "Saudi Arabia": "🇸🇦", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "Senegal": "🇸🇳", "Serbia": "🇷🇸", "Slovakia": "🇸🇰", "South Korea": "🇰🇷",
    "Spain": "🇪🇸", "Switzerland": "🇨🇭", "Tunisia": "🇹🇳", "Turkey": "🇹🇷",
    "Ukraine": "🇺🇦", "United States": "🇺🇸", "Uruguay": "🇺🇾", "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

function flagFor(name: string): string {
    return FLAG[name] ?? "🏳";
}

// ─── Status mapping ───────────────────────────────────────────────────────────
function mapStatus(raw: string): MatchStatus {
    switch (raw) {
        case "IN_PLAY":
        case "PAUSED":
        case "HALFTIME":
            return "live";
        case "FINISHED":
        case "AWARDED":
            return "finished";
        default:
            return "scheduled";
    }
}

// ─── Stage label ──────────────────────────────────────────────────────────────
function stageLabel(stage: string, group: string | null): string {
    if (group) return `Group ${group.replace("GROUP_", "")}`;
    return stage
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Main fetch ───────────────────────────────────────────────────────────────
export async function fetchMatches(
    competitionCode: string,
    apiKey: string,
): Promise<MatchDoc[]> {
    const url = `${BASE_URL}/competitions/${competitionCode}/matches`;

    const res = await fetch(url, {
        headers: { "X-Auth-Token": apiKey },
    });

    if (!res.ok) {
        throw new Error(
            `football-data.org API error ${res.status}: ${await res.text()}`,
        );
    }

    const body = (await res.json()) as RawResponse;

    return body.matches
        .filter((m) => !["CANCELLED", "POSTPONED", "SUSPENDED"].includes(m.status))
        .map((m): MatchDoc => ({
            apiId: m.id,
            homeTeam: m.homeTeam.name,
            awayTeam: m.awayTeam.name,
            homeFlag: flagFor(m.homeTeam.name),
            awayFlag: flagFor(m.awayTeam.name),
            kickoffUtc: m.utcDate,
            venue: m.venue ?? "TBC",
            city: deriveCityFromVenue(m.venue ?? ""),
            stage: stageLabel(m.stage, m.group),
            status: mapStatus(m.status),
            homeScore: m.score.fullTime.home,
            awayScore: m.score.fullTime.away,
        }));
}

// ─── Venue → City mapping ─────────────────────────────────────────────────────
// FIFA World Cup 2026 host city venues.
const VENUE_CITY: Record<string, string> = {
    "MetLife Stadium": "New York / New Jersey",
    "AT&T Stadium": "Dallas",
    "SoFi Stadium": "Los Angeles",
    "Levi's Stadium": "San Francisco",
    "Hard Rock Stadium": "Miami",
    "Gillette Stadium": "Boston",
    "Lincoln Financial Field": "Philadelphia",
    "Arrowhead Stadium": "Kansas City",
    "Seattle Center": "Seattle",
    "NRG Stadium": "Houston",
    "Estadio Azteca": "Mexico City",
    "Estadio Jalisco": "Guadalajara",
    "Estadio BBVA": "Monterrey",
    "BC Place": "Vancouver",
    "BMO Field": "Toronto",
};

function deriveCityFromVenue(venue: string): string {
    for (const [v, city] of Object.entries(VENUE_CITY)) {
        if (venue.includes(v)) return city;
    }
    return venue;
}
