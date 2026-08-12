import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import AddPropertyPage from "../pages/AddPropertyPage.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";
import * as propertiesApi from "../api/properties.api.js";

vi.mock("../api/properties.api.js", () => ({
  createProperty: vi.fn(),
  updateProperty: vi.fn(),
  getPropertyById: vi.fn(),
}));

describe("Step 1 Edit Bug Reproducer Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("reproduces Step 1 edit flow from Review and verifies updateProperty mutation call", async () => {
    localStorage.setItem(
      "konkantrip_property_draft",
      JSON.stringify({ propertyId: 99, currentStep: 8 })
    );

    propertiesApi.getPropertyById.mockResolvedValue({
      success: true,
      data: {
        property_id: 99,
        property_name: "Original Sea View Resort",
        property_type: "Resort",
        category: "Luxury",
      },
    });

    propertiesApi.updateProperty.mockResolvedValueOnce({
      success: true,
      data: {
        property_id: 99,
        property_name: "Updated Sea View Resort",
        property_type: "Resort",
      },
    });

    renderWithProviders(<AddPropertyPage />, {
      route: "/owner/add-property?resume=true",
    });

    await waitFor(() => {
      const headings = screen.getAllByText(/review your property information carefully/i);
      expect(headings.length).toBeGreaterThan(0);
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/property name/i);
    fireEvent.change(nameInput, { target: { value: "Updated Sea View Resort" } });

    const saveChangesBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.submit(saveChangesBtn.closest("form"));

    await waitFor(() => {
      expect(propertiesApi.updateProperty).toHaveBeenCalled();
      const callArg = propertiesApi.updateProperty.mock.calls[0][0];
      expect(callArg.propertyId).toBe(99);
      expect(callArg.propertyData.property_name).toBe("Updated Sea View Resort");
    });
  });

  it("exposes failure behavior when updateProperty API responds with 404 Property Not Found", async () => {
    localStorage.setItem(
      "konkantrip_property_draft",
      JSON.stringify({ propertyId: 999, currentStep: 8 })
    );

    propertiesApi.getPropertyById.mockResolvedValue({
      success: true,
      data: { property_id: 999, property_name: "Stale Property", property_type: "Resort" },
    });

    propertiesApi.updateProperty.mockRejectedValueOnce({
      response: { status: 404, data: { message: "Property not found" } },
    });

    renderWithProviders(<AddPropertyPage />, {
      route: "/owner/add-property?resume=true",
    });

    await waitFor(() => {
      const headings = screen.getAllByText(/review your property information carefully/i);
      expect(headings.length).toBeGreaterThan(0);
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
    });

    const saveChangesBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.submit(saveChangesBtn.closest("form"));

    await waitFor(() => {
      expect(propertiesApi.updateProperty).toHaveBeenCalled();
      const callArg = propertiesApi.updateProperty.mock.calls[0][0];
      expect(callArg.propertyId).toBe(999);
    });
  });
});
