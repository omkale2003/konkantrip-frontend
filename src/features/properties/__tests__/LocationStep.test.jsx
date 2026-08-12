import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import LocationStep from "../components/property-wizard/steps/LocationStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("LocationStep Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders location form with default values", () => {
    renderWithProviders(
      <LocationStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    expect(screen.getByLabelText(/address line 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toHaveValue("Maharashtra");
    expect(screen.getByLabelText(/country/i)).toHaveValue("India");
  });

  it("submits location data successfully when valid inputs are provided", async () => {
    renderWithProviders(
      <LocationStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    fireEvent.change(screen.getByLabelText(/address line 1/i), {
      target: { value: "123 Beach Road" },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Malvan" },
    });
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: "416606" },
    });

    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          address_line1: "123 Beach Road",
          city: "Malvan",
          postal_code: "416606",
          state: "Maharashtra",
          country: "India",
        })
      );
    });
  });

  it("displays server error alert when serverError prop is passed", () => {
    renderWithProviders(
      <LocationStep
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        serverError="Invalid postal code format"
      />
    );

    expect(screen.getByText(/invalid postal code format/i)).toBeInTheDocument();
  });

  it("renders 'Save Changes' button in edit review mode", () => {
    renderWithProviders(
      <LocationStep
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isEditingFromReview={true}
      />
    );

    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
