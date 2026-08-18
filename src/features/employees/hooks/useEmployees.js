import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignProperty,
  unassignProperty,
  getPropertyEmployees,
} from "../api/employees.api.js";

export const EMPLOYEE_KEYS = {
  all: ["employees"],
  lists: () => [...EMPLOYEE_KEYS.all, "list"],
  list: (params) => [...EMPLOYEE_KEYS.lists(), params],
  details: () => [...EMPLOYEE_KEYS.all, "detail"],
  detail: (id) => [...EMPLOYEE_KEYS.details(), id],
  propertyEmployees: (propertyId) => [
    ...EMPLOYEE_KEYS.all,
    "property",
    propertyId,
  ],
};

/**
 * Hook to fetch employees list
 */
export const useEmployees = (params = {}) => {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.list(params),
    queryFn: () => getEmployees(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch a single employee by ID
 */
export const useEmployee = (id) => {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id),
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch property employees
 */
export const usePropertyEmployees = (propertyId) => {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.propertyEmployees(propertyId),
    queryFn: () => getPropertyEmployees(propertyId),
    enabled: Boolean(propertyId),
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to create employee
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
    },
  });
};

/**
 * Hook to update employee
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: EMPLOYEE_KEYS.detail(variables.id),
        });
      }
    },
  });
};

/**
 * Hook to delete employee
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
    },
  });
};

/**
 * Hook to assign property to employee
 */
export const useAssignProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignProperty,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: EMPLOYEE_KEYS.detail(variables.id),
        });
      }
    },
  });
};

/**
 * Hook to unassign property from employee
 */
export const useUnassignProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unassignProperty,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: EMPLOYEE_KEYS.detail(variables.id),
        });
      }
    },
  });
};
