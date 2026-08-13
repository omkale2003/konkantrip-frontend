import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useRooms } from "./useRooms.js";
import { createTestQueryClient } from "../../../test/testUtils.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import apiClient from "../../../services/apiClient.js";

vi.mock("../../../services/apiClient.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useRooms hooks", () => {
  it("useRooms fetches rooms for a property", async () => {
    const mockData = { data: [{ room_id: 1, room_name: "Test Room" }] };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useRooms({ property_id: "123" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("/rooms"),
      expect.objectContaining({ params: { property_id: "123" } })
    );
  });
});
