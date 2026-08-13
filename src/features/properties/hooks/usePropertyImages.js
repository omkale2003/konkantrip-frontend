import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPropertyImage,
  deletePropertyImage,
  getPropertyImages,
  getPropertyImageTypesLookup,
  updatePropertyImage,
} from "../api/propertyImages.api.js";

export const usePropertyImages = (propertyId) => {
  return useQuery({
    queryKey: ["propertyImages", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyImages(propertyId);
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

export const useAddPropertyImage = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const imageData = variables.imageData || variables;
      return addPropertyImage(propertyId, imageData);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyImages", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const useUpdatePropertyImage = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const imageId = variables.imageId;
      const payload = variables.payload || variables;
      return updatePropertyImage(propertyId, imageId, payload);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyImages", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const useDeletePropertyImage = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const imageId = variables.imageId;
      return deletePropertyImage(propertyId, imageId);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyImages", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const usePropertyImageTypes = () => {
  return useQuery({
    queryKey: ["propertyImageTypesLookup"],
    queryFn: async () => {
      try {
        return await getPropertyImageTypesLookup();
      } catch {
        return { success: true, data: [] };
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
