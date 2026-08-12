import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getPropertyContacts = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.CONTACTS(propertyId)
  );
  return response.data;
};

export const createPropertyContact = async (propertyId, payload) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.CONTACTS(propertyId),
    payload
  );
  return response.data;
};

export const updatePropertyContact = async (propertyId, contactId, payload) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PROPERTIES.CONTACT_DETAIL(propertyId, contactId),
    payload
  );
  return response.data;
};

export const deletePropertyContact = async (propertyId, contactId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROPERTIES.CONTACT_DETAIL(propertyId, contactId)
  );
  return response.data;
};

export const getContactTypesLookup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.CONTACT_TYPES);
  return response.data;
};
