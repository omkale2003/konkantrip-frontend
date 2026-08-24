import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys.js";
import {
  getPricingRates,
  createPricingRate,
  updatePricingRate,
  deletePricingRate,
  bulkUpdatePricing,
  bulkCreateSeasonalRates,
  updateSingleRoomPrice,
} from "../api/pricing.api.js";

// Fetch seasonal and promotional rate rules
export const usePricingRates = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING.RATES(params),
    queryFn: () => getPricingRates(params),
    enabled: params.enabled !== false,
  });
};

// Create a seasonal rate rule
export const useCreatePricingRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPricingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRICING.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.ALL });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
    },
  });
};

// Update a seasonal rate rule
export const useUpdatePricingRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePricingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRICING.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.ALL });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
    },
  });
};

// Delete a seasonal rate rule
export const useDeletePricingRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePricingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRICING.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.ALL });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
    },
  });
};

// Bulk Update Room Pricing (Base price, discounts, percentages, extra charges)
export const useBulkUpdatePricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUpdatePricing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRICING.ALL });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
    },
  });
};

// Bulk Create Seasonal Rates across multiple rooms
export const useBulkCreateSeasonalRates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkCreateSeasonalRates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRICING.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.ALL });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
    },
  });
};

// Quick Update Single Room Price
export const useUpdateSingleRoomPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSingleRoomPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRICING.ALL });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
    },
  });
};
