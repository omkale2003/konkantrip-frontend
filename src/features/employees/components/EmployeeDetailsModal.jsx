import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  Calendar,
  IndianRupee,
  Briefcase,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserX,
  MapPin,
  HeartHandshake,
  Edit2,
} from "lucide-react";
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

function EmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
  onEdit,
  onManageProperties,
}) {
  if (!isOpen || !employee) return null;

  const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
  const initials = `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`.toUpperCase() || "ST";
  const assigned = employee.assigned_properties || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Staff Profile Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Hero Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-4">
              {employee.avatar_url ? (
                <img
                  src={getImageUrl(employee.avatar_url, "")}
                  alt={fullName}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-16 w-16 rounded-full border-2 border-emerald-200 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-100 text-lg font-bold text-emerald-800">
                  {initials}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {fullName}
                  </h3>
                  {getStatusBadge(employee.status)}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {employee.designation || "Staff Member"} &bull; {employee.department || "General Operations"}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                    <Shield className="h-3 w-3" />
                    {employee.role_name || "General Staff"}
                  </span>
                  <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {employee.employment_type || "Full-time"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Contact Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact & Personal
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">Email:</span>
                  <span className="truncate">{employee.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">Phone:</span>
                  <span>{employee.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">Joining Date:</span>
                  <span>
                    {employee.joining_date
                      ? new Date(employee.joining_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">Gender:</span>
                  <span>{employee.gender || "Not specified"}</span>
                </div>
                {employee.address && (
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{employee.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Compensation & KYC */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Compensation & KYC
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Monthly Salary:</span>
                  <span className="font-bold text-emerald-700">
                    ₹{Number(employee.salary || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">ID Proof:</span>
                  <span>
                    {employee.id_proof_type || "Aadhaar"} &bull;{" "}
                    {employee.id_proof_number || "Not uploaded"}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="font-semibold text-slate-900">Emergency Contact:</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 pl-6">
                    {employee.emergency_contact_name || "N/A"}{" "}
                    {employee.emergency_contact_phone && `(${employee.emergency_contact_phone})`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Properties */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Properties ({assigned.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onManageProperties(employee);
                }}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                + Manage Assignments
              </button>
            </div>

            {assigned.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No properties assigned to this staff member yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {assigned.map((p) => (
                  <div
                    key={p.property_id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800">
                        {p.property_name}
                      </span>
                    </div>
                    {p.is_primary && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        Primary Property
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailsModal;
