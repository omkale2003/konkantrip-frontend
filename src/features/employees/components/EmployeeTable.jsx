import {
  MoreVertical,
  Edit2,
  Trash2,
  Building2,
  Phone,
  Mail,
  Shield,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserX,
  Monitor,
} from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "../../../utils/imageUrl.js";

function getStatusBadge(status) {
  switch (status) {
    case "Active":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </span>
      );
    case "Inactive":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          <UserX className="h-3 w-3" />
          Inactive
        </span>
      );
    case "On Leave":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          <Clock className="h-3 w-3" />
          On Leave
        </span>
      );
    case "Suspended":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <AlertCircle className="h-3 w-3" />
          Suspended
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {status || "Unknown"}
        </span>
      );
  }
}

function EmployeeTable({
  employees = [],
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onAssignProperty,
  onManageSessions,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Staff Member
              </th>
              <th scope="col" className="px-5 py-3.5">
                Role & Department
              </th>
              <th scope="col" className="px-5 py-3.5">
                Assigned Properties
              </th>
              <th scope="col" className="px-5 py-3.5">
                Contact Info
              </th>
              <th scope="col" className="px-5 py-3.5">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No employees found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try adjusting your filters or click &quot;Add Employee&quot; to onboard staff.
                  </p>
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const assigned = emp.assigned_properties || [];
                const primaryProp = assigned.find((p) => p.is_primary) || assigned[0];
                const fullName = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
                const initials = `${emp.first_name?.[0] || ""}${emp.last_name?.[0] || ""}`.toUpperCase() || "ST";

                return (
                  <tr
                    key={emp.employee_id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* Staff Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {emp.avatar_url ? (
                          <img
                            src={getImageUrl(emp.avatar_url, "")}
                            alt={fullName}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-xs font-bold text-emerald-800">
                            {initials}
                          </div>
                        )}
                        <div>
                          <button
                            type="button"
                            onClick={() => onViewEmployee(emp)}
                            className="text-sm font-bold text-slate-900 transition hover:text-emerald-700 hover:underline"
                          >
                            {fullName}
                          </button>
                          <p className="text-xs text-slate-500">
                            {emp.designation || "Staff Member"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Department */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                          <Shield className="h-3 w-3" />
                          {emp.role_name || "General Staff"}
                        </span>
                        {emp.department && (
                          <p className="text-xs text-slate-500">{emp.department}</p>
                        )}
                      </div>
                    </td>

                    {/* Assigned Properties */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {assigned.length === 0 ? (
                          <button
                            type="button"
                            onClick={() => onAssignProperty(emp)}
                            className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-500 transition hover:border-emerald-600 hover:text-emerald-700"
                          >
                            <Building2 className="h-3 w-3" />
                            + Assign Property
                          </button>
                        ) : (
                          <>
                            {assigned.slice(0, 2).map((p) => (
                              <span
                                key={p.property_id}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                                  p.is_primary
                                    ? "bg-emerald-100 text-emerald-800 font-semibold"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                <Building2 className="h-3 w-3" />
                                {p.property_name}
                              </span>
                            ))}
                            {assigned.length > 2 && (
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                                +{assigned.length - 2} more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs">
                        {emp.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span>{emp.email}</span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">{getStatusBadge(emp.status)}</td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onManageSessions && onManageSessions(emp)}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="Active Login Sessions"
                          >
                            <Monitor className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onViewEmployee(emp)}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditEmployee(emp)}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
                            title="Edit Employee"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteEmployee(emp)}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Deactivate / Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
