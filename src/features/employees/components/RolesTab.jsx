import { useState } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Lock,
} from "lucide-react";
import SalesforceProfileMatrix from "./SalesforceProfileMatrix.jsx";

function RolesTab({
  roles = [],
  permissions = [],
  onCreateRole,
  onEditRole,
  onDeleteRole,
}) {
  const [selectedRole, setSelectedRole] = useState(roles[0] || null);

  const activeRole = selectedRole || roles[0] || null;

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Roles & Permissions Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Manage system roles and configure custom permissions for your hospitality staff.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateRole}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Custom Role
        </button>
      </div>

      {/* Main split view: Left list of roles, Right permission matrix */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Roles List Sidebar */}
        <div className="space-y-3 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm space-y-1.5">
            <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Configured Roles ({roles.length})
            </p>

            {roles.map((role) => {
              const isSelected = activeRole?.role_id === role.role_id;
              const isSystem = Boolean(role.is_system_role);

              return (
                <div
                  key={role.role_id}
                  onClick={() => setSelectedRole(role)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl p-3 text-left transition ${
                    isSelected
                      ? "border-l-4 border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-emerald-700" : "text-slate-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {role.role_name}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {role.role_description || "System standard role"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSystem ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        <Lock className="h-3 w-3" />
                        System
                      </span>
                    ) : (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Role Permissions Detail */}
        <div className="lg:col-span-8 space-y-4">
          {activeRole ? (
            <div className="space-y-4">
              {/* Role Action Controls */}
              {!activeRole.is_system_role && (
                <div className="flex items-center justify-end gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => onEditRole(activeRole)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Role
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRole(activeRole)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              )}

              {/* Dynamic Database-backed Salesforce Profile Matrix */}
              <SalesforceProfileMatrix
                selectedRole={activeRole}
                availablePermissions={permissions}
                isReadOnly={true}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Select a role from the left list to view permission details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RolesTab;
