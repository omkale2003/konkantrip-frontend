import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import AddPropertyPage from "../pages/AddPropertyPage.jsx";
import { renderWithProviders } from "../../../test/testUtils.jsx";

describe("AddPropertyPage Navigation & Step Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("always renders Step 1 (Basic Details) by default when creating a new property", () => {
    renderWithProviders(<AddPropertyPage />, { route: "/owner/add-property" });

    expect(screen.getByText(/add new property/i)).toBeInTheDocument();
    expect(screen.getByText(/start by providing the basic details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
  });

  it("resumes draft step when ?resume=true is present in query parameters", () => {
    localStorage.setItem(
      "konkantrip_property_draft",
      JSON.stringify({ propertyId: 42, currentStep: 2 })
    );

    renderWithProviders(<AddPropertyPage />, { route: "/owner/add-property?resume=true" });

    expect(screen.getByText(/tell us where your property is located/i)).toBeInTheDocument();
  });
});
