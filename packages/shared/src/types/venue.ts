// FIFA World Cup 2026 Venue / stadium types

import type { City } from './match.js';

export interface Venue {
  id: string;
  name: string;
  city: City;
  capacity: number;
  address: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}
