import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

export const registerOwner = async (payload) => {
  const { confirm_password, ...apiPayload } = payload;
  const response = await apiClient.post(
    API_ENDPOINTS.AUTH.REGISTER,
    apiPayload
  );

  return response.data;
};

export const loginOwner = async (payload) => {
  const response = await apiClient.post(
    API_ENDPOINTS.AUTH.LOGIN,
    payload
  );

  return response.data;
};