export const QUERY_KEYS = {
  AUTH: {
    SESSION: ["auth", "session"],
  },

  PROPERTIES: {
    ALL: ["properties"],
    LIST: (filters) => ["properties", "list", filters],
    DETAIL: (propertyId) => ["properties", "detail", propertyId],
  },
};