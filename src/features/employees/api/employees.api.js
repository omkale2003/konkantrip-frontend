import apiClient from "../../../services/apiClient.js";
import { API_ENDPOINTS } from "../../../services/apiEndpoints.js";

/**
 * Fetch list of employees with search and filters
 * @param {Object} params - { property_id, role_id, status, search, page, limit }
 */
export const getEmployees = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.LIST, {
    params,
  });
  return response.data;
};

/**
 * Fetch a single employee by ID
 * @param {number|string} id - Employee ID
 */
export const getEmployeeById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
  return response.data;
};

/**
 * Create a new employee
 * @param {Object} payload - Employee data
 */
export const createEmployee = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.LIST, payload);
  return response.data;
};

/**
 * Update an existing employee
 * @param {Object} params - { id, payload }
 */
export const updateEmployee = async ({ id, payload }) => {
  const response = await apiClient.put(API_ENDPOINTS.EMPLOYEES.DETAIL(id), payload);
  return response.data;
};

/**
 * Delete / deactivate an employee
 * @param {number|string} id - Employee ID
 */
export const deleteEmployee = async (id) => {
  const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
  return response.data;
};

/**
 * Assign property to employee
 * @param {Object} params - { id, property_id, is_primary }
 */
export const assignProperty = async ({ id, property_id, is_primary = false }) => {
  const response = await apiClient.post(
    API_ENDPOINTS.EMPLOYEES.ASSIGN_PROPERTY(id),
    { property_id, is_primary }
  );
  return response.data;
};

/**
 * Unassign property from employee
 * @param {Object} params - { id, propertyId }
 */
export const unassignProperty = async ({ id, propertyId }) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.EMPLOYEES.UNASSIGN_PROPERTY(id, propertyId)
  );
  return response.data;
};

/**
 * Fetch employees assigned to a specific property
 * @param {number|string} propertyId
 */
export const getPropertyEmployees = async (propertyId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.EMPLOYEES.PROPERTY_EMPLOYEES(propertyId)
  );
  return response.data;
};
