const { createRestaurantRef, updateRestaurantRef, createPromotionRef, updatePromotionRef, togglePromotionActiveRef, recordVenueViewRef, saveVenueRef, getRestaurantsByCityRef, getActivePromotionsByRestaurantRef, getActiveHappyHoursNowRef, getPendingApprovalRestaurantsRef, getPendingApprovalPromotionsRef, getRestaurantAnalyticsRef, connectorConfig } = require('../index.cjs.js');
const { validateArgs, CallerSdkTypeEnum } = require('firebase/data-connect');
const { useDataConnectQuery, useDataConnectMutation, validateReactArgs } = require('@tanstack-query-firebase/react/data-connect');

exports.useCreateRestaurant = function useCreateRestaurant(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return createRestaurantRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useUpdateRestaurant = function useUpdateRestaurant(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return updateRestaurantRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useCreatePromotion = function useCreatePromotion(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return createPromotionRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useUpdatePromotion = function useUpdatePromotion(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return updatePromotionRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useTogglePromotionActive = function useTogglePromotionActive(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return togglePromotionActiveRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useRecordVenueView = function useRecordVenueView(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return recordVenueViewRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useSaveVenue = function useSaveVenue(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return saveVenueRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}


exports.useGetRestaurantsByCity = function useGetRestaurantsByCity(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getRestaurantsByCityRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useGetActivePromotionsByRestaurant = function useGetActivePromotionsByRestaurant(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getActivePromotionsByRestaurantRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useGetActiveHappyHoursNow = function useGetActiveHappyHoursNow(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getActiveHappyHoursNowRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useGetPendingApprovalRestaurants = function useGetPendingApprovalRestaurants(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = getPendingApprovalRestaurantsRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useGetPendingApprovalPromotions = function useGetPendingApprovalPromotions(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = getPendingApprovalPromotionsRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

exports.useGetRestaurantAnalytics = function useGetRestaurantAnalytics(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getRestaurantAnalyticsRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}