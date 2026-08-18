import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

// 1. Inventory Calendar
export const getInventoryCalendar = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY.CALENDAR, { params });
  return response.data;
};

export const updateInventoryCalendarDay = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.INVENTORY.CALENDAR, payload);
  return response.data;
};

// 2. Room Inventory Setup
export const getRoomInventory = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY.LIST, { params });
  return response.data;
};

export const getRoomInventoryById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY.ROOM_DETAIL(id));
  return response.data;
};

export const upsertRoomInventory = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.INVENTORY.LIST, payload);
  return response.data;
};

export const deleteRoomInventory = async (id) => {
  const response = await apiClient.delete(API_ENDPOINTS.INVENTORY.ROOM_DETAIL(id));
  return response.data;
};

// 3. Room Blocks
export const getRoomBlocks = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY.BLOCKS, { params });
  return response.data;
};

export const createRoomBlock = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.INVENTORY.BLOCKS, payload);
  return response.data;
};

export const releaseRoomBlock = async (blockId) => {
  const response = await apiClient.put(API_ENDPOINTS.INVENTORY.BLOCK_RELEASE(blockId));
  return response.data;
};

export const cancelRoomBlock = async (blockId) => {
  const response = await apiClient.put(API_ENDPOINTS.INVENTORY.BLOCK_CANCEL(blockId));
  return response.data;
};

// 4. Stop Sell Rules
export const getStopSellRules = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY.STOP_SELL, { params });
  return response.data;
};

export const createStopSellRule = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.INVENTORY.STOP_SELL, payload);
  return response.data;
};

export const releaseStopSellRule = async (id) => {
  const response = await apiClient.put(API_ENDPOINTS.INVENTORY.STOP_SELL_RELEASE(id));
  return response.data;
};

export const cancelStopSellRule = async (id) => {
  const response = await apiClient.put(API_ENDPOINTS.INVENTORY.STOP_SELL_CANCEL(id));
  return response.data;
};

// 5. Transactions / Audit Trail
export const getInventoryTransactions = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY.TRANSACTIONS, { params });
  return response.data;
};
