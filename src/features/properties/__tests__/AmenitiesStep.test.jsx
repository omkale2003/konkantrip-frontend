import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AmenitiesStep from "../components/property-wizard/steps/AmenitiesStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as amenityHooks from "../hooks/usePropertyAmenities.js";

vi.mock("../hooks/usePropertyAmenities.js", () => ({
  useMasterAmenities: vi.fn(),
  usePropertyAmenities: vi.fn(),
  useSavePropertyAmenities: vi.fn(),
}));

describe("AmenitiesStep Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    amenityHooks.useMasterAmenities.mockReturnValue({
      data: {
        data: [
          { amenity_id: 1, amenity_name: "Free WiFi", category_name: "Basic", amenity_description: "High speed internet" },
          { amenity_id: 2, amenity_name: "Swimming Pool", category_name: "Outdoors", amenity_description: "Private pool" },
        ],
      },
    });
  });

  it("renders master amenities list and groups by category", () => {
    renderWithProviders(
      <AmenitiesStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    expect(screen.getByText(/free wifi/i)).toBeInTheDocument();
    expect(screen.getByText(/swimming pool/i)).toBeInTheDocument();
    expect(screen.getByText(/basic/i)).toBeInTheDocument();
    expect(screen.getByText(/outdoors/i)).toBeInTheDocument();
  });

  it("filters amenities list when typing in search bar", () => {
    renderWithProviders(
      <AmenitiesStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    const searchInput = screen.getByPlaceholderText(/search amenities/i);
    fireEvent.change(searchInput, { target: { value: "pool" } });

    expect(screen.getByText(/swimming pool/i)).toBeInTheDocument();
    expect(screen.queryByText(/free wifi/i)).not.toBeInTheDocument();
  });

  it("toggles amenity selection and submits payload array", () => {
    renderWithProviders(
      <AmenitiesStep onSubmit={mockOnSubmit} onBack={mockOnBack} />
    );

    const wifiCard = screen.getByText(/free wifi/i);
    fireEvent.click(wifiCard);

    const submitBtn = screen.getByRole("button", { name: /save & continue/i });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith([
      expect.objectContaining({ amenity_id: 1, is_available: true }),
    ]);
  });
});
