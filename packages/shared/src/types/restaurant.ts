// Restaurant / venue types

import type { City } from './match.js';

export type RestaurantStatus = 'pending' | 'approved' | 'suspended';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Hours {
  open: string;  // "HH:MM"
  close: string; // "HH:MM"
}

export interface Restaurant {
  id: string;
  ownerId: string; // Firebase Auth UID
  name: string;
  city: City;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  description?: string;
  cuisineTypes: string[];
  hasOutdoorSeating: boolean;
  hasPrivateRoom: boolean;
  screenCount: number;
  capacity: number;
  hours: Partial<Record<DayOfWeek, Hours>>;
  status: RestaurantStatus;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantMatchEvent {
  id: string;
  restaurantId: string;
  matchId: string;
  specialMenu?: string;
  specialPromo?: string;
  reservationRequired: boolean;
  reservationUrl?: string;
}
