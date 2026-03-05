const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const BoostTier = {
  STANDARD: "STANDARD",
  FEATURED: "FEATURED",
  PREMIUM: "PREMIUM",
}
exports.BoostTier = BoostTier;

const City = {
  VANCOUVER: "VANCOUVER",
  TORONTO: "TORONTO",
}
exports.City = City;

const DealType = {
  DRINKS: "DRINKS",
  FOOD: "FOOD",
  BOTH: "BOTH",
}
exports.DealType = DealType;

const PromotionSource = {
  PARTNER: "PARTNER",
  SCRAPED: "SCRAPED",
  USER_SUBMITTED: "USER_SUBMITTED",
}
exports.PromotionSource = PromotionSource;

const ViewType = {
  LISTING: "LISTING",
  PROFILE: "PROFILE",
  MAP_PIN: "MAP_PIN",
}
exports.ViewType = ViewType;

const connectorConfig = {
  connector: 'matchday',
  service: 'matchdaylounge',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createRestaurantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRestaurant', inputVars);
}
createRestaurantRef.operationName = 'CreateRestaurant';
exports.createRestaurantRef = createRestaurantRef;

exports.createRestaurant = function createRestaurant(dcOrVars, vars) {
  return executeMutation(createRestaurantRef(dcOrVars, vars));
};

const updateRestaurantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRestaurant', inputVars);
}
updateRestaurantRef.operationName = 'UpdateRestaurant';
exports.updateRestaurantRef = updateRestaurantRef;

exports.updateRestaurant = function updateRestaurant(dcOrVars, vars) {
  return executeMutation(updateRestaurantRef(dcOrVars, vars));
};

const createPromotionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePromotion', inputVars);
}
createPromotionRef.operationName = 'CreatePromotion';
exports.createPromotionRef = createPromotionRef;

exports.createPromotion = function createPromotion(dcOrVars, vars) {
  return executeMutation(createPromotionRef(dcOrVars, vars));
};

const updatePromotionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePromotion', inputVars);
}
updatePromotionRef.operationName = 'UpdatePromotion';
exports.updatePromotionRef = updatePromotionRef;

exports.updatePromotion = function updatePromotion(dcOrVars, vars) {
  return executeMutation(updatePromotionRef(dcOrVars, vars));
};

const togglePromotionActiveRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TogglePromotionActive', inputVars);
}
togglePromotionActiveRef.operationName = 'TogglePromotionActive';
exports.togglePromotionActiveRef = togglePromotionActiveRef;

exports.togglePromotionActive = function togglePromotionActive(dcOrVars, vars) {
  return executeMutation(togglePromotionActiveRef(dcOrVars, vars));
};

const recordVenueViewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordVenueView', inputVars);
}
recordVenueViewRef.operationName = 'RecordVenueView';
exports.recordVenueViewRef = recordVenueViewRef;

exports.recordVenueView = function recordVenueView(dcOrVars, vars) {
  return executeMutation(recordVenueViewRef(dcOrVars, vars));
};

const saveVenueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SaveVenue', inputVars);
}
saveVenueRef.operationName = 'SaveVenue';
exports.saveVenueRef = saveVenueRef;

exports.saveVenue = function saveVenue(dcOrVars, vars) {
  return executeMutation(saveVenueRef(dcOrVars, vars));
};

const getRestaurantsByCityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRestaurantsByCity', inputVars);
}
getRestaurantsByCityRef.operationName = 'GetRestaurantsByCity';
exports.getRestaurantsByCityRef = getRestaurantsByCityRef;

exports.getRestaurantsByCity = function getRestaurantsByCity(dcOrVars, vars) {
  return executeQuery(getRestaurantsByCityRef(dcOrVars, vars));
};

const getActivePromotionsByRestaurantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivePromotionsByRestaurant', inputVars);
}
getActivePromotionsByRestaurantRef.operationName = 'GetActivePromotionsByRestaurant';
exports.getActivePromotionsByRestaurantRef = getActivePromotionsByRestaurantRef;

exports.getActivePromotionsByRestaurant = function getActivePromotionsByRestaurant(dcOrVars, vars) {
  return executeQuery(getActivePromotionsByRestaurantRef(dcOrVars, vars));
};

const getActiveHappyHoursNowRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveHappyHoursNow', inputVars);
}
getActiveHappyHoursNowRef.operationName = 'GetActiveHappyHoursNow';
exports.getActiveHappyHoursNowRef = getActiveHappyHoursNowRef;

exports.getActiveHappyHoursNow = function getActiveHappyHoursNow(dcOrVars, vars) {
  return executeQuery(getActiveHappyHoursNowRef(dcOrVars, vars));
};

const getPendingApprovalRestaurantsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPendingApprovalRestaurants');
}
getPendingApprovalRestaurantsRef.operationName = 'GetPendingApprovalRestaurants';
exports.getPendingApprovalRestaurantsRef = getPendingApprovalRestaurantsRef;

exports.getPendingApprovalRestaurants = function getPendingApprovalRestaurants(dc) {
  return executeQuery(getPendingApprovalRestaurantsRef(dc));
};

const getPendingApprovalPromotionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPendingApprovalPromotions');
}
getPendingApprovalPromotionsRef.operationName = 'GetPendingApprovalPromotions';
exports.getPendingApprovalPromotionsRef = getPendingApprovalPromotionsRef;

exports.getPendingApprovalPromotions = function getPendingApprovalPromotions(dc) {
  return executeQuery(getPendingApprovalPromotionsRef(dc));
};

const getRestaurantAnalyticsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRestaurantAnalytics', inputVars);
}
getRestaurantAnalyticsRef.operationName = 'GetRestaurantAnalytics';
exports.getRestaurantAnalyticsRef = getRestaurantAnalyticsRef;

exports.getRestaurantAnalytics = function getRestaurantAnalytics(dcOrVars, vars) {
  return executeQuery(getRestaurantAnalyticsRef(dcOrVars, vars));
};
