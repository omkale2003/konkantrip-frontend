import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const getAmenitiesLookup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.AMENITIES);
  return response.data;
};

export const getAmenityCategoriesLookup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.AMENITY_CATEGORIES);
  return response.data;
};

export const getPropertyAmenities = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROPERTIES.AMENITIES(propertyId)
  );
  return response.data;
};

export const setPropertyAmenities = async (propertyId, amenitiesPayload) => {
  // Backend expects payload in format { amenities: [{ amenity_id: 1, is_available: true }] }
  const payload = Array.isArray(amenitiesPayload)
    ? {
        amenities: amenitiesPayload.map((item) =>
          typeof item === "number" || typeof item === "string"
            ? { amenity_id: Number(item), is_available: true }
            : item
        ),
      }
    : amenitiesPayload;

  const response = await apiClient.post(
    API_ENDPOINTS.PROPERTIES.AMENITIES(propertyId),
    payload
  );
  return response.data;
};
