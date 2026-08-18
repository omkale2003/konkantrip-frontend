import { describe, it, expect, vi, beforeEach } from "vitest";
import apiClient from "../../../services/apiClient.js";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignProperty,
  unassignProperty,
  getPropertyEmployees,
} from "../api/employees.api.js";
import {
  getPermissions,
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../api/roles.api.js";

vi.mock("../../../services/apiClient.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Employees and Roles API Client Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls GET /employees with query parameters", async () => {
    const mockData = { success: true, count: 2, data: [] };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await getEmployees({ search: "John", status: "Active" });
    expect(apiClient.get).toHaveBeenCalledWith("/employees", {
      params: { search: "John", status: "Active" },
    });
    expect(result).toEqual(mockData);
  });

  it("calls GET /employees/:id to fetch single employee", async () => {
    const mockData = { success: true, data: { employee_id: 1, first_name: "Rahul" } };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await getEmployeeById(1);
    expect(apiClient.get).toHaveBeenCalledWith("/employees/1");
    expect(result).toEqual(mockData);
  });

  it("calls POST /employees to create employee", async () => {
    const payload = { first_name: "Rahul", email: "rahul@test.com", role_id: 1 };
    const mockData = { success: true, data: { employee_id: 10, ...payload } };
    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await createEmployee(payload);
    expect(apiClient.post).toHaveBeenCalledWith("/employees", payload);
    expect(result).toEqual(mockData);
  });

  it("calls PUT /employees/:id to update employee", async () => {
    const payload = { first_name: "Rahul Updated" };
    const mockData = { success: true, data: { employee_id: 10, ...payload } };
    apiClient.put.mockResolvedValueOnce({ data: mockData });

    const result = await updateEmployee({ id: 10, payload });
    expect(apiClient.put).toHaveBeenCalledWith("/employees/10", payload);
    expect(result).toEqual(mockData);
  });

  it("calls DELETE /employees/:id", async () => {
    const mockData = { success: true, message: "Employee deleted" };
    apiClient.delete.mockResolvedValueOnce({ data: mockData });

    const result = await deleteEmployee(10);
    expect(apiClient.delete).toHaveBeenCalledWith("/employees/10");
    expect(result).toEqual(mockData);
  });

  it("calls POST /employees/assign-property/:id", async () => {
    const mockData = { success: true, message: "Property assigned" };
    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await assignProperty({ id: 5, property_id: 2, is_primary: true });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/employees/assign-property/5",
      { property_id: 2, is_primary: true }
    );
    expect(result).toEqual(mockData);
  });

  it("calls DELETE /employees/unassign-property/:id/:propertyId", async () => {
    const mockData = { success: true, message: "Property unassigned" };
    apiClient.delete.mockResolvedValueOnce({ data: mockData });

    const result = await unassignProperty({ id: 5, propertyId: 2 });
    expect(apiClient.delete).toHaveBeenCalledWith(
      "/employees/unassign-property/5/2"
    );
    expect(result).toEqual(mockData);
  });

  it("calls GET /permissions and /roles", async () => {
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
    await getPermissions();
    expect(apiClient.get).toHaveBeenCalledWith("/permissions");

    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
    await getRoles();
    expect(apiClient.get).toHaveBeenCalledWith("/roles", { params: {} });
  });

  it("calls POST and PUT /roles for role creation and update", async () => {
    apiClient.post.mockResolvedValueOnce({ data: { success: true, data: { role_id: 2 } } });
    await createRole({ role_name: "Manager", permissions: [1, 2] });
    expect(apiClient.post).toHaveBeenCalledWith("/roles", {
      role_name: "Manager",
      permissions: [1, 2],
    });

    apiClient.put.mockResolvedValueOnce({ data: { success: true } });
    await updateRole({ id: 2, payload: { role_name: "Senior Manager" } });
    expect(apiClient.put).toHaveBeenCalledWith("/roles/2", {
      role_name: "Senior Manager",
    });
  });
});
