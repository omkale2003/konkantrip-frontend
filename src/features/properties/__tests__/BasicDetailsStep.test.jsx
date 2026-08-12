import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import BasicDetailsStep from "../components/property-wizard/steps/BasicDetailsStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("BasicDetailsStep Component & Dynamic Matrix", () => {
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Hotel type with Star Rating input enabled", () => {
    renderWithProviders(
      <BasicDetailsStep
        onNext={mockOnNext}
        initialValues={{ property_type: "Hotel" }}
      />
    );

    const starRatingSelect = screen.getByLabelText(/star rating/i);
    expect(starRatingSelect).toBeInTheDocument();
    expect(starRatingSelect).not.toBeDisabled();
  });

  it("disables Star Rating for Villa property type", () => {
    renderWithProviders(
      <BasicDetailsStep
        onNext={mockOnNext}
        initialValues={{ property_type: "Villa" }}
      />
    );

    const starRatingSelect = screen.getByLabelText(/star rating/i);
    expect(starRatingSelect).toBeDisabled();
  });

  it("hides built year and renovated year for Tent setups when showYears is false", () => {
    renderWithProviders(
      <BasicDetailsStep
        onNext={mockOnNext}
        initialValues={{ property_type: "Tent" }}
      />
    );

    expect(screen.queryByLabelText(/built year/i)).not.toBeInTheDocument();
  });

  it("forces Price Display Type for Hostel", () => {
    renderWithProviders(
      <BasicDetailsStep
        onNext={mockOnNext}
        initialValues={{ property_type: "Hostel" }}
      />
    );

    const priceDisplaySelect = screen.getByLabelText(/price display/i);
    expect(priceDisplaySelect).toHaveValue("Per Person");
  });
});
