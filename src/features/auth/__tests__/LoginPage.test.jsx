import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as authApi from "../api/auth.api.js";

vi.mock("../api/auth.api.js", () => ({
  loginOwner: vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form with inputs and submit button", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("handles successful login and stores token", async () => {
    authApi.loginOwner.mockResolvedValueOnce({
      token: "mock-jwt-token",
      user: { p_owner_id: 1, first_name: "John", last_name: "Doe" },
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

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

  it("displays server error message on login failure", async () => {
    authApi.loginOwner.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
