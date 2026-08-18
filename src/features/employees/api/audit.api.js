import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const auditApi = {
  getAuditLogs: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.AUDIT.LIST, { params });
    return response.data;
  },

  getAuditLogById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.AUDIT.DETAIL(id));
    return response.data;
  },
};

export default auditApi;
