import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getPropertyRooms = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.ROOMS.PROPERTY_ROOMS(propertyId)
  );

  return response.data;
};
