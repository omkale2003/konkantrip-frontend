import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPropertyContact,
  deletePropertyContact,
  getContactTypesLookup,
  getPropertyContacts,
  updatePropertyContact,
} from "../api/propertyContacts.api.js";

export const usePropertyContacts = (propertyId) => {
  return useQuery({
    queryKey: ["propertyContacts", propertyId],
    queryFn: async () => {
      try {
        return await getPropertyContacts(propertyId);
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

export const useSavePropertyContact = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const payload = variables.payload || variables;
      const contactId = variables.contactId;

      if (contactId) {
        return updatePropertyContact(propertyId, contactId, payload);
      }
      return createPropertyContact(propertyId, payload);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyContacts", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const useDeletePropertyContact = (propertyIdParam) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const propertyId = variables.propertyId || propertyIdParam;
      const contactId = variables.contactId || variables;
      return deletePropertyContact(propertyId, contactId);
    },

    onSuccess: (_, variables) => {
      const targetId = variables.propertyId || propertyIdParam;
      queryClient.invalidateQueries({
        queryKey: ["propertyContacts", targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["properties", targetId],
      });
    },
  });
};

export const useContactTypes = () => {
  return useQuery({
    queryKey: ["contactTypesLookup"],
    queryFn: async () => {
      try {
        return await getContactTypesLookup();
      } catch {
        return { success: true, data: [] };
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
