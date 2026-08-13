import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePropertyDocument,
  getDocumentTypesLookup,
  getPropertyDocuments,
  uploadPropertyDocument,
} from "../api/propertyDocuments.api.js";

export const usePropertyDocuments = (propertyId) => {
  return useQuery({
    queryKey: ["propertyDocuments", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyDocuments(propertyId);
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

export const useUploadPropertyDocument = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const documentData = variables.documentData || variables;
      return uploadPropertyDocument(propertyId, documentData);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyDocuments", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const useDeletePropertyDocument = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const documentId = variables.documentId;
      return deletePropertyDocument(propertyId, documentId);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyDocuments", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const useDocumentTypes = () => {
  return useQuery({
    queryKey: ["documentTypesLookup"],
    queryFn: async () => {
      try {
        return await getDocumentTypesLookup();
      } catch {
        return { success: true, data: [] };
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
