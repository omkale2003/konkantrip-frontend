import { describe, it, expect, vi } from "vitest";
import { getPropertyRooms } from "../api/propertyRooms.api.js";
import apiClient from "../../../services/apiClient.js";

vi.mock("../../../services/apiClient.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("propertyRooms.api", () => {
  it("getPropertyRooms calls correct endpoint and returns data", async () => {
    const mockData = { data: [{ room_id: 1 }] };
    apiClient.get.mockResolvedValue({ data: mockData });
    
    const result = await getPropertyRooms(123);
    
    expect(apiClient.get).toHaveBeenCalledWith("/properties/123/rooms");
    expect(result).toEqual(mockData);
  });
});
