import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import BasicDetailsStep from "../components/property-wizard/steps/BasicDetailsStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("Property Type State Reset Rules", () => {
  it("resets star rating when changing property type from Hotel to Villa", async () => {
    const mockOnNext = vi.fn();

    renderWithProviders(
      <BasicDetailsStep
        onNext={mockOnNext}
        initialValues={{ property_name: "Test Resort", property_type: "Hotel", star_rating: "5" }}
      />
    );

    const typeSelect = screen.getByLabelText(/property type/i);
    fireEvent.change(typeSelect, { target: { value: "Villa" } });

    await waitFor(() => {
      const starSelect = screen.getByLabelText(/star rating/i);
      expect(starSelect).toBeDisabled();
      expect(starSelect.value).toBe("0");
    });
  });

  it("resets total floors to 0 when changing property type to Tent", async () => {
    const mockOnNext = vi.fn();

    renderWithProviders(
      <BasicDetailsStep
        onNext={mockOnNext}
        initialValues={{ property_name: "Camp Resort", property_type: "Hotel", total_floors: 5 }}
      />
    );

    const typeSelect = screen.getByLabelText(/property type/i);
    fireEvent.change(typeSelect, { target: { value: "Tent" } });

    await waitFor(() => {
      const floorsInput = screen.getByLabelText(/total floors/i);
      expect(floorsInput).toBeDisabled();
      expect(floorsInput.value).toBe("0");
    });
  });
});
