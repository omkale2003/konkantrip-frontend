import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPermissions,
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../api/roles.api.js";

export const ROLE_KEYS = {
  all: ["roles"],
  lists: () => [...ROLE_KEYS.all, "list"],
  list: (params) => [...ROLE_KEYS.lists(), params],
  details: () => [...ROLE_KEYS.all, "detail"],
  detail: (id) => [...ROLE_KEYS.details(), id],
  permissions: ["permissions"],
};

/**
 * Hook to fetch all system & module permissions
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: ROLE_KEYS.permissions,
    queryFn: getPermissions,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

/**
 * Hook to fetch roles list
 */
export const useRoles = (params = {}) => {
  return useQuery({
    queryKey: ROLE_KEYS.list(params),
    queryFn: () => getRoles(params),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch single role detail with permissions
 */
export const useRole = (id) => {
  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn: () => getRoleById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create custom role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
};

/**
 * Hook to update custom role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: ROLE_KEYS.detail(variables.id),
        });
      }
    },
  });
};

/**
 * Hook to delete custom role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
};
