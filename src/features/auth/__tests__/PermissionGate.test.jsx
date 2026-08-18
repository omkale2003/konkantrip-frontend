import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PermissionGate from "../../../components/common/PermissionGate.jsx";
import storageService from "../../../services/storage.service.js";
import tokenService from "../../../services/token.service.js";

describe("PermissionGate Component Suite", () => {
  beforeEach(() => {
    storageService.clearAuthStorage();
    tokenService.removeToken();
  });

  it("renders children for property owners unconditionally", () => {
    tokenService.setToken("owner-token");
    storageService.setOwner({ p_owner_id: 2, email: "owner@test.com" });

    render(
      <PermissionGate permission="rooms:delete">
        <button>Delete Room</button>
      </PermissionGate>
    );

    expect(screen.getByText("Delete Room")).toBeInTheDocument();
  });

  it("hides children when employee lacks required permission", () => {
    tokenService.setToken("emp-token");
    storageService.setEmployee({
      employee_id: 1,
      permissions: ["rooms:read"],
    });

    render(
      <PermissionGate
        permission="rooms:delete"
        fallback={<span>Access Restricted</span>}
      >
        <button>Delete Room</button>
      </PermissionGate>
    );

    expect(screen.queryByText("Delete Room")).not.toBeInTheDocument();
    expect(screen.getByText("Access Restricted")).toBeInTheDocument();
  });

  it("renders children when employee has the required permission", () => {
    tokenService.setToken("emp-token");
    storageService.setEmployee({
      employee_id: 1,
      permissions: ["rooms:create", "rooms:read"],
    });

    render(
      <PermissionGate permission="rooms:create">
        <button>Add New Room</button>
      </PermissionGate>
    );

    expect(screen.getByText("Add New Room")).toBeInTheDocument();
  });

  it("enforces property assignment restrictions", () => {
    tokenService.setToken("emp-token");
    storageService.setEmployee({
      employee_id: 1,
      permissions: ["rooms:create"],
      assigned_properties: [2],
    });

    // Allowed on assigned property #2
    const { unmount } = render(
      <PermissionGate permission="rooms:create" propertyId={2}>
        <button id="btn1">Add Room Prop 2</button>
      </PermissionGate>
    );
    expect(screen.getByText("Add Room Prop 2")).toBeInTheDocument();
    unmount();

    // Blocked on unassigned property #99
    render(
      <PermissionGate permission="rooms:create" propertyId={99}>
        <button id="btn2">Add Room Prop 99</button>
      </PermissionGate>
    );
    expect(screen.queryByText("Add Room Prop 99")).not.toBeInTheDocument();
  });
});
