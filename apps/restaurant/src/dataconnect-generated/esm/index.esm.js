import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const BoostTier = {
  STANDARD: "STANDARD",
  FEATURED: "FEATURED",
  PREMIUM: "PREMIUM",
}

export const City = {
  VANCOUVER: "VANCOUVER",
  TORONTO: "TORONTO",
}

export const DealType = {
  DRINKS: "DRINKS",
  FOOD: "FOOD",
  BOTH: "BOTH",
}

export const PromotionSource = {
  PARTNER: "PARTNER",
  SCRAPED: "SCRAPED",
  USER_SUBMITTED: "USER_SUBMITTED",
}

export const ViewType = {
  LISTING: "LISTING",
  PROFILE: "PROFILE",
  MAP_PIN: "MAP_PIN",
}

export const connectorConfig = {
  connector: 'matchday',
  service: 'matchdaylounge',
  location: 'us-east4'
};

export const createRestaurantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRestaurant', inputVars);
}
createRestaurantRef.operationName = 'CreateRestaurant';

export function createRestaurant(dcOrVars, vars) {
  return executeMutation(createRestaurantRef(dcOrVars, vars));
}

export const updateRestaurantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRestaurant', inputVars);
}
updateRestaurantRef.operationName = 'UpdateRestaurant';

export function updateRestaurant(dcOrVars, vars) {
  return executeMutation(updateRestaurantRef(dcOrVars, vars));
}

export const createPromotionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePromotion', inputVars);
}
createPromotionRef.operationName = 'CreatePromotion';

export function createPromotion(dcOrVars, vars) {
  return executeMutation(createPromotionRef(dcOrVars, vars));
}

export const updatePromotionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePromotion', inputVars);
}
updatePromotionRef.operationName = 'UpdatePromotion';

export function updatePromotion(dcOrVars, vars) {
  return executeMutation(updatePromotionRef(dcOrVars, vars));
}

export const togglePromotionActiveRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TogglePromotionActive', inputVars);
}
togglePromotionActiveRef.operationName = 'TogglePromotionActive';

export function togglePromotionActive(dcOrVars, vars) {
  return executeMutation(togglePromotionActiveRef(dcOrVars, vars));
}

export const recordVenueViewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordVenueView', inputVars);
}
recordVenueViewRef.operationName = 'RecordVenueView';

export function recordVenueView(dcOrVars, vars) {
  return executeMutation(recordVenueViewRef(dcOrVars, vars));
}

export const saveVenueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SaveVenue', inputVars);
}
saveVenueRef.operationName = 'SaveVenue';

export function saveVenue(dcOrVars, vars) {
  return executeMutation(saveVenueRef(dcOrVars, vars));
}

export const getRestaurantsByCityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRestaurantsByCity', inputVars);
}
getRestaurantsByCityRef.operationName = 'GetRestaurantsByCity';

export function getRestaurantsByCity(dcOrVars, vars) {
  return executeQuery(getRestaurantsByCityRef(dcOrVars, vars));
}

export const getActivePromotionsByRestaurantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivePromotionsByRestaurant', inputVars);
}
getActivePromotionsByRestaurantRef.operationName = 'GetActivePromotionsByRestaurant';

export function getActivePromotionsByRestaurant(dcOrVars, vars) {
  return executeQuery(getActivePromotionsByRestaurantRef(dcOrVars, vars));
}

export const getActiveHappyHoursNowRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveHappyHoursNow', inputVars);
}
getActiveHappyHoursNowRef.operationName = 'GetActiveHappyHoursNow';

export function getActiveHappyHoursNow(dcOrVars, vars) {
  return executeQuery(getActiveHappyHoursNowRef(dcOrVars, vars));
}

export const getPendingApprovalRestaurantsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPendingApprovalRestaurants');
}
getPendingApprovalRestaurantsRef.operationName = 'GetPendingApprovalRestaurants';

export function getPendingApprovalRestaurants(dc) {
  return executeQuery(getPendingApprovalRestaurantsRef(dc));
}

export const getPendingApprovalPromotionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPendingApprovalPromotions');
}
getPendingApprovalPromotionsRef.operationName = 'GetPendingApprovalPromotions';

export function getPendingApprovalPromotions(dc) {
  return executeQuery(getPendingApprovalPromotionsRef(dc));
}

export const getRestaurantAnalyticsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRestaurantAnalytics', inputVars);
}
getRestaurantAnalyticsRef.operationName = 'GetRestaurantAnalytics';

export function getRestaurantAnalytics(dcOrVars, vars) {
  return executeQuery(getRestaurantAnalyticsRef(dcOrVars, vars));
}

