import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getPropertyLocation = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.LOCATION(propertyId)
  );

  return response.data;
};

export const createPropertyLocation = async (propertyId, payload) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.LOCATION(propertyId),
    payload
  );

  return response.data;
};

export const updatePropertyLocation = async (propertyId, payload) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PROPERTIES.LOCATION(propertyId),
    payload
  );

  return response.data;
};