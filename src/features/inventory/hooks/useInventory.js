import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryCalendar,
  updateInventoryCalendarDay,
  getRoomInventory,
  getRoomInventoryById,
  upsertRoomInventory,
  deleteRoomInventory,
  getRoomBlocks,
  createRoomBlock,
  releaseRoomBlock,
  cancelRoomBlock,
  getStopSellRules,
  createStopSellRule,
  releaseStopSellRule,
  cancelStopSellRule,
  getInventoryTransactions,
} from "../api/inventory.api.js";

// 1. Calendar
export const useInventoryCalendar = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["inventoryCalendar", params],
    queryFn: () => getInventoryCalendar(params),
    enabled: Boolean(params.start_date && params.end_date) && (options.enabled !== false),
  });
};

export const useUpdateInventoryCalendarDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInventoryCalendarDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

// 2. Room Inventory Setup
export const useRoomInventoryList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["roomInventory", params],
    queryFn: () => getRoomInventory(params),
    enabled: options.enabled !== false,
  });
};

export const useRoomInventoryDetail = (id) => {
  return useQuery({
    queryKey: ["roomInventoryDetail", id],
    queryFn: () => getRoomInventoryById(id),
    enabled: Boolean(id),
  });
};

export const useUpsertRoomInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertRoomInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
    },
  });
};

export const useDeleteRoomInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoomInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomInventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
    },
  });
};

// 3. Room Blocks
export const useRoomBlocksList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["roomBlocks", params],
    queryFn: () => getRoomBlocks(params),
    enabled: options.enabled !== false,
  });
};

export const useCreateRoomBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoomBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomBlocks"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

export const useReleaseRoomBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: releaseRoomBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomBlocks"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

export const useCancelRoomBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelRoomBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomBlocks"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

// 4. Stop Sell Rules
export const useStopSellList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["stopSellRules", params],
    queryFn: () => getStopSellRules(params),
    enabled: options.enabled !== false,
  });
};

export const useCreateStopSellRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStopSellRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stopSellRules"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

export const useReleaseStopSellRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: releaseStopSellRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stopSellRules"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

export const useCancelStopSellRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelStopSellRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stopSellRules"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
};

// 5. Transactions
export const useInventoryTransactionsList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["inventoryTransactions", params],
    queryFn: () => getInventoryTransactions(params),
    enabled: options.enabled !== false,
  });
};
