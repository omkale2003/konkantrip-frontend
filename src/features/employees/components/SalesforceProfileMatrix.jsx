import React from "react";
import { Shield, Lock, CheckCircle2, ShieldCheck, CheckSquare, Square } from "lucide-react";

// Friendly module metadata mapping
const MODULE_METADATA = {
  properties: {
    name: "Properties & Locations",
    description: "Property master profiles, locations, media, policies & amenities",
  },
  rooms: {
    name: "Rooms & Units",
    description: "Room types, inventory categories, base rates, amenities & beds",
  },
  inventory: {
    name: "Inventory & Calendar",
    description: "Daily room counts, stop-sells, blockings & rate calendar",
  },
  pricing: {
    name: "Pricing & Discounts",
    description: "Seasonal rates, promotional discount rules & price overrides",
  },
  bookings: {
    name: "Bookings & Front Desk",
    description: "Reservations, check-ins, guest folios & status updates",
  },
  housekeeping: {
    name: "Housekeeping",
    description: "Room cleanliness, turn-down tasks & cleaning inspections",
  },
  maintenance: {
    name: "Maintenance",
    description: "Work orders, repair tickets & maintenance room blocks",
  },
  employees: {
    name: "Staff & CRM",
    description: "Employee profiles, department roles, property assignments & sessions",
  },
  roles: {
    name: "Roles & RBAC",
    description: "Role definitions, permissions & security access policies",
  },
  audit: {
    name: "Audit Trail & Governance",
    description: "Activity logs, change histories, session inspections & compliance",
  },
  reports: {
    name: "Reports & Analytics",
    description: "Occupancy metrics, revenue insights & operational reporting",
  },
  financials: {
    name: "Financials & Billing",
    description: "Invoices, payment transactions & financial statements",
  },
};

export function SalesforceProfileMatrix({
  selectedRole = null,
  availablePermissions = [],
  selectedPermissionIds = [],
  onTogglePermission,
  onToggleModule,
  isReadOnly = false,
}) {
  // If in read-only mode and a role is selected, extract its permission IDs or codes
  const effectiveSelectedIds = React.useMemo(() => {
    if (selectedPermissionIds && selectedPermissionIds.length > 0) {
      return new Set(selectedPermissionIds.map((p) => (typeof p === "object" ? p.permission_id : Number(p))));
    }
    if (selectedRole?.permissions) {
      return new Set(
        selectedRole.permissions.map((p) => (typeof p === "object" ? p.permission_id : Number(p)))
      );
    }
    return new Set();
  }, [selectedPermissionIds, selectedRole]);

  // Group real database permissions by module
  const groupedModules = React.useMemo(() => {
    const map = {};
    for (const perm of availablePermissions) {
      const mod = perm.module || "other";
      if (!map[mod]) {
        map[mod] = {
          key: mod,
          name: MODULE_METADATA[mod]?.name || mod.charAt(0).toUpperCase() + mod.slice(1),
          description: MODULE_METADATA[mod]?.description || `Access and controls for ${mod} module`,
          permissions: [],
        };
      }
      map[mod].permissions.push(perm);
    }
    return Object.values(map);
  }, [availablePermissions]);

  const isSystemRole = Boolean(selectedRole?.is_system_role);
  const isInteractive = !isReadOnly && !isSystemRole && typeof onTogglePermission === "function";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              Salesforce-Style Object & Profile Permissions Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Profile: <span className="font-semibold text-slate-700">{selectedRole?.role_name || "Custom Role"}</span>
              {availablePermissions.length > 0 && (
                <span className="ml-2 text-slate-400">({availablePermissions.length} total database permissions)</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSystemRole ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" /> System Protected Profile
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Dynamic RBAC Profile
            </span>
          )}
        </div>
      </div>

      {/* Permissions Grid */}
      {groupedModules.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          Loading permissions catalog from database...
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {groupedModules.map((mod) => {
            const modulePermIds = mod.permissions.map((p) => p.permission_id);
            const activeInModuleCount = modulePermIds.filter((id) => effectiveSelectedIds.has(id)).length;
            const isAllSelected = modulePermIds.length > 0 && activeInModuleCount === modulePermIds.length;

            return (
              <div key={mod.key} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{mod.name}</h4>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {activeInModuleCount} / {mod.permissions.length} active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                  </div>

                  {isInteractive && onToggleModule && (
                    <button
                      type="button"
                      onClick={() => onToggleModule(mod.key)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition self-start sm:self-auto cursor-pointer"
                    >
                      {isAllSelected ? "Deselect Module" : "Select All Module"}
                    </button>
                  )}
                </div>

                {/* Granular Action Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-2">
                  {mod.permissions.map((perm) => {
                    const isChecked = effectiveSelectedIds.has(perm.permission_id);

                    return (
                      <label
                        key={perm.permission_id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        } ${!isInteractive ? "cursor-default" : ""}`}
                      >
                        <input
                          type="checkbox"
                          disabled={!isInteractive}
                          checked={isChecked}
                          onChange={() => isInteractive && onTogglePermission(perm.permission_id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0 cursor-pointer disabled:cursor-default"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold capitalize text-slate-800">
                            {perm.action.replace(/_/g, " ")}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {perm.description || perm.permission_code}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SalesforceProfileMatrix;
