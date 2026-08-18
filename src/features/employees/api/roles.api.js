import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

/**
 * Fetch system & module permissions catalog
 */
export const getPermissions = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.PERMISSIONS);
  return response.data;
};

/**
 * Fetch roles (system roles + owner custom roles)
 * @param {Object} params - { active_only }
 */
export const getRoles = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.ROLES, {
    params,
  });
  return response.data;
};

/**
 * Fetch single role by ID with permissions
 * @param {number|string} id - Role ID
 */
export const getRoleById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.ROLE_DETAIL(id));
  return response.data;
};

/**
 * Create custom role
 * @param {Object} payload - { role_name, role_description, permissions: [permission_id...] }
 */
export const createRole = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.ROLES, payload);
  return response.data;
};

/**
 * Update custom role
 * @param {Object} params - { id, payload }
 */
export const updateRole = async ({ id, payload }) => {
  const response = await apiClient.put(
    API_ENDPOINTS.EMPLOYEES.ROLE_DETAIL(id),
    payload
  );
  return response.data;
};

/**
 * Delete custom role
 * @param {number|string} id - Role ID
 */
export const deleteRole = async (id) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.EMPLOYEES.ROLE_DETAIL(id)
  );
  return response.data;
};
