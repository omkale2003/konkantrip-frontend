import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ContactStep from "../components/property-wizard/steps/ContactStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as contactHooks from "../hooks/usePropertyContacts.js";

vi.mock("../hooks/usePropertyContacts.js", () => ({
  useContactTypes: vi.fn(),
  usePropertyContacts: vi.fn(),
  useSavePropertyContact: vi.fn(),
  useDeletePropertyContact: vi.fn(),
}));

describe("ContactStep Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    contactHooks.useContactTypes.mockReturnValue({
      data: {
        data: [
          { contact_type_id: 1, contact_type_name: "Manager" },
          { contact_type_id: 2, contact_type_name: "Front Desk" },
        ],
      },
    });
    contactHooks.usePropertyContacts.mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });
    contactHooks.useSavePropertyContact.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
    contactHooks.useDeletePropertyContact.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("renders contact form with default fields and options", () => {
    renderWithProviders(
      <ContactStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    expect(screen.getByPlaceholderText(/ramesh patil/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/10-digit mobile number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/property@example.com/i)).toBeInTheDocument();
  });

  it("submits contact form with sanitized numeric values", async () => {
    renderWithProviders(
      <ContactStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    fireEvent.change(screen.getByPlaceholderText(/ramesh patil/i), {
      target: { value: "John Manager" },
    });
    fireEvent.change(screen.getByPlaceholderText(/10-digit mobile number/i), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByPlaceholderText(/property@example.com/i), {
      target: { value: "contact@hotel.com" },
    });

    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contact_name: "John Manager",
          mobile_number: "9876543210",
          email: "contact@hotel.com",
          contact_type_id: 1,
          is_primary: true,
        })
      );
    });
  });
});
