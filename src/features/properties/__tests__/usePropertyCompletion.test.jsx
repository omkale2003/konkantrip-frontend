import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePropertyCompletion } from "../hooks/usePropertyCompletion.js";
import * as locationHooks from "../hooks/usePropertyLocations.js";
import * as contactHooks from "../hooks/usePropertyContacts.js";
import * as amenitiesHooks from "../hooks/usePropertyAmenities.js";
import * as imagesHooks from "../hooks/usePropertyImages.js";
import * as policiesHooks from "../hooks/usePropertyPolicies.js";
import * as documentsHooks from "../hooks/usePropertyDocuments.js";
import * as roomsHooks from "../hooks/usePropertyRooms.js";

// Mock all the sub-resource hooks
vi.mock("../hooks/usePropertyLocations.js", () => ({ usePropertyLocation: vi.fn() }));
vi.mock("../hooks/usePropertyContacts.js", () => ({ usePropertyContacts: vi.fn() }));
vi.mock("../hooks/usePropertyAmenities.js", () => ({ usePropertyAmenities: vi.fn() }));
vi.mock("../hooks/usePropertyImages.js", () => ({ usePropertyImages: vi.fn() }));
vi.mock("../hooks/usePropertyPolicies.js", () => ({ usePropertyPolicies: vi.fn() }));
vi.mock("../hooks/usePropertyDocuments.js", () => ({ usePropertyDocuments: vi.fn() }));
vi.mock("../hooks/usePropertyRooms.js", () => ({ usePropertyRooms: vi.fn() }));

describe("usePropertyCompletion", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMocks = (overrides = {}) => {
    locationHooks.usePropertyLocation.mockReturnValue({ data: { data: overrides.location }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
    contactHooks.usePropertyContacts.mockReturnValue({ data: { data: overrides.contacts }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
    amenitiesHooks.usePropertyAmenities.mockReturnValue({ data: { data: overrides.amenities }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
    imagesHooks.usePropertyImages.mockReturnValue({ data: { data: overrides.images }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
    policiesHooks.usePropertyPolicies.mockReturnValue({ data: { data: overrides.policies }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
    documentsHooks.usePropertyDocuments.mockReturnValue({ data: { data: overrides.documents }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
    roomsHooks.usePropertyRooms.mockReturnValue({ data: { data: overrides.rooms }, isLoading: overrides.isLoading || false, isError: overrides.isError || false });
  };

  it("returns loading true if any hook is loading", () => {
    setupMocks({ isLoading: true });
    const { result } = renderHook(() => usePropertyCompletion({ property_id: 1 }), { wrapper });
    
    expect(result.current.isLoading).toBe(true);
  });

  it("returns error true if any hook is error", () => {
    setupMocks({ isError: true });
    const { result } = renderHook(() => usePropertyCompletion({ property_id: 1 }), { wrapper });
    
    expect(result.current.isError).toBe(true);
  });

  it("calculates completion data correctly when data is available", () => {
    setupMocks({
      location: { address_line1: "123" },
      contacts: [{ contact_name: "John" }],
    });

    const { result } = renderHook(
      () => usePropertyCompletion({ property_id: 1, property_name: "Test", property_type: "Hotel" }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    
    // Basic Details (15%) + Location (15%) + Contact (10%) = 40%
    expect(result.current.completionData.percentage).toBe(40);
  });

  it("returns null completion data if no propertyId is provided", () => {
    setupMocks({});
    const { result } = renderHook(() => usePropertyCompletion(null), { wrapper });
    
    expect(result.current.completionData).toBeNull();
  });
});
