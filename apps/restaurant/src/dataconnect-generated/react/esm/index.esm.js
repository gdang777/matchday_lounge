import { createRestaurantRef, updateRestaurantRef, createPromotionRef, updatePromotionRef, togglePromotionActiveRef, recordVenueViewRef, saveVenueRef, getRestaurantsByCityRef, getActivePromotionsByRestaurantRef, getActiveHappyHoursNowRef, getPendingApprovalRestaurantsRef, getPendingApprovalPromotionsRef, getRestaurantAnalyticsRef, connectorConfig } from '../../esm/index.esm.js';
import { validateArgs, CallerSdkTypeEnum } from 'firebase/data-connect';
import { useDataConnectQuery, useDataConnectMutation, validateReactArgs } from '@tanstack-query-firebase/react/data-connect';

export function useCreateRestaurant(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return createRestaurantRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useUpdateRestaurant(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return updateRestaurantRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useCreatePromotion(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return createPromotionRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useUpdatePromotion(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return updatePromotionRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useTogglePromotionActive(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return togglePromotionActiveRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useRecordVenueView(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return recordVenueViewRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useSaveVenue(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return saveVenueRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}


export function useGetRestaurantsByCity(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getRestaurantsByCityRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useGetActivePromotionsByRestaurant(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getActivePromotionsByRestaurantRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useGetActiveHappyHoursNow(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getActiveHappyHoursNowRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useGetPendingApprovalRestaurants(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = getPendingApprovalRestaurantsRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useGetPendingApprovalPromotions(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = getPendingApprovalPromotionsRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}

export function useGetRestaurantAnalytics(dcOrVars, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateReactArgs(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  const ref = getRestaurantAnalyticsRef(dcInstance, inputVars);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}