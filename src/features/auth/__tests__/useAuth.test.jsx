import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useAuth from "../hooks/useAuth.js";
import storageService from "../../../services/storage.service.js";
import tokenService from "../../../services/token.service.js";

describe("useAuth Hook Suite", () => {
  beforeEach(() => {
    storageService.clearAuthStorage();
    tokenService.removeToken();
  });

  it("identifies unauthenticated guest state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.hasPermission("rooms:create")).toBe(false);
  });

  it("identifies property owner and bypasses all permission checks", () => {
    tokenService.setToken("mock-owner-token");
    storageService.setOwner({
      p_owner_id: 2,
      first_name: "Ramesh",
      last_name: "Patil",
      email: "owner@konkantrip.com",
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isOwner).toBe(true);
    expect(result.current.isEmployee).toBe(false);
    expect(result.current.hasPermission("rooms:create")).toBe(true);
    expect(result.current.hasPermission("anything:arbitrary")).toBe(true);
    expect(result.current.canManageProperty(999)).toBe(true);
  });

  it("identifies employee and checks explicit permissions and assigned properties", () => {
    tokenService.setToken("mock-employee-token");
    storageService.setEmployee({
      employee_id: 10,
      first_name: "Rahul",
      last_name: "Staff",
      role_name: "Front Desk",
      role_slug: "front-desk",
      permissions: ["rooms:read", "bookings:read", "bookings:create"],
      assigned_properties: [2, 5],
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isOwner).toBe(false);
    expect(result.current.isEmployee).toBe(true);
    expect(result.current.roleName).toBe("Front Desk");

    // Permitted
    expect(result.current.hasPermission("rooms:read")).toBe(true);
    expect(result.current.hasPermission("bookings:read")).toBe(true);

    // Forbidden
    expect(result.current.hasPermission("rooms:create")).toBe(false);
    expect(result.current.hasPermission("employees:create")).toBe(false);

    // Property scoping
    expect(result.current.canManageProperty(2)).toBe(true);
    expect(result.current.canManageProperty(5)).toBe(true);
    expect(result.current.canManageProperty(99)).toBe(false);
  });
});
