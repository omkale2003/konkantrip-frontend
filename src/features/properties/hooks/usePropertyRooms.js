import { useQuery } from "@tanstack/react-query";
import { getPropertyRooms } from "../api/propertyRooms.api.js";

export const usePropertyRooms = (propertyId) => {
  return useQuery({
    queryKey: ["property-rooms", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyRooms(propertyId);
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
