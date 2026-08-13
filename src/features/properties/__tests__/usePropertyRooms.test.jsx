import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePropertyRooms } from "../hooks/usePropertyRooms.js";
import { getPropertyRooms } from "../api/propertyRooms.api.js";

vi.mock("../api/propertyRooms.api.js", () => ({
  getPropertyRooms: vi.fn(),
}));

describe("usePropertyRooms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it("fetches property rooms using propertyId", async () => {
    getPropertyRooms.mockResolvedValue({ data: [{ room_id: 1 }] });
    
    const { result } = renderHook(() => usePropertyRooms(123), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(getPropertyRooms).toHaveBeenCalledWith(123);
    expect(result.current.data).toEqual({ data: [{ room_id: 1 }] });
  });

  it("is disabled when propertyId is falsy", () => {
    const { result } = renderHook(() => usePropertyRooms(null), { wrapper });
    
    expect(result.current.fetchStatus).toBe("idle");
    expect(getPropertyRooms).not.toHaveBeenCalled();
  });
});
