import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPropertyPolicies,
  savePropertyPolicies,
} from "../api/propertyPolicies.api.js";

export const usePropertyPolicies = (propertyId) => {
  return useQuery({
    queryKey: ["propertyPolicies", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyPolicies(propertyId);
      } catch (error) {
        if (error?.response?.status === 404) {
          return { success: true, data: null };
        }
        throw error;
      }
    },
    enabled: Boolean(propertyId),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

export const useSavePropertyPolicies = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const payload = variables.payload || variables;
      return savePropertyPolicies(propertyId, payload);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyPolicies", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};
