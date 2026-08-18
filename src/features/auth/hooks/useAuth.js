import { useState, useCallback } from "react";
import storageService from "../../../services/storage.service.js";
import tokenService from "../../../services/token.service.js";

export function useAuth() {
  const [token, setTokenState] = useState(() => tokenService.getToken());
  const [user, setUserState] = useState(() =>
    tokenService.getToken() ? storageService.getUser() : null
  );

  const isAuthenticated = Boolean(token && user);
  const userType = token ? storageService.getUserType() : "guest";
  const isOwner = userType === "owner";
  const isEmployee = userType === "employee";
  const isAdmin = userType === "admin" || Boolean(user?.is_admin);

  const permissions = storageService.getPermissions();
  const assignedProperties = storageService.getAssignedProperties();

  const hasPermission = useCallback(
    (permissionCode) => {
      if (!isAuthenticated) return false;
      if (isOwner || isAdmin) return true;
      if (!permissionCode) return true;

      const perms = storageService.getPermissions();
      return perms.includes("*") || perms.includes(permissionCode);
    },
    [isAuthenticated, isOwner, isAdmin]
  );

  const canManageProperty = useCallback(
    (propertyId) => {
      if (!isAuthenticated) return false;
      if (isOwner || isAdmin) return true;
      if (!propertyId) return false;

      const assigned = storageService.getAssignedProperties();
      if (!assigned) return true; // all
      return assigned.map(Number).includes(Number(propertyId));
    },
    [isAuthenticated, isOwner, isAdmin]
  );

  const logout = useCallback(() => {
    tokenService.removeToken();
    storageService.clearAuthStorage();
    setTokenState(null);
    setUserState(null);

    if (typeof window !== "undefined" && window.location && window.location.pathname !== "/login") {
      try {
        window.location.href = "/login";
      } catch {}
    }
  }, []);

  return {
    user,
    owner: user,
    userType,
    isAuthenticated,
    isOwner,
    isEmployee,
    isAdmin,
    roleName: user?.role_name || (isOwner ? "Property Owner" : "Staff"),
    roleSlug: user?.role_slug,
    permissions,
    assignedProperties,
    hasPermission,
    canManageProperty,
    logout,
  };
}

export default useAuth;