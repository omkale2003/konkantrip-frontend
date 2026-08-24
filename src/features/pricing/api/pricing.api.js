import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

// Fetch seasonal and promotional rate rules
export const getPricingRates = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.PRICING.ALL_RATES, { params });
  return response.data;
};

// Create a seasonal rate rule for a room
export const createPricingRate = async (data) => {
  const roomId = data.room_id || "all";
  const response = await apiClient.post(API_ENDPOINTS.PRICING.RATES(roomId), data);
  return response.data;
};

// Update an existing rate rule
export const updatePricingRate = async ({ rateId, roomId = "all", data }) => {
  const response = await apiClient.put(API_ENDPOINTS.PRICING.RATE_DETAIL(roomId, rateId), data);
  return response.data;
};

// Delete a rate rule
export const deletePricingRate = async ({ rateId, roomId = "all" }) => {
  const response = await apiClient.delete(API_ENDPOINTS.PRICING.RATE_DETAIL(roomId, rateId));
  return response.data;
};

// Bulk update pricing across multiple rooms (fixed, percentage, discount, extra guests)
export const bulkUpdatePricing = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.PRICING.BULK_UPDATE, payload);
  return response.data;
};

// Bulk create seasonal rates across multiple rooms
export const bulkCreateSeasonalRates = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.PRICING.BULK_SEASONAL, payload);
  return response.data;
};

// Quick update single room pricing
export const updateSingleRoomPrice = async ({ roomId, data }) => {
  const response = await apiClient.put(API_ENDPOINTS.ROOMS.DETAIL(roomId), data);
  return response.data;
};
