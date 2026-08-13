import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getPropertyImages = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.IMAGES(propertyId)
  );
  return response.data;
};

export const addPropertyImage = async (propertyId, imageData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.IMAGES(propertyId),
    imageData
  );
  return response.data;
};

export const updatePropertyImage = async (propertyId, imageId, payload) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PROPERTIES.IMAGE_DETAIL(propertyId, imageId),
    payload
  );
  return response.data;
};

export const deletePropertyImage = async (propertyId, imageId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROPERTIES.IMAGE_DETAIL(propertyId, imageId)
  );
  return response.data;
};

export const getPropertyImageTypesLookup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.PROPERTY_IMAGE_TYPES);
  return response.data;
};
