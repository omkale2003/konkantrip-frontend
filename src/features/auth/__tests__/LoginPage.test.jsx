import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as authApi from "../api/auth.api.js";
import * as employeeAuthApi from "../api/employeeAuth.api.js";

vi.mock("../api/auth.api.js", () => ({
  loginOwner: vi.fn(),
}));

vi.mock("../api/employeeAuth.api.js", () => ({
  employeeLogin: vi.fn(),
  getEmployeeProfile: vi.fn(),
  employeeLogout: vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form with Owner and Staff portal switcher tabs", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole("button", { name: /Property Owner/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Staff \/ Employee/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in as owner/i })).toBeInTheDocument();
  });

  it("switches to Staff / Employee login mode", async () => {
    renderWithProviders(<LoginPage />);

    const staffTab = screen.getByRole("button", { name: /Staff \/ Employee/i });
    fireEvent.click(staffTab);

    await waitFor(() => {
      expect(screen.getByText(/Staff & Operations Sign In/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in as staff/i })).toBeInTheDocument();
    });
  });

  it("shows validation error when submitting empty form", async () => {
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: /sign in as owner/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("handles successful owner login and stores token", async () => {
    authApi.loginOwner.mockResolvedValueOnce({
      token: "mock-jwt-token",
      user: { p_owner_id: 1, first_name: "John", last_name: "Doe" },
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/owner@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in as owner/i });

    fireEvent.change(emailInput, { target: { value: "owner@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authApi.loginOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "owner@example.com",
          password: "password123",
          remember_me: false,
        }),
        expect.anything()
      );
    });
  });

  it("handles successful staff login and stores employee permissions", async () => {
    employeeAuthApi.employeeLogin.mockResolvedValueOnce({
      token: "mock-employee-token",
      data: {
        employee_id: 10,
        first_name: "Rahul",
        role_name: "Front Desk",
        permissions: ["rooms:read", "bookings:read"],
      },
    });

    renderWithProviders(<LoginPage />);

    // Switch to staff tab
    fireEvent.click(screen.getByRole("button", { name: /Staff \/ Employee/i }));

    const emailInput = screen.getByPlaceholderText(/staff@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in as staff/i });

    fireEvent.change(emailInput, { target: { value: "rahul@hotel.com" } });
    fireEvent.change(passwordInput, { target: { value: "staffpass123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(employeeAuthApi.employeeLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "rahul@hotel.com",
          password: "staffpass123",
        })
      );
    });
  });

  it("displays server error message on login failure", async () => {
    authApi.loginOwner.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/owner@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in as owner/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
