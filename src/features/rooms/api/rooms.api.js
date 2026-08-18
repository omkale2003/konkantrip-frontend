import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

// Lookups
export const getRoomLookups = async (lookupType) => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.ROOMS[lookupType]);
  return response.data;
};

export const getAmenitiesLookup = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LOOKUPS.AMENITIES);
  return response.data;
};

// Core Room CRUD
export const getRooms = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.ROOMS.LIST, { params });
  return response.data;
};

export const getRoomById = async (roomId) => {
  const response = await apiClient.get(API_ENDPOINTS.ROOMS.DETAIL(roomId));
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await apiClient.post(API_ENDPOINTS.ROOMS.LIST, roomData);
  return response.data;
};

export const updateRoom = async ({ roomId, data }) => {
  const response = await apiClient.put(API_ENDPOINTS.ROOMS.DETAIL(roomId), data);
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await apiClient.delete(API_ENDPOINTS.ROOMS.DETAIL(roomId));
  return response.data;
};

// Room Beds
export const getRoomBeds = async (roomId) => {
  const response = await apiClient.get(API_ENDPOINTS.ROOMS.BEDS(roomId));
  return response.data;
};

export const addRoomBed = async ({ roomId, data }) => {
  const response = await apiClient.post(API_ENDPOINTS.ROOMS.BEDS(roomId), data);
  return response.data;
};

export const updateRoomBed = async ({ roomId, bedId, data }) => {
  const response = await apiClient.put(API_ENDPOINTS.ROOMS.BED_DETAIL(roomId, bedId), data);
  return response.data;
};

export const deleteRoomBed = async ({ roomId, bedId }) => {
  const response = await apiClient.delete(API_ENDPOINTS.ROOMS.BED_DETAIL(roomId, bedId));
  return response.data;
};

// Room Amenities
export const getRoomAmenities = async (roomId) => {
  const response = await apiClient.get(API_ENDPOINTS.ROOMS.AMENITIES(roomId));
  return response.data;
};

export const addRoomAmenity = async ({ roomId, amenityId }) => {
  const response = await apiClient.post(API_ENDPOINTS.ROOMS.AMENITIES(roomId), { amenity_id: amenityId });
  return response.data;
};

export const deleteRoomAmenity = async ({ roomId, amenityId }) => {
  const response = await apiClient.delete(API_ENDPOINTS.ROOMS.AMENITY_DETAIL(roomId, amenityId));
  return response.data;
};

// Room Facilities
export const getRoomFacilities = async (roomId) => {
  const response = await apiClient.get(API_ENDPOINTS.ROOMS.FACILITIES(roomId));
  return response.data;
};

export const addRoomFacility = async ({ roomId, facilityId }) => {
  const response = await apiClient.post(API_ENDPOINTS.ROOMS.FACILITIES(roomId), { room_facility_id: facilityId });
  return response.data;
};

export const deleteRoomFacility = async ({ roomId, facilityId }) => {
  const response = await apiClient.delete(API_ENDPOINTS.ROOMS.FACILITY_DETAIL(roomId, facilityId));
  return response.data;
};

// Room Images
export const getRoomImages = async (roomId) => {
  const response = await apiClient.get(API_ENDPOINTS.ROOMS.IMAGES(roomId));
  return response.data;
};

export const uploadRoomImage = async ({ roomId, formData }) => {
  const response = await apiClient.post(API_ENDPOINTS.ROOMS.IMAGES(roomId), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateRoomImage = async ({ roomId, imageId, data }) => {
  const response = await apiClient.put(API_ENDPOINTS.ROOMS.IMAGE_DETAIL(roomId, imageId), data);
  return response.data;
};

export const deleteRoomImage = async ({ roomId, imageId }) => {
  const response = await apiClient.delete(API_ENDPOINTS.ROOMS.IMAGE_DETAIL(roomId, imageId));
  return response.data;
};
