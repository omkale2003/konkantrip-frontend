import { Bell, KeyRound, LogOut, Shield, Sliders, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth.js";
import { ROUTES } from "../../../constants/routes.js";

function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Account and application preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <User className="h-5 w-5 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Account
            </h2>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            <Link
              to={ROUTES.OWNER_PROFILE}
              className="flex items-center justify-between py-3 transition hover:text-emerald-700"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Profile Details
                </p>
                <p className="text-xs text-slate-500">
                  View and manage your owner account information.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700">
                Manage Profile &rarr;
              </span>
            </Link>

            <div className="flex items-center justify-between py-3 opacity-60">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Change Password
                </p>
                <p className="text-xs text-slate-500">
                  Update your account login password.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                Coming Soon
              </span>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sliders className="h-5 w-5 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Application Preferences
            </h2>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-3 opacity-60">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Notifications
                  </p>
                  <p className="text-xs text-slate-500">
                    Email and SMS booking alerts.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                Coming Soon
              </span>
            </div>

            <div className="flex items-center justify-between py-3 opacity-60">
              <div className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Preferences
                  </p>
                  <p className="text-xs text-slate-500">
                    Language, currency and regional settings.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                Coming Soon
              </span>
            </div>
          </div>
        </section>

        {/* Security & Actions Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Shield className="h-5 w-5 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Security & Actions
            </h2>
          </div>

          <div className="mt-4 flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Sign Out
              </p>
              <p className="text-xs text-slate-500">
                Log out of your Property Owner session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
