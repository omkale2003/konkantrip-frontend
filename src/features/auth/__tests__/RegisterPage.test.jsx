import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../pages/RegisterPage.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as authApi from "../api/auth.api.js";

vi.mock("../api/auth.api.js", () => ({
  registerOwner: vi.fn(),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form fields", () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByPlaceholderText(/enter first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter 10-digit phone number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("validates required fields on empty submit", async () => {
    renderWithProviders(<RegisterPage />);

    const submitBtn = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  it("handles successful registration submission", async () => {
    authApi.registerOwner.mockResolvedValueOnce({
      message: "Property owner registered successfully",
    });

    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/enter first name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText(/enter last name/i), { target: { value: "Smith" } });
    fireEvent.change(screen.getByPlaceholderText(/enter 10-digit phone number/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/create a password/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(authApi.registerOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "Jane",
          last_name: "Smith",
          phone: "9876543210",
          email: "jane@example.com",
          password: "Password123!",
        }),
        expect.anything()
      );
      expect(screen.getByText(/property owner registered successfully/i)).toBeInTheDocument();
    });
  });
});
