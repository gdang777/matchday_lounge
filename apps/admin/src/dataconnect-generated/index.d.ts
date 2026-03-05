import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum BoostTier {
  STANDARD = "STANDARD",
  FEATURED = "FEATURED",
  PREMIUM = "PREMIUM",
};

export enum City {
  VANCOUVER = "VANCOUVER",
  TORONTO = "TORONTO",
};

export enum DealType {
  DRINKS = "DRINKS",
  FOOD = "FOOD",
  BOTH = "BOTH",
};

export enum PromotionSource {
  PARTNER = "PARTNER",
  SCRAPED = "SCRAPED",
  USER_SUBMITTED = "USER_SUBMITTED",
};

export enum ViewType {
  LISTING = "LISTING",
  PROFILE = "PROFILE",
  MAP_PIN = "MAP_PIN",
};



export interface CreatePromotionData {
  promotion_insert: Promotion_Key;
}

export interface CreatePromotionVariables {
  restaurantId: UUIDString;
  name: string;
  description: string;
  dealType: DealType;
  daysOfWeek: string;
  startTime: string;
  endTime: string;
  source: PromotionSource;
  isApproved: boolean;
  submittedByUserId?: string | null;
}

export interface CreateRestaurantData {
  restaurant_insert: Restaurant_Key;
}

export interface CreateRestaurantVariables {
  ownerUserId: string;
  name: string;
  description?: string | null;
  city: City;
  neighborhood?: string | null;
  address?: string | null;
  cuisineType?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
  photoUrls?: string | null;
}

export interface GetActiveHappyHoursNowData {
  promotions: ({
    id: UUIDString;
    name: string;
    description: string;
    dealType: DealType;
    startTime: string;
    endTime: string;
    daysOfWeek: string;
    restaurant: {
      id: UUIDString;
      name: string;
      address?: string | null;
      neighborhood?: string | null;
      city: City;
      boostTier: BoostTier;
      photoUrls?: string | null;
      googleMapsUrl?: string | null;
      isVerified: boolean;
    } & Restaurant_Key;
  } & Promotion_Key)[];
}

export interface GetActiveHappyHoursNowVariables {
  city: City;
  currentDay: string;
  currentTime: string;
}

export interface GetActivePromotionsByRestaurantData {
  promotions: ({
    id: UUIDString;
    name: string;
    description: string;
    dealType: DealType;
    daysOfWeek: string;
    startTime: string;
    endTime: string;
    source: PromotionSource;
  } & Promotion_Key)[];
}

export interface GetActivePromotionsByRestaurantVariables {
  restaurantId: UUIDString;
}

export interface GetPendingApprovalPromotionsData {
  promotions: ({
    id: UUIDString;
    name: string;
    description: string;
    dealType: DealType;
    daysOfWeek: string;
    startTime: string;
    endTime: string;
    source: PromotionSource;
    submittedByUserId?: string | null;
    flagCount: number;
    createdAt: TimestampString;
    restaurant: {
      id: UUIDString;
      name: string;
      city: City;
      neighborhood?: string | null;
    } & Restaurant_Key;
  } & Promotion_Key)[];
}

export interface GetPendingApprovalRestaurantsData {
  restaurants: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    city: City;
    neighborhood?: string | null;
    address?: string | null;
    cuisineType?: string | null;
    phoneNumber?: string | null;
    website?: string | null;
    ownerUserId: string;
    createdAt: TimestampString;
  } & Restaurant_Key)[];
}

export interface GetRestaurantAnalyticsData {
  venueViews: ({
    id: UUIDString;
    viewType: ViewType;
    city: City;
    userId?: string | null;
    createdAt: TimestampString;
  } & VenueView_Key)[];
}

export interface GetRestaurantAnalyticsVariables {
  restaurantId: UUIDString;
  startDate: TimestampString;
  endDate: TimestampString;
}

export interface GetRestaurantsByCityData {
  restaurants: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    city: City;
    neighborhood?: string | null;
    address?: string | null;
    cuisineType?: string | null;
    phoneNumber?: string | null;
    website?: string | null;
    googleMapsUrl?: string | null;
    photoUrls?: string | null;
    boostTier: BoostTier;
    isVerified: boolean;
  } & Restaurant_Key)[];
}

export interface GetRestaurantsByCityVariables {
  city: City;
}

export interface Promotion_Key {
  id: UUIDString;
  __typename?: 'Promotion_Key';
}

export interface RecordVenueViewData {
  venueView_insert: VenueView_Key;
}

export interface RecordVenueViewVariables {
  restaurantId: UUIDString;
  userId?: string | null;
  viewType: ViewType;
  city: City;
}

export interface Restaurant_Key {
  id: UUIDString;
  __typename?: 'Restaurant_Key';
}

export interface SaveVenueData {
  userSavedVenue_insert: UserSavedVenue_Key;
}

export interface SaveVenueVariables {
  restaurantId: UUIDString;
}

export interface TogglePromotionActiveData {
  promotion_update?: Promotion_Key | null;
}

export interface TogglePromotionActiveVariables {
  id: UUIDString;
  isActive: boolean;
}

export interface UpdatePromotionData {
  promotion_update?: Promotion_Key | null;
}

export interface UpdatePromotionVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  dealType?: DealType | null;
  daysOfWeek?: string | null;
  startTime?: string | null;
  endTime?: string | null;
}

export interface UpdateRestaurantData {
  restaurant_update?: Restaurant_Key | null;
}

export interface UpdateRestaurantVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  neighborhood?: string | null;
  address?: string | null;
  cuisineType?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  googleMapsUrl?: string | null;
  photoUrls?: string | null;
}

export interface UserSavedVenue_Key {
  id: UUIDString;
  __typename?: 'UserSavedVenue_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface VenueView_Key {
  id: UUIDString;
  __typename?: 'VenueView_Key';
}

interface CreateRestaurantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRestaurantVariables): MutationRef<CreateRestaurantData, CreateRestaurantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRestaurantVariables): MutationRef<CreateRestaurantData, CreateRestaurantVariables>;
  operationName: string;
}
export const createRestaurantRef: CreateRestaurantRef;

export function createRestaurant(vars: CreateRestaurantVariables): MutationPromise<CreateRestaurantData, CreateRestaurantVariables>;
export function createRestaurant(dc: DataConnect, vars: CreateRestaurantVariables): MutationPromise<CreateRestaurantData, CreateRestaurantVariables>;

interface UpdateRestaurantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRestaurantVariables): MutationRef<UpdateRestaurantData, UpdateRestaurantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRestaurantVariables): MutationRef<UpdateRestaurantData, UpdateRestaurantVariables>;
  operationName: string;
}
export const updateRestaurantRef: UpdateRestaurantRef;

export function updateRestaurant(vars: UpdateRestaurantVariables): MutationPromise<UpdateRestaurantData, UpdateRestaurantVariables>;
export function updateRestaurant(dc: DataConnect, vars: UpdateRestaurantVariables): MutationPromise<UpdateRestaurantData, UpdateRestaurantVariables>;

interface CreatePromotionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePromotionVariables): MutationRef<CreatePromotionData, CreatePromotionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePromotionVariables): MutationRef<CreatePromotionData, CreatePromotionVariables>;
  operationName: string;
}
export const createPromotionRef: CreatePromotionRef;

export function createPromotion(vars: CreatePromotionVariables): MutationPromise<CreatePromotionData, CreatePromotionVariables>;
export function createPromotion(dc: DataConnect, vars: CreatePromotionVariables): MutationPromise<CreatePromotionData, CreatePromotionVariables>;

interface UpdatePromotionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePromotionVariables): MutationRef<UpdatePromotionData, UpdatePromotionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePromotionVariables): MutationRef<UpdatePromotionData, UpdatePromotionVariables>;
  operationName: string;
}
export const updatePromotionRef: UpdatePromotionRef;

export function updatePromotion(vars: UpdatePromotionVariables): MutationPromise<UpdatePromotionData, UpdatePromotionVariables>;
export function updatePromotion(dc: DataConnect, vars: UpdatePromotionVariables): MutationPromise<UpdatePromotionData, UpdatePromotionVariables>;

interface TogglePromotionActiveRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TogglePromotionActiveVariables): MutationRef<TogglePromotionActiveData, TogglePromotionActiveVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TogglePromotionActiveVariables): MutationRef<TogglePromotionActiveData, TogglePromotionActiveVariables>;
  operationName: string;
}
export const togglePromotionActiveRef: TogglePromotionActiveRef;

export function togglePromotionActive(vars: TogglePromotionActiveVariables): MutationPromise<TogglePromotionActiveData, TogglePromotionActiveVariables>;
export function togglePromotionActive(dc: DataConnect, vars: TogglePromotionActiveVariables): MutationPromise<TogglePromotionActiveData, TogglePromotionActiveVariables>;

interface RecordVenueViewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordVenueViewVariables): MutationRef<RecordVenueViewData, RecordVenueViewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordVenueViewVariables): MutationRef<RecordVenueViewData, RecordVenueViewVariables>;
  operationName: string;
}
export const recordVenueViewRef: RecordVenueViewRef;

export function recordVenueView(vars: RecordVenueViewVariables): MutationPromise<RecordVenueViewData, RecordVenueViewVariables>;
export function recordVenueView(dc: DataConnect, vars: RecordVenueViewVariables): MutationPromise<RecordVenueViewData, RecordVenueViewVariables>;

interface SaveVenueRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveVenueVariables): MutationRef<SaveVenueData, SaveVenueVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SaveVenueVariables): MutationRef<SaveVenueData, SaveVenueVariables>;
  operationName: string;
}
export const saveVenueRef: SaveVenueRef;

export function saveVenue(vars: SaveVenueVariables): MutationPromise<SaveVenueData, SaveVenueVariables>;
export function saveVenue(dc: DataConnect, vars: SaveVenueVariables): MutationPromise<SaveVenueData, SaveVenueVariables>;

interface GetRestaurantsByCityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRestaurantsByCityVariables): QueryRef<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRestaurantsByCityVariables): QueryRef<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
  operationName: string;
}
export const getRestaurantsByCityRef: GetRestaurantsByCityRef;

export function getRestaurantsByCity(vars: GetRestaurantsByCityVariables): QueryPromise<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
export function getRestaurantsByCity(dc: DataConnect, vars: GetRestaurantsByCityVariables): QueryPromise<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;

interface GetActivePromotionsByRestaurantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivePromotionsByRestaurantVariables): QueryRef<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActivePromotionsByRestaurantVariables): QueryRef<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
  operationName: string;
}
export const getActivePromotionsByRestaurantRef: GetActivePromotionsByRestaurantRef;

export function getActivePromotionsByRestaurant(vars: GetActivePromotionsByRestaurantVariables): QueryPromise<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
export function getActivePromotionsByRestaurant(dc: DataConnect, vars: GetActivePromotionsByRestaurantVariables): QueryPromise<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;

interface GetActiveHappyHoursNowRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveHappyHoursNowVariables): QueryRef<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveHappyHoursNowVariables): QueryRef<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
  operationName: string;
}
export const getActiveHappyHoursNowRef: GetActiveHappyHoursNowRef;

export function getActiveHappyHoursNow(vars: GetActiveHappyHoursNowVariables): QueryPromise<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
export function getActiveHappyHoursNow(dc: DataConnect, vars: GetActiveHappyHoursNowVariables): QueryPromise<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;

interface GetPendingApprovalRestaurantsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPendingApprovalRestaurantsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPendingApprovalRestaurantsData, undefined>;
  operationName: string;
}
export const getPendingApprovalRestaurantsRef: GetPendingApprovalRestaurantsRef;

export function getPendingApprovalRestaurants(): QueryPromise<GetPendingApprovalRestaurantsData, undefined>;
export function getPendingApprovalRestaurants(dc: DataConnect): QueryPromise<GetPendingApprovalRestaurantsData, undefined>;

interface GetPendingApprovalPromotionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPendingApprovalPromotionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPendingApprovalPromotionsData, undefined>;
  operationName: string;
}
export const getPendingApprovalPromotionsRef: GetPendingApprovalPromotionsRef;

export function getPendingApprovalPromotions(): QueryPromise<GetPendingApprovalPromotionsData, undefined>;
export function getPendingApprovalPromotions(dc: DataConnect): QueryPromise<GetPendingApprovalPromotionsData, undefined>;

interface GetRestaurantAnalyticsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRestaurantAnalyticsVariables): QueryRef<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRestaurantAnalyticsVariables): QueryRef<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
  operationName: string;
}
export const getRestaurantAnalyticsRef: GetRestaurantAnalyticsRef;

export function getRestaurantAnalytics(vars: GetRestaurantAnalyticsVariables): QueryPromise<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
export function getRestaurantAnalytics(dc: DataConnect, vars: GetRestaurantAnalyticsVariables): QueryPromise<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;

