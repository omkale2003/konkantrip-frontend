import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewStep from "../components/property-wizard/steps/ReviewStep.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as locHooks from "../hooks/usePropertyLocations.js";
import * as contactHooks from "../hooks/usePropertyContacts.js";
import * as amenityHooks from "../hooks/usePropertyAmenities.js";
import * as imageHooks from "../hooks/usePropertyImages.js";
import * as policyHooks from "../hooks/usePropertyPolicies.js";
import * as docHooks from "../hooks/usePropertyDocuments.js";

vi.mock("../hooks/usePropertyLocations.js", () => ({ usePropertyLocation: vi.fn() }));
vi.mock("../hooks/usePropertyContacts.js", () => ({ usePropertyContacts: vi.fn() }));
vi.mock("../hooks/usePropertyAmenities.js", () => ({ usePropertyAmenities: vi.fn() }));
vi.mock("../hooks/usePropertyImages.js", () => ({ usePropertyImages: vi.fn() }));
vi.mock("../hooks/usePropertyPolicies.js", () => ({ usePropertyPolicies: vi.fn() }));
vi.mock("../hooks/usePropertyDocuments.js", () => ({ usePropertyDocuments: vi.fn() }));

describe("ReviewStep Component", () => {
  const mockOnSubmitProperty = vi.fn();
  const mockOnNavigateToStep = vi.fn();
  const mockOnBack = vi.fn();

  const mockBasicDetails = { property_name: "Grand Konkan Resort", property_type: "Resort", star_rating: "5" };

  beforeEach(() => {
    vi.clearAllMocks();
    locHooks.usePropertyLocation.mockReturnValue({ data: { data: { address_line1: "123 Beach Road", city: "Malvan", state: "Maharashtra" } } });
    contactHooks.usePropertyContacts.mockReturnValue({ data: { data: [{ contact_name: "Owner John", mobile_number: "9876543210", email: "john@konkantrip.com" }] } });
    amenityHooks.usePropertyAmenities.mockReturnValue({ data: { data: [{ amenity_id: 1, amenity_name: "Free WiFi" }] } });
    imageHooks.usePropertyImages.mockReturnValue({ data: { data: [{ property_image_id: 1, image_url: "https://example.com/resort.jpg", is_cover: true }] } });
    policyHooks.usePropertyPolicies.mockReturnValue({ data: { data: { check_in_from: "12:00", check_out_to: "10:00" } } });
    docHooks.usePropertyDocuments.mockReturnValue({ data: { data: [{ property_document_id: 1, document_type_name: "Registration Certificate", status: "Verified" }] } });
  });

  it("renders property review summary section headers and details", () => {
    renderWithProviders(
      <ReviewStep
        propertyId={42}
        basicDetails={mockBasicDetails}
        onSubmitProperty={mockOnSubmitProperty}
        onNavigateToStep={mockOnNavigateToStep}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Grand Konkan Resort")).toBeInTheDocument();
    expect(screen.getByText(/123 beach road/i)).toBeInTheDocument();
  });

  it("triggers onNavigateToStep callback with step number when edit icon is clicked", () => {
    renderWithProviders(
      <ReviewStep
        propertyId={42}
        basicDetails={mockBasicDetails}
        onSubmitProperty={mockOnSubmitProperty}
        onNavigateToStep={mockOnNavigateToStep}
        onBack={mockOnBack}
      />
    );

    const editBtns = screen.getAllByRole("button", { name: /edit/i });
    expect(editBtns.length).toBeGreaterThan(0);
    fireEvent.click(editBtns[0]);

    expect(mockOnNavigateToStep).toHaveBeenCalledWith(1);
  });

  it("opens confirmation modal and triggers submit callback on confirmation", async () => {
    mockOnSubmitProperty.mockResolvedValueOnce(true);

    renderWithProviders(
      <ReviewStep
        propertyId={42}
        basicDetails={mockBasicDetails}
        onSubmitProperty={mockOnSubmitProperty}
        onNavigateToStep={mockOnNavigateToStep}
        onBack={mockOnBack}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /^submit property$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/submit property for verification\?/i)).toBeInTheDocument();
    });

    const submitBtns = screen.getAllByRole("button", { name: /^submit property$/i });
    const modalConfirmBtn = submitBtns[submitBtns.length - 1];
    fireEvent.click(modalConfirmBtn);

    await waitFor(() => {
      expect(mockOnSubmitProperty).toHaveBeenCalled();
    });
  });
});
