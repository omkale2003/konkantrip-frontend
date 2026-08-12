import { useState } from "react";
import { KeyRound, LogOut, ShieldCheck, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth.js";
import { ROUTES } from "../../../constants/routes.js";

function ProfilePage() {
  const navigate = useNavigate();
  const { owner, logout } = useAuth();
  const [showPasswordNotice, setShowPasswordNotice] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const firstName = owner?.first_name ?? "N/A";
  const lastName = owner?.last_name ?? "N/A";
  const email = owner?.email ?? "N/A";
  const mobileNumber =
    owner?.phone ?? owner?.mobile_number ?? owner?.phone_number ?? owner?.mobile ?? "N/A";
  const role = owner?.role ?? "Property Owner";
  const accountStatus = owner?.account_status ?? owner?.status ?? "Active";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Owner Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your property owner account details and manage access.
        </p>
      </div>

      {/* Main Info Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
            {firstName !== "N/A" ? firstName.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {firstName !== "N/A" ? `${firstName} ${lastName !== "N/A" ? lastName : ""}`.trim() : "Property Owner"}
            </h2>
            <p className="text-xs text-slate-500">{email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {accountStatus}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              First Name
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {firstName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Last Name
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {lastName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Email Address
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Mobile Number
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {mobileNumber}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Role
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {role}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Account Status
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {accountStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-4">
          Account Actions
        </h3>

        {showPasswordNotice && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
            Password change functionality will be enabled in the next release.
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPasswordNotice(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
