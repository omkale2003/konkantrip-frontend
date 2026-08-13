import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { usePropertyLocation, useSavePropertyLocation } from "../hooks/usePropertyLocations.js";
import { usePropertyContacts } from "../hooks/usePropertyContacts.js";
import { useMasterAmenities } from "../hooks/usePropertyAmenities.js";
import { useDocumentTypes } from "../hooks/usePropertyDocuments.js";
import { createTestQueryClient } from "../../../test/testUtils.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import * as locationsApi from "../api/propertyLocations.api.js";
import * as propertiesApi from "../api/properties.api.js";
import * as propertyContactsApi from "../api/propertyContacts.api.js";

vi.mock("../api/propertyLocations.api.js", () => ({
  getPropertyLocation: vi.fn(),
  savePropertyLocation: vi.fn(),
  createPropertyLocation: vi.fn(),
  updatePropertyLocation: vi.fn(),
}));

vi.mock("../api/properties.api.js", () => ({
  getPropertyAmenities: vi.fn(),
  savePropertyAmenities: vi.fn(),
  getMasterAmenities: vi.fn(),
  getPropertyPolicies: vi.fn(),
  savePropertyPolicies: vi.fn(),
  getPropertyDocuments: vi.fn(),
  getDocumentTypes: vi.fn(),
}));

vi.mock("../api/propertyContacts.api.js", () => ({
  getPropertyContacts: vi.fn(),
  createPropertyContact: vi.fn(),
  updatePropertyContact: vi.fn(),
  getContactTypesLookup: vi.fn(),
}));

describe("Property Sub-Resources Hooks Suite", () => {
  let queryClient;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  it("fetches property location using usePropertyLocation", async () => {
    locationsApi.getPropertyLocation.mockResolvedValueOnce({
      success: true,
      data: { city: "Malvan", state: "Maharashtra" },
    });

    const { result } = renderHook(() => usePropertyLocation(42), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("saves property location using useSavePropertyLocation", async () => {
    locationsApi.createPropertyLocation.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useSavePropertyLocation(42), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({ city: "Malvan" });
    });

    expect(locationsApi.createPropertyLocation).toHaveBeenCalledWith(42, { city: "Malvan" });
  });

  it("fetches property contacts using usePropertyContacts", async () => {
    propertyContactsApi.getPropertyContacts.mockResolvedValueOnce({
      success: true,
      data: [{ contact_name: "Owner John" }],
    });

    const { result } = renderHook(() => usePropertyContacts(42), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("fetches master amenities catalog using useMasterAmenities", async () => {
    propertiesApi.getMasterAmenities.mockResolvedValueOnce({
      success: true,
      data: [{ amenity_id: 1, amenity_name: "WiFi" }],
    });

    const { result } = renderHook(() => useMasterAmenities(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("fetches document types using useDocumentTypes", async () => {
    propertiesApi.getDocumentTypes.mockResolvedValueOnce({
      success: true,
      data: [{ document_type_id: 1, document_name: "Registration" }],
    });

    const { result } = renderHook(() => useDocumentTypes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
