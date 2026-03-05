import { CreateRestaurantData, CreateRestaurantVariables, UpdateRestaurantData, UpdateRestaurantVariables, CreatePromotionData, CreatePromotionVariables, UpdatePromotionData, UpdatePromotionVariables, TogglePromotionActiveData, TogglePromotionActiveVariables, RecordVenueViewData, RecordVenueViewVariables, SaveVenueData, SaveVenueVariables, GetRestaurantsByCityData, GetRestaurantsByCityVariables, GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables, GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables, GetPendingApprovalRestaurantsData, GetPendingApprovalPromotionsData, GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateRestaurant(options?: useDataConnectMutationOptions<CreateRestaurantData, FirebaseError, CreateRestaurantVariables>): UseDataConnectMutationResult<CreateRestaurantData, CreateRestaurantVariables>;
export function useCreateRestaurant(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRestaurantData, FirebaseError, CreateRestaurantVariables>): UseDataConnectMutationResult<CreateRestaurantData, CreateRestaurantVariables>;

export function useUpdateRestaurant(options?: useDataConnectMutationOptions<UpdateRestaurantData, FirebaseError, UpdateRestaurantVariables>): UseDataConnectMutationResult<UpdateRestaurantData, UpdateRestaurantVariables>;
export function useUpdateRestaurant(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRestaurantData, FirebaseError, UpdateRestaurantVariables>): UseDataConnectMutationResult<UpdateRestaurantData, UpdateRestaurantVariables>;

export function useCreatePromotion(options?: useDataConnectMutationOptions<CreatePromotionData, FirebaseError, CreatePromotionVariables>): UseDataConnectMutationResult<CreatePromotionData, CreatePromotionVariables>;
export function useCreatePromotion(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePromotionData, FirebaseError, CreatePromotionVariables>): UseDataConnectMutationResult<CreatePromotionData, CreatePromotionVariables>;

export function useUpdatePromotion(options?: useDataConnectMutationOptions<UpdatePromotionData, FirebaseError, UpdatePromotionVariables>): UseDataConnectMutationResult<UpdatePromotionData, UpdatePromotionVariables>;
export function useUpdatePromotion(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePromotionData, FirebaseError, UpdatePromotionVariables>): UseDataConnectMutationResult<UpdatePromotionData, UpdatePromotionVariables>;

export function useTogglePromotionActive(options?: useDataConnectMutationOptions<TogglePromotionActiveData, FirebaseError, TogglePromotionActiveVariables>): UseDataConnectMutationResult<TogglePromotionActiveData, TogglePromotionActiveVariables>;
export function useTogglePromotionActive(dc: DataConnect, options?: useDataConnectMutationOptions<TogglePromotionActiveData, FirebaseError, TogglePromotionActiveVariables>): UseDataConnectMutationResult<TogglePromotionActiveData, TogglePromotionActiveVariables>;

export function useRecordVenueView(options?: useDataConnectMutationOptions<RecordVenueViewData, FirebaseError, RecordVenueViewVariables>): UseDataConnectMutationResult<RecordVenueViewData, RecordVenueViewVariables>;
export function useRecordVenueView(dc: DataConnect, options?: useDataConnectMutationOptions<RecordVenueViewData, FirebaseError, RecordVenueViewVariables>): UseDataConnectMutationResult<RecordVenueViewData, RecordVenueViewVariables>;

export function useSaveVenue(options?: useDataConnectMutationOptions<SaveVenueData, FirebaseError, SaveVenueVariables>): UseDataConnectMutationResult<SaveVenueData, SaveVenueVariables>;
export function useSaveVenue(dc: DataConnect, options?: useDataConnectMutationOptions<SaveVenueData, FirebaseError, SaveVenueVariables>): UseDataConnectMutationResult<SaveVenueData, SaveVenueVariables>;

export function useGetRestaurantsByCity(vars: GetRestaurantsByCityVariables, options?: useDataConnectQueryOptions<GetRestaurantsByCityData>): UseDataConnectQueryResult<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;
export function useGetRestaurantsByCity(dc: DataConnect, vars: GetRestaurantsByCityVariables, options?: useDataConnectQueryOptions<GetRestaurantsByCityData>): UseDataConnectQueryResult<GetRestaurantsByCityData, GetRestaurantsByCityVariables>;

export function useGetActivePromotionsByRestaurant(vars: GetActivePromotionsByRestaurantVariables, options?: useDataConnectQueryOptions<GetActivePromotionsByRestaurantData>): UseDataConnectQueryResult<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;
export function useGetActivePromotionsByRestaurant(dc: DataConnect, vars: GetActivePromotionsByRestaurantVariables, options?: useDataConnectQueryOptions<GetActivePromotionsByRestaurantData>): UseDataConnectQueryResult<GetActivePromotionsByRestaurantData, GetActivePromotionsByRestaurantVariables>;

export function useGetActiveHappyHoursNow(vars: GetActiveHappyHoursNowVariables, options?: useDataConnectQueryOptions<GetActiveHappyHoursNowData>): UseDataConnectQueryResult<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;
export function useGetActiveHappyHoursNow(dc: DataConnect, vars: GetActiveHappyHoursNowVariables, options?: useDataConnectQueryOptions<GetActiveHappyHoursNowData>): UseDataConnectQueryResult<GetActiveHappyHoursNowData, GetActiveHappyHoursNowVariables>;

export function useGetPendingApprovalRestaurants(options?: useDataConnectQueryOptions<GetPendingApprovalRestaurantsData>): UseDataConnectQueryResult<GetPendingApprovalRestaurantsData, undefined>;
export function useGetPendingApprovalRestaurants(dc: DataConnect, options?: useDataConnectQueryOptions<GetPendingApprovalRestaurantsData>): UseDataConnectQueryResult<GetPendingApprovalRestaurantsData, undefined>;

export function useGetPendingApprovalPromotions(options?: useDataConnectQueryOptions<GetPendingApprovalPromotionsData>): UseDataConnectQueryResult<GetPendingApprovalPromotionsData, undefined>;
export function useGetPendingApprovalPromotions(dc: DataConnect, options?: useDataConnectQueryOptions<GetPendingApprovalPromotionsData>): UseDataConnectQueryResult<GetPendingApprovalPromotionsData, undefined>;

export function useGetRestaurantAnalytics(vars: GetRestaurantAnalyticsVariables, options?: useDataConnectQueryOptions<GetRestaurantAnalyticsData>): UseDataConnectQueryResult<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
export function useGetRestaurantAnalytics(dc: DataConnect, vars: GetRestaurantAnalyticsVariables, options?: useDataConnectQueryOptions<GetRestaurantAnalyticsData>): UseDataConnectQueryResult<GetRestaurantAnalyticsData, GetRestaurantAnalyticsVariables>;
