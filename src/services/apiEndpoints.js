export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    UPDATE_PASSWORD: "/update-password",
    LOGIN_LOGS: "/property_owner_login_logs",
    EMPLOYEE_LOGIN: "/auth/employee/login",
    EMPLOYEE_ME: "/auth/employee/me",
    EMPLOYEE_LOGOUT: "/auth/employee/logout",
    EMPLOYEE_UPDATE_PASSWORD: "/auth/employee/update-password",
  },

  PROFILE: "/profile",

  PROPERTIES: {
    LIST: "/properties",
    DETAIL: (id) => `/properties/${id}`,
    LOCATION: (propertyId) => `/properties/location/${propertyId}`,
    CONTACTS: (propertyId) => `/properties/contacts/${propertyId}`,
    CONTACT_DETAIL: (propertyId, contactId) =>
      `/properties/contacts/${propertyId}/${contactId}`,
    AMENITIES: (propertyId) => `/properties/amenities/${propertyId}`,
    IMAGES: (propertyId) => `/properties/images/${propertyId}`,
    IMAGE_DETAIL: (propertyId, imageId) =>
      `/properties/images/${propertyId}/${imageId}`,
    POLICIES: (propertyId) => `/properties/policies/${propertyId}`,
    DOCUMENTS: (propertyId) => `/properties/documents/${propertyId}`,
    DOCUMENT_DETAIL: (propertyId, documentId) =>
      `/properties/documents/${propertyId}/${documentId}`,
    HIGHLIGHTS: (propertyId) => `/properties/highlights/${propertyId}`,
    TAGS: (propertyId) => `/properties/tags/${propertyId}`,
    HOUSE_RULES: (propertyId) => `/properties/house-rules/${propertyId}`,
    NEARBY_PLACES: (propertyId) => `/properties/nearby-places/${propertyId}`,
    LANGUAGES: (propertyId) => `/properties/languages/${propertyId}`,
  },

  ROOMS: {
    LIST: "/rooms",
    DETAIL: (id) => `/rooms/${id}`,
    PROPERTY_ROOMS: (propertyId) => `/rooms?property_id=${propertyId}`,
    IMAGES: (roomId) => `/rooms/images/${roomId}`,
    IMAGE_DETAIL: (roomId, imageId) => `/rooms/images/${roomId}/${imageId}`,
    BEDS: (roomId) => `/rooms/beds/${roomId}`,
    BED_DETAIL: (roomId, bedId) => `/rooms/beds/${roomId}/${bedId}`,
    AMENITIES: (roomId) => `/rooms/amenities/${roomId}`,
    AMENITY_DETAIL: (roomId, amenityId) =>
      `/rooms/amenities/${roomId}/${amenityId}`,
    FACILITIES: (roomId) => `/rooms/facilities/${roomId}`,
    FACILITY_DETAIL: (roomId, facilityId) =>
      `/rooms/facilities/${roomId}/${facilityId}`,
    RATES: (roomId) => `/rooms/rates/${roomId}`,
    RATE_DETAIL: (roomId, rateId) => `/rooms/rates/${roomId}/${rateId}`,
  },

  INVENTORY: {
    LIST: "/inventory/rooms",
    PROPERTY_INVENTORY: (propertyId) =>
      `/inventory/rooms?property_id=${propertyId}`,
    CALENDAR: "/inventory/calendar",
    TRANSACTIONS: "/inventory/transactions",
    BLOCKS: "/inventory/blocks",
    STOP_SELL: "/inventory/stop-sell",
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
    HOUSE_RULE_CATEGORIES: "/lookups/master/house-rule-categories",
    NEARBY_PLACE_TYPES: "/lookups/master/nearby-place-types",
    TAGS: "/lookups/master/tags",
    LANGUAGES: "/lookups/master/languages",
  },

  EMPLOYEES: {
    PERMISSIONS: "/permissions",
    ROLES: "/roles",
    ROLE_DETAIL: (id) => `/roles/${id}`,
    LIST: "/employees",
    DETAIL: (id) => `/employees/${id}`,
    ASSIGN_PROPERTY: (id) => `/employees/assign-property/${id}`,
    UNASSIGN_PROPERTY: (id, propertyId) =>
      `/employees/unassign-property/${id}/${propertyId}`,
    PROPERTY_EMPLOYEES: (propertyId) =>
      `/properties/employees/${propertyId}`,
    SESSIONS: (id) => `/employees/sessions/${id}`,
    REVOKE_SESSION: (sessionId) => `/employees/sessions/single/${sessionId}`,
    REVOKE_ALL_SESSIONS: (id) => `/employees/sessions/all/${id}`,
  },

  AUDIT: {
    LIST: "/audit-trail",
    DETAIL: (id) => `/audit-trail/${id}`,
  },
};