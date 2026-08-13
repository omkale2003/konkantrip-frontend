import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import PoliciesStep from "../components/property-wizard/steps/PoliciesStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("PoliciesStep Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders policies form default check-in/out and policy toggles", () => {
    renderWithProviders(
      <PoliciesStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    expect(screen.getByLabelText(/check-in from/i)).toHaveValue("12:00");
    expect(screen.getByLabelText(/check-out until/i)).toHaveValue("10:00");
  });

  it("submits policies data successfully when form is submitted", async () => {
    renderWithProviders(
      <PoliciesStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          check_in_from: "12:00",
          check_out_to: "10:00",
          id_proof_required: true,
          unmarried_couples_allowed: true,
        })
      );
    });
  });
});
