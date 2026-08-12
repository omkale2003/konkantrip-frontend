import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAmenitiesLookup,
  getPropertyAmenities,
  setPropertyAmenities,
} from "../api/propertyAmenities.api.js";

export const useMasterAmenities = () => {
  return useQuery({
    queryKey: ["masterAmenitiesLookup"],
    queryFn: async () => {
      try {
        return await getAmenitiesLookup();
      } catch (error) {
        console.error("Failed to fetch master amenities lookup:", error);
        return { success: true, data: [] };
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};

export const usePropertyAmenities = (propertyId) => {
  return useQuery({
    queryKey: ["propertyAmenities", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyAmenities(propertyId);
      } catch (error) {
        if (error?.response?.status === 404) {
          return { success: true, data: [] };
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

export const useSavePropertyAmenities = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const amenities = variables.amenities || variables;
      return setPropertyAmenities(propertyId, amenities);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyAmenities", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};
