export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    UPDATE_PASSWORD: "/update-password",
    LOGIN_LOGS: "/property_owner_login_logs",
  },

  PROFILE: "/profile",

  PROPERTIES: {
    LIST: "/properties",
    DETAIL: (id) => `/properties/${id}`,
    LOCATION: (propertyId) =>
      `/properties/${propertyId}/location`,
    CONTACTS: (propertyId) =>
      `/properties/${propertyId}/contacts`,
    CONTACT_DETAIL: (propertyId, contactId) =>
      `/properties/${propertyId}/contacts/${contactId}`,
    AMENITIES: (propertyId) =>
      `/properties/${propertyId}/amenities`,
    IMAGES: (propertyId) =>
      `/properties/${propertyId}/images`,
    IMAGE_DETAIL: (propertyId, imageId) =>
      `/properties/${propertyId}/images/${imageId}`,
    POLICIES: (propertyId) =>
      `/properties/${propertyId}/policies`,
    DOCUMENTS: (propertyId) =>
      `/properties/${propertyId}/documents`,
    DOCUMENT_DETAIL: (propertyId, documentId) =>
      `/properties/${propertyId}/documents/${documentId}`,
  },

  ROOMS: {
    LIST: "/rooms",
    DETAIL: (id) => `/rooms/${id}`,
    PROPERTY_ROOMS: (propertyId) => `/properties/${propertyId}/rooms`,
  },

  INVENTORY: {
    LIST: "/inventory",
    PROPERTY_INVENTORY: (propertyId) => `/properties/${propertyId}/inventory`,
  },

  LOOKUPS: {
    MASTER: "/lookups/master",
    AMENITIES: "/lookups/amenities",
    AMENITY_CATEGORIES: "/lookups/amenities/categories",
    ROOMS: {
      BED_TYPES: "/lookups/rooms/bed-types",
      ROOM_TYPES: "/lookups/rooms/room-types",
      ROOM_STATUS: "/lookups/rooms/room-status",
      ROOM_VIEWS: "/lookups/rooms/room-views",
      ROOM_IMAGE_TYPES: "/lookups/rooms/room-image-types",
      FACILITY_CATEGORIES: "/lookups/rooms/facility-categories",
      FACILITIES: "/lookups/rooms/facilities",
    },
    CONTACT_TYPES: "/lookups/master/contact-types",
    PROPERTY_IMAGE_TYPES: "/lookups/master/property-image-types",
    DOCUMENT_TYPES: "/lookups/master/document-types",
  },
};