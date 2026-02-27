// FIFA World Cup 2026 Match types

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
export type MatchStage = 'group' | 'round_of_32' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'third_place' | 'final';
export type City = 'Vancouver' | 'Toronto';

export interface Team {
  id: string;
  name: string;
  code: string; // e.g. "CAN", "BRA"
  flagUrl: string;
  group?: string; // e.g. "A", "B"
}

export interface MatchScore {
  home: number;
  away: number;
  homePenalty?: number;
  awayPenalty?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoffUtc: string; // ISO 8601
  venue: string;
  city: City;
  stage: MatchStage;
  group?: string;
  status: MatchStatus;
  score?: MatchScore;
  createdAt: string;
  updatedAt: string;
}
