const USER_STORAGE_KEY = "konkantrip_user";
const OWNER_STORAGE_KEY = "konkantrip_owner"; // Legacy fallback
const USER_TYPE_KEY = "konkantrip_user_type";
const PERMISSIONS_KEY = "konkantrip_permissions";
const ASSIGNED_PROPERTIES_KEY = "konkantrip_assigned_properties";

const storageService = {
  getUser() {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem(OWNER_STORAGE_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(OWNER_STORAGE_KEY);
      return null;
    }
  },

  setUser(user, userType = "owner") {
    if (!user) return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(user)); // For backward compatibility
    localStorage.setItem(USER_TYPE_KEY, userType);

    if (Array.isArray(user.permissions)) {
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(user.permissions));
    }
    if (Array.isArray(user.assigned_properties)) {
      localStorage.setItem(ASSIGNED_PROPERTIES_KEY, JSON.stringify(user.assigned_properties));
    }
  },

  getOwner() {
    return this.getUser();
  },

  setOwner(owner) {
    this.setUser(owner, "owner");
  },

  removeOwner() {
    this.clearAuthStorage();
  },

  getEmployee() {
    const user = this.getUser();
    return this.getUserType() === "employee" ? user : null;
  },

  setEmployee(employee) {
    this.setUser(employee, "employee");
  },

  getUserType() {
    const type = localStorage.getItem(USER_TYPE_KEY);
    if (type) return type;
    const user = this.getUser();
    if (user?.employee_id) return "employee";
    if (user?.p_owner_id) return "owner";
    return "guest";
  },

  getPermissions() {
    const user = this.getUser();
    // Owners have all permissions
    if (this.getUserType() === "owner") {
      return ["*"];
    }

    const storedPerms = localStorage.getItem(PERMISSIONS_KEY);
    if (storedPerms) {
      try {
        return JSON.parse(storedPerms);
      } catch {
        return [];
      }
    }

    return Array.isArray(user?.permissions) ? user.permissions : [];
  },

  getAssignedProperties() {
    const user = this.getUser();
    if (this.getUserType() === "owner") {
      return null; // All properties
    }

    const stored = localStorage.getItem(ASSIGNED_PROPERTIES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }

    return Array.isArray(user?.assigned_properties) ? user.assigned_properties : [];
  },

  hasPermission(permissionCode) {
    const userType = this.getUserType();
    if (userType === "owner" || userType === "admin") return true;

    const permissions = this.getPermissions();
    if (permissions.includes("*")) return true;
    return permissions.includes(permissionCode);
  },

  clearAuthStorage() {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(OWNER_STORAGE_KEY);
    localStorage.removeItem(USER_TYPE_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
    localStorage.removeItem(ASSIGNED_PROPERTIES_KEY);
  },
};

export default storageService;