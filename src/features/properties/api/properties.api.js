import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getProperties = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.PROPERTIES.LIST, {
    params,
  });

  return response.data;
};

export const getPropertyById = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.DETAIL(propertyId)
  );

  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.LIST,
    propertyData
  );

  return response.data;
};

export const updateProperty = async (params = {}) => {
  const targetId = params.propertyId || params.id;
  const targetData = params.propertyData || params.payload || params.data;

  const response = await apiClient.put(
    API_ENDPOINTS.PROPERTIES.DETAIL(targetId),
    targetData
  );

  return response.data;
};

export const deleteProperty = async (propertyId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.PROPERTIES.DETAIL(propertyId)
  );

  return response.data;
};