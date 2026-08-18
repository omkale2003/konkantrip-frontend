import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import EmployeesPage from "../pages/EmployeesPage.jsx";
import * as employeesApi from "../api/employees.api.js";
import * as rolesApi from "../api/roles.api.js";
import * as propertiesApi from "../../properties/api/properties.api.js";

vi.mock("../api/employees.api.js");
vi.mock("../api/roles.api.js");
vi.mock("../../properties/api/properties.api.js");

const mockEmployees = [
  {
    employee_id: 1,
    first_name: "Rahul",
    last_name: "Sawant",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    designation: "Front Desk Manager",
    department: "Front Desk",
    status: "Active",
    role_id: 1,
    role_name: "Property Manager",
    is_system_role: true,
    assigned_properties: [
      { property_id: 2, property_name: "Konkan Pearl Resort", is_primary: true },
    ],
  },
  {
    employee_id: 2,
    first_name: "Pooja",
    last_name: "Patil",
    email: "pooja@example.com",
    phone: "+91 9876543211",
    designation: "Housekeeping Lead",
    department: "Housekeeping",
    status: "Active",
    role_id: 2,
    role_name: "Staff",
    is_system_role: true,
    assigned_properties: [],
  },
];

const mockRoles = [
  {
    role_id: 1,
    role_name: "Property Manager",
    role_description: "Full access to on-site operations",
    is_system_role: true,
    permissions: [
      { permission_id: 1, module: "rooms", action: "manage", description: "Manage rooms" },
    ],
  },
  {
    role_id: 2,
    role_name: "Staff",
    role_description: "Basic front desk operations",
    is_system_role: true,
    permissions: [],
  },
];

const mockProperties = [
  { property_id: 2, property_name: "Konkan Pearl Resort", property_type: "Resort" },
];

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

import storageService from "../../../services/storage.service.js";
import tokenService from "../../../services/token.service.js";

describe("EmployeesPage Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenService.setToken("mock-owner-token");
    storageService.setOwner({
      p_owner_id: 2,
      first_name: "Owner",
      email: "owner@test.com",
    });

    employeesApi.getEmployees.mockResolvedValue({
      success: true,
      count: mockEmployees.length,
      data: mockEmployees,
    });
    rolesApi.getRoles.mockResolvedValue({
      success: true,
      count: mockRoles.length,
      data: mockRoles,
    });
    rolesApi.getPermissions.mockResolvedValue({
      success: true,
      data: [],
    });
    propertiesApi.getProperties.mockResolvedValue({
      success: true,
      count: mockProperties.length,
      data: mockProperties,
    });
  });

  it("renders the Staff & CRM page header and summary metrics", async () => {
    renderWithProviders(<EmployeesPage />);

    expect(screen.getByText(/Staff & CRM Management/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Total Staff")).toBeInTheDocument();
      expect(screen.getByText("Rahul Sawant")).toBeInTheDocument();
      expect(screen.getByText("Pooja Patil")).toBeInTheDocument();
    });
  });

  it("switches to Roles & Permissions tab and displays role items", async () => {
    renderWithProviders(<EmployeesPage />);

    await waitFor(() => {
      expect(screen.getByText("Rahul Sawant")).toBeInTheDocument();
    });

    const rolesTabBtn = screen.getByRole("button", {
      name: /Roles & Permissions/i,
    });
    fireEvent.click(rolesTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Roles & Permissions Matrix/i)).toBeInTheDocument();
      expect(screen.getAllByText("Property Manager").length).toBeGreaterThan(0);
    });
  });

  it("opens the Add Employee modal when clicking Add Employee button", async () => {
    renderWithProviders(<EmployeesPage />);

    await waitFor(() => {
      expect(screen.getByText("Rahul Sawant")).toBeInTheDocument();
    });

    const addBtn = screen.getByRole("button", { name: /Add Employee/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText("Add New Employee")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e.g. Rahul/i)).toBeInTheDocument();
    });
  });
});
