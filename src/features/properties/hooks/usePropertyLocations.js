import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPropertyLocation,
  getPropertyLocation,
  updatePropertyLocation,
} from "../api/propertyLocations.api.js";

export const usePropertyLocation = (propertyId) => {
  return useQuery({
    queryKey: ["propertyLocation", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyLocation(propertyId);
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

export const useSavePropertyLocation = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const payload = variables.payload || variables;
      const isUpdate = variables.isUpdate;

      if (isUpdate) {
        return updatePropertyLocation(propertyId, payload);
      }
      return createPropertyLocation(propertyId, payload);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyLocation", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};
