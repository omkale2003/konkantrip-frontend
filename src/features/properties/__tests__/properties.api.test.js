import { describe, it, expect, beforeEach, vi } from "vitest";
import apiClient from "../../../services/apiClient.js";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../api/properties.api.js";

vi.mock("../../../services/apiClient.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("properties.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls GET /api/v1/properties with query params", async () => {
    const mockData = { success: true, data: [{ property_id: 10 }] };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await getProperties({ page: 1, limit: 10 });

    expect(apiClient.get).toHaveBeenCalledWith("/properties", {
      params: { page: 1, limit: 10 },
    });
    expect(result).toEqual(mockData);
  });

  it("calls GET /api/v1/properties/:id", async () => {
    const mockData = { success: true, data: { property_id: 10, property_name: "Beach Villa" } };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await getPropertyById(10);

    expect(apiClient.get).toHaveBeenCalledWith("/properties/10");
    expect(result).toEqual(mockData);
  });

  it("calls POST /api/v1/properties to create property", async () => {
    const payload = { property_name: "New Resort", property_type: "Resort" };
    const mockResponse = { success: true, data: { property_id: 25, ...payload } };
    apiClient.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await createProperty(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/properties", payload);
    expect(result).toEqual(mockResponse);
  });

  it("calls PUT /api/v1/properties/:id with target propertyId and payload", async () => {
    const payload = { property_name: "Updated Resort Name" };
    const mockResponse = { success: true, data: { property_id: 25, ...payload } };
    apiClient.put.mockResolvedValueOnce({ data: mockResponse });

    const result = await updateProperty({ propertyId: 25, propertyData: payload });

    expect(apiClient.put).toHaveBeenCalledWith("/properties/25", payload);
    expect(result).toEqual(mockResponse);
  });

  it("calls DELETE /api/v1/properties/:id", async () => {
    const mockResponse = { success: true, message: "Property deleted" };
    apiClient.delete.mockResolvedValueOnce({ data: mockResponse });

    const result = await deleteProperty(25);

    expect(apiClient.delete).toHaveBeenCalledWith("/properties/25");
    expect(result).toEqual(mockResponse);
  });
});
