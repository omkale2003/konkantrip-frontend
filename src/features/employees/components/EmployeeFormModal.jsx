import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Building2,
  Calendar,
  IndianRupee,
  Briefcase,
  FileCheck,
  AlertCircle,
} from "lucide-react";

const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().max(100).optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(20).optional(),
  password: z.string().optional(),
  role_id: z.coerce.number().min(1, "Please select a role"),
  status: z.enum(["Active", "Inactive", "Suspended", "On Leave"]).default("Active"),
  designation: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  employment_type: z.enum(["Full-time", "Part-time", "Contract", "Seasonal"]).default("Full-time"),
  salary: z.coerce.number().min(0).optional().default(0),
  joining_date: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  emergency_contact_name: z.string().max(100).optional(),
  emergency_contact_phone: z.string().max(20).optional(),
  address: z.string().optional(),
  id_proof_type: z.enum(["Aadhaar", "Passport", "Driving License", "Voter ID", "PAN", ""]).optional(),
  id_proof_number: z.string().max(100).optional(),
  assigned_property_ids: z.array(z.coerce.number()).optional().default([]),
  primary_property_id: z.coerce.number().optional(),
});

function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  roles = [],
  properties = [],
  isSubmitting = false,
  serverError = "",
}) {
  const isEditing = Boolean(initialData?.employee_id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role_id: "",
      status: "Active",
      designation: "",
      department: "Front Desk",
      employment_type: "Full-time",
      salary: 0,
      joining_date: new Date().toISOString().split("T")[0],
      date_of_birth: "",
      gender: "Male",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      address: "",
      id_proof_type: "Aadhaar",
      id_proof_number: "",
      assigned_property_ids: [],
      primary_property_id: undefined,
    },
  });

  const selectedProperties = watch("assigned_property_ids") || [];
  const primaryPropertyId = watch("primary_property_id");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const assignedIds = (initialData.assigned_properties || []).map(
          (p) => p.property_id
        );
        const primary = (initialData.assigned_properties || []).find(
          (p) => p.is_primary
        )?.property_id;

        reset({
          first_name: initialData.first_name || "",
          last_name: initialData.last_name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          password: "", // do not populate password on edit
          role_id: initialData.role_id || "",
          status: initialData.status || "Active",
          designation: initialData.designation || "",
          department: initialData.department || "Front Desk",
          employment_type: initialData.employment_type || "Full-time",
          salary: initialData.salary ? Number(initialData.salary) : 0,
          joining_date: initialData.joining_date
            ? initialData.joining_date.split("T")[0]
            : "",
          date_of_birth: initialData.date_of_birth
            ? initialData.date_of_birth.split("T")[0]
            : "",
          gender: initialData.gender || "Male",
          emergency_contact_name: initialData.emergency_contact_name || "",
          emergency_contact_phone: initialData.emergency_contact_phone || "",
          address: initialData.address || "",
          id_proof_type: initialData.id_proof_type || "Aadhaar",
          id_proof_number: initialData.id_proof_number || "",
          assigned_property_ids: assignedIds,
          primary_property_id: primary || assignedIds[0] || undefined,
        });
      } else {
        reset({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          role_id: roles[0]?.role_id || "",
          status: "Active",
          designation: "",
          department: "Front Desk",
          employment_type: "Full-time",
          salary: 0,
          joining_date: new Date().toISOString().split("T")[0],
          date_of_birth: "",
          gender: "Male",
          emergency_contact_name: "",
          emergency_contact_phone: "",
          address: "",
          id_proof_type: "Aadhaar",
          id_proof_number: "",
          assigned_property_ids: properties[0]?.property_id
            ? [properties[0].property_id]
            : [],
          primary_property_id: properties[0]?.property_id || undefined,
        });
      }
    }
  }, [isOpen, initialData, reset, roles, properties]);

  if (!isOpen) return null;

  const handlePropertyToggle = (propertyId) => {
    const numericId = Number(propertyId);
    let next;
    if (selectedProperties.includes(numericId)) {
      next = selectedProperties.filter((id) => id !== numericId);
      if (primaryPropertyId === numericId) {
        setValue("primary_property_id", next[0] || undefined);
      }
    } else {
      next = [...selectedProperties, numericId];
      if (!primaryPropertyId) {
        setValue("primary_property_id", numericId);
      }
    }
    setValue("assigned_property_ids", next);
  };

  const handleFormSubmit = (data) => {
    const payload = { ...data };
    if (isEditing && !payload.password) {
      delete payload.password;
    }
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? "Edit Employee Profile" : "Add New Employee"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Update employee details for ${initialData?.first_name || ""} ${initialData?.last_name || ""}`
                  : "Onboard new staff member and assign role & properties"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
        >
          {/* Section 1: Basic & Identity Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul"
                  {...register("first_name")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sawant"
                  {...register("last_name")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    {...register("email")}
                    className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register("phone")}
                    className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Password (Required for create, optional for update) */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  {isEditing ? "Change Password (Leave blank to keep)" : "Login Password"} {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder={isEditing ? "••••••••" : "Minimum 6 characters"}
                    {...register("password")}
                    className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Role, Designation & Employment */}
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Role & Employment Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Assigned Role <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("role_id")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      {r.role_name} {r.is_system_role ? "(System)" : "(Custom)"}
                    </option>
                  ))}
                </select>
                {errors.role_id && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.role_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Front Desk Executive"
                  {...register("designation")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Department
                </label>
                <select
                  {...register("department")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Management">Management</option>
                  <option value="Accounts">Accounts & Finance</option>
                  <option value="F&B">Food & Beverage</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Employment Type
                </label>
                <select
                  {...register("employment_type")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Monthly Salary (₹)
                </label>
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 20000"
                    {...register("salary")}
                    className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  {...register("joining_date")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("date_of_birth")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Property Assignment */}
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Property Assignments
              </h3>
              <span className="text-xs text-slate-500">
                Select properties this staff member manages
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {properties.map((prop) => {
                const isSelected = selectedProperties.includes(prop.property_id);
                const isPrimary = primaryPropertyId === prop.property_id;

                return (
                  <div
                    key={prop.property_id}
                    onClick={() => handlePropertyToggle(prop.property_id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {prop.property_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {prop.property_type || "Hotel"}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue("primary_property_id", prop.property_id);
                        }}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isPrimary
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600 hover:bg-emerald-200 hover:text-emerald-800"
                        }`}
                      >
                        {isPrimary ? "Primary" : "Set Primary"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: KYC & Emergency Contact */}
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              4. KYC & Emergency Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  ID Proof Type
                </label>
                <select
                  {...register("id_proof_type")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="PAN">PAN Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  ID Proof Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234 5678 9012"
                  {...register("id_proof_number")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Sawant (Father)"
                  {...register("emergency_contact_name")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  {...register("emergency_contact_phone")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Full residential address..."
                  {...register("address")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeFormModal;
