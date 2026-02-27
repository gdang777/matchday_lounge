// User / auth types

import type { City } from './match.js';

export type UserRole = 'fan' | 'restaurant_owner' | 'admin';

export interface UserProfile {
  uid: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  photoUrl?: string;
  role: UserRole;
  city?: City;
  favouriteTeamCode?: string; // e.g. "CAN"
  createdAt: string;
  updatedAt: string;
}
