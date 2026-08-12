import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useProperties,
  useProperty,
  useCreateProperty,
  useUpdateProperty,
} from "../hooks/useProperties.js";
import * as propertiesApi from "../api/properties.api.js";

vi.mock("../api/properties.api.js", () => ({
  getProperties: vi.fn(),
  getPropertyById: vi.fn(),
  createProperty: vi.fn(),
  updateProperty: vi.fn(),
  deleteProperty: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useProperties hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches properties list using useProperties", async () => {
    const mockData = { success: true, data: [{ property_id: 1 }] };
    propertiesApi.getProperties.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useProperties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("fetches property detail using useProperty when ID is present", async () => {
    const mockData = { success: true, data: { property_id: 1, property_name: "Villa" } };
    propertiesApi.getPropertyById.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useProperty(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("triggers createProperty mutation using useCreateProperty", async () => {
    propertiesApi.createProperty.mockResolvedValueOnce({
      success: true,
      data: { property_id: 5 },
    });

    const { result } = renderHook(() => useCreateProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ property_name: "New Resort" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(propertiesApi.createProperty).toHaveBeenCalledWith(
      expect.objectContaining({ property_name: "New Resort" }),
      expect.anything()
    );
  });

  it("triggers updateProperty mutation using useUpdateProperty", async () => {
    propertiesApi.updateProperty.mockResolvedValueOnce({
      success: true,
      data: { property_id: 5, property_name: "Updated Resort" },
    });

    const { result } = renderHook(() => useUpdateProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ propertyId: 5, propertyData: { property_name: "Updated Resort" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(propertiesApi.updateProperty).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyId: 5,
        propertyData: { property_name: "Updated Resort" },
      }),
      expect.anything()
    );
  });
});
