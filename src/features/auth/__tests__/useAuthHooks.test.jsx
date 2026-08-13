import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../hooks/useAuth.js";
import tokenService from "../../../services/token.service.js";
import storageService from "../../../services/storage.service.js";

describe("useAuth hook", () => {
  beforeEach(() => {
    tokenService.removeToken();
    storageService.removeOwner();
  });

  it("returns unauthenticated state when no token is present", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.owner).toBeNull();
  });

  it("returns authenticated state when token and owner exist", () => {
    tokenService.setToken("mock-jwt");
    storageService.setOwner({ p_owner_id: 1, email: "owner@example.com" });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.owner).toEqual({ p_owner_id: 1, email: "owner@example.com" });
  });

  it("clears tokens and owner state on logout", () => {
    tokenService.setToken("mock-jwt");
    storageService.setOwner({ p_owner_id: 1 });

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(tokenService.hasToken()).toBe(false);
    expect(storageService.getOwner()).toBeNull();
    expect(result.current.owner).toBeNull();
  });
});
