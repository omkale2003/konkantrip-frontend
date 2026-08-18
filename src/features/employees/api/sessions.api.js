import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const sessionsApi = {
  getEmployeeSessions: async (employeeId) => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.SESSIONS(employeeId));
    return response.data;
  },

  revokeSession: async (sessionId) => {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEES.REVOKE_SESSION(sessionId));
    return response.data;
  },

  revokeAllSessions: async (employeeId) => {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEES.REVOKE_ALL_SESSIONS(employeeId));
    return response.data;
  },
};

export default sessionsApi;
