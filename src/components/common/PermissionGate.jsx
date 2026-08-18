import useAuth from "../../features/auth/hooks/useAuth.js";

/**
 * Declarative RBAC Permission Gate
 * Renders children only if current user has the required permission(s).
 */
export function PermissionGate({
  permission,
  permissions = [],
  requireAll = false,
  propertyId,
  fallback = null,
  children,
}) {
  const { hasPermission, canManageProperty, isOwner, isAdmin } = useAuth();

  if (isOwner || isAdmin) {
    return <>{children}</>;
  }

  // Check property-level scoping if propertyId passed
  if (propertyId && !canManageProperty(propertyId)) {
    return fallback;
  }

  // Single permission check
  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  // Multiple permissions check
  if (permissions.length > 0) {
    if (requireAll) {
      const hasAll = permissions.every((p) => hasPermission(p));
      if (!hasAll) return fallback;
    } else {
      const hasAny = permissions.some((p) => hasPermission(p));
      if (!hasAny) return fallback;
    }
  }

  return <>{children}</>;
}

export default PermissionGate;
