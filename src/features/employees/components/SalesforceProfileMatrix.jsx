import React from "react";
import { Shield, Check, Lock } from "lucide-react";

const STANDARD_OBJECTS = [
  {
    name: "Properties",
    key: "properties",
    description: "Property profiles, locations, media, policies & amenities",
    perms: ["read", "create", "update", "delete", "view_all", "modify_all"],
  },
  {
    name: "Rooms & Units",
    key: "rooms",
    description: "Room types, inventory categories, base rates, amenities & beds",
    perms: ["read", "create", "update", "delete", "view_all", "modify_all"],
  },
  {
    name: "Inventory & Calendar",
    key: "inventory",
    description: "Daily room counts, stop-sells, blockings & rate calendar",
    perms: ["read", "create", "update", "delete", "view_all", "modify_all"],
  },
  {
    name: "Bookings & Guests",
    key: "bookings",
    description: "Reservations, check-ins, guest folios & status updates",
    perms: ["read", "create", "update", "delete", "view_all", "modify_all"],
  },
  {
    name: "Pricing & Discounts",
    key: "pricing",
    description: "Seasonal rates, promotional discount rules & price overrides",
    perms: ["read", "create", "update", "delete", "view_all", "modify_all"],
  },
  {
    name: "Staff & CRM",
    key: "employees",
    description: "Employee profiles, department roles, property assignments & sessions",
    perms: ["read", "create", "update", "delete", "view_all", "modify_all"],
  },
  {
    name: "Audit Trail & Governance",
    key: "audit",
    description: "Activity logs, change histories, session inspections & compliance",
    perms: ["read", "export", "view_all"],
  },
];

export function SalesforceProfileMatrix({ selectedRole, permissions = [], onTogglePermission, isReadOnly = false }) {
  const permSet = new Set(permissions || []);

  const hasPerm = (objKey, action) => {
    if (permSet.has("*")) return true;
    if (action === "view_all") return permSet.has(`${objKey}:read`) && permSet.has(`${objKey}:view_all`);
    if (action === "modify_all") return permSet.has(`${objKey}:delete`) && permSet.has(`${objKey}:update`);
    return permSet.has(`${objKey}:${action}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              Salesforce-Style Profile & Object Permissions Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Configured for profile: <span className="font-medium text-slate-700">{selectedRole?.role_name || "Custom Role"}</span>
            </p>
          </div>
        </div>
        {selectedRole?.is_system_role ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" /> System Protected Profile
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/60 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 min-w-[220px]">Object / Module</th>
              <th className="py-3 px-3 text-center">Read</th>
              <th className="py-3 px-3 text-center">Create</th>
              <th className="py-3 px-3 text-center">Edit</th>
              <th className="py-3 px-3 text-center">Delete</th>
              <th className="py-3 px-3 text-center text-blue-700 bg-blue-50/50">View All</th>
              <th className="py-3 px-3 text-center text-indigo-700 bg-indigo-50/50">Modify All</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {STANDARD_OBJECTS.map((obj) => (
              <tr key={obj.key} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-800">{obj.name}</div>
                  <div className="text-xs text-slate-400 font-normal">{obj.description}</div>
                </td>

                {/* Read */}
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    disabled={isReadOnly || selectedRole?.is_system_role}
                    checked={hasPerm(obj.key, "read")}
                    onChange={() => onTogglePermission && onTogglePermission(`${obj.key}:read`)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                  />
                </td>

                {/* Create */}
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    disabled={isReadOnly || selectedRole?.is_system_role}
                    checked={hasPerm(obj.key, "create")}
                    onChange={() => onTogglePermission && onTogglePermission(`${obj.key}:create`)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                  />
                </td>

                {/* Edit */}
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    disabled={isReadOnly || selectedRole?.is_system_role}
                    checked={hasPerm(obj.key, "update")}
                    onChange={() => onTogglePermission && onTogglePermission(`${obj.key}:update`)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                  />
                </td>

                {/* Delete */}
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    disabled={isReadOnly || selectedRole?.is_system_role}
                    checked={hasPerm(obj.key, "delete")}
                    onChange={() => onTogglePermission && onTogglePermission(`${obj.key}:delete`)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer disabled:opacity-50"
                  />
                </td>

                {/* View All */}
                <td className="py-3.5 px-3 text-center bg-blue-50/20">
                  <input
                    type="checkbox"
                    disabled={isReadOnly || selectedRole?.is_system_role}
                    checked={hasPerm(obj.key, "read")}
                    onChange={() => onTogglePermission && onTogglePermission(`${obj.key}:read`)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                  />
                </td>

                {/* Modify All */}
                <td className="py-3.5 px-3 text-center bg-indigo-50/20">
                  <input
                    type="checkbox"
                    disabled={isReadOnly || selectedRole?.is_system_role}
                    checked={hasPerm(obj.key, "update") && hasPerm(obj.key, "delete")}
                    onChange={() => {
                      if (onTogglePermission) {
                        onTogglePermission(`${obj.key}:update`);
                        onTogglePermission(`${obj.key}:delete`);
                      }
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesforceProfileMatrix;
