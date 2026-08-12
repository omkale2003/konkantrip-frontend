import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getPropertyPolicies = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.POLICIES(propertyId)
  );
  return response.data;
};

export const savePropertyPolicies = async (propertyId, payload) => {
  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.POLICIES(propertyId),
    payload
  );
  return response.data;
};
