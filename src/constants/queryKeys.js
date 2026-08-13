export const QUERY_KEYS = {
  AUTH: {
    SESSION: ["auth", "session"],
  },

  PROPERTIES: {
    ALL: ["properties"],
    LIST: (filters) => ["properties", "list", filters],
    DETAIL: (propertyId) => ["properties", "detail", propertyId],
  },

  ROOMS: {
    ALL: ["rooms"],
    LIST: (filters) => ["rooms", "list", filters],
    DETAIL: (roomId) => ["rooms", "detail", roomId],
    BEDS: (roomId) => ["rooms", roomId, "beds"],
    AMENITIES: (roomId) => ["rooms", roomId, "amenities"],
    FACILITIES: (roomId) => ["rooms", roomId, "facilities"],
    IMAGES: (roomId) => ["rooms", roomId, "images"],
  },

  LOOKUPS: {
    ROOMS: ["lookups", "rooms"],
    AMENITIES: ["lookups", "amenities"],
  },
};