import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const employeeLogin = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.EMPLOYEE_LOGIN, payload);
  return response.data;
};

export const getEmployeeProfile = async () => {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.EMPLOYEE_ME);
  return response.data;
};

export const employeeLogout = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.EMPLOYEE_LOGOUT);
    return response.data;
  } catch {
    return { success: true };
  }
};
