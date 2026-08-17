import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../pages/RegisterPage.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import { registerSchema } from "../schemas/auth.schema.js";
import * as authApi from "../api/auth.api.js";

vi.mock("../api/auth.api.js", () => ({
  registerOwner: vi.fn(),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authApi.registerOwner.mockResolvedValue({
      message: "Property owner registered successfully",
    });
  });

  it("renders registration form fields", () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByPlaceholderText(/enter first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter 10-digit phone number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("validates required fields on empty submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const submitBtn = screen.getByRole("button", { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  it("handles successful registration submission", async () => {
    authApi.registerOwner.mockResolvedValue({
      message: "Property owner registered successfully",
    });

    renderWithProviders(<RegisterPage />);

    const firstNameInput = screen.getByPlaceholderText(/enter first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter last name/i);
    const phoneInput = screen.getByPlaceholderText(/enter 10-digit phone number/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/create a password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitBtn = screen.getByRole("button", { name: /create account/i });

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });
    fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Password123!" } });

    fireEvent.submit(submitBtn.closest("form"));

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
    });
  });
});
