import {
  Building2,
  Phone,
  Mail,
  Shield,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserX,
  UserPlus,
} from "lucide-react";

function getStatusBadge(status) {
  switch (status) {
    case "Active":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </span>
      );
    case "Inactive":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          <UserX className="h-3 w-3" />
          Inactive
        </span>
      );
    case "On Leave":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
          <Clock className="h-3 w-3" />
          On Leave
        </span>
      );
    case "Suspended":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
          <AlertCircle className="h-3 w-3" />
          Suspended
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          {status || "Unknown"}
        </span>
      );
  }
}

function EmployeeCardGrid({
  employees = [],
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onAssignProperty,
}) {
  if (employees.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Shield className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700">
          No employees found
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Try adjusting your filters or click &quot;Add Employee&quot; to onboard staff.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map((emp) => {
        const assigned = emp.assigned_properties || [];
        const fullName = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
        const initials = `${emp.first_name?.[0] || ""}${emp.last_name?.[0] || ""}`.toUpperCase() || "ST";

        return (
          <div
            key={emp.employee_id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            {/* Header: Avatar, Name, Status */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {emp.avatar_url ? (
                    <img
                      src={emp.avatar_url}
                      alt={fullName}
                      className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-sm font-bold text-emerald-800">
                      {initials}
                    </div>
                  )}

                  <div>
                    <h3
                      onClick={() => onViewEmployee(emp)}
                      className="cursor-pointer text-sm font-bold text-slate-900 transition hover:text-emerald-700"
                    >
                      {fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {emp.designation || "Staff Member"}
                    </p>
                  </div>
                </div>

                {getStatusBadge(emp.status)}
              </div>

              {/* Role & Department badges */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                  <Shield className="h-3 w-3" />
                  {emp.role_name || "General Staff"}
                </span>

                {emp.department && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
                    {emp.department}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                {emp.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                )}
                {emp.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{emp.phone}</span>
                  </div>
                )}
              </div>

              {/* Assigned Properties */}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Properties
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {assigned.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => onAssignProperty(emp)}
                      className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:border-emerald-600 hover:text-emerald-700"
                    >
                      <Building2 className="h-3 w-3" />
                      + Assign Property
                    </button>
                  ) : (
                    assigned.map((p) => (
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
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => onAssignProperty(emp)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-emerald-700"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Manage Props
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onViewEmployee(emp)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
                  title="View Profile"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEditEmployee(emp)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
                  title="Edit Profile"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteEmployee(emp)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EmployeeCardGrid;
