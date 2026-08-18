import {
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Gauge,
  Hotel,
  MessageSquare,
  Settings,
  Tags,
  Users,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth.js";

const allNavigationItems = [
  {
    label: "Dashboard",
    path: "/owner/dashboard",
    icon: Gauge,
  },
  {
    label: "My Properties",
    path: "/owner/properties",
    icon: Hotel,
    permission: "properties:read",
  },
  {
    label: "Rooms",
    path: "/owner/rooms",
    icon: ClipboardList,
    permission: "rooms:read",
  },
  {
    label: "Staff & CRM",
    path: "/owner/employees",
    icon: Users,
    permission: "employees:read",
  },
  {
    label: "Bookings",
    path: "/owner/bookings",
    icon: CalendarDays,
    permission: "bookings:read",
  },
  {
    label: "Availability",
    path: "/owner/availability",
    icon: CalendarCheck,
    permission: "inventory:read",
  },
  {
    label: "Pricing",
    path: "/owner/pricing",
    icon: Tags,
    permission: "pricing:read",
  },
  {
    label: "Reviews",
    path: "/owner/reviews",
    icon: MessageSquare,
    permission: "reviews:read",
  },
  {
    label: "Payments",
    path: "/owner/payments",
    icon: CreditCard,
    ownerOnly: true,
  },
  {
    label: "Settings",
    path: "/owner/settings",
    icon: Settings,
    ownerOnly: true,
  },
];

function OwnerSidebar() {
  const { user, isOwner, isEmployee, roleName, hasPermission, logout } = useAuth();

  const allowedNavigationItems = allNavigationItems.filter((item) => {
    if (isOwner) return true;
    if (item.ownerOnly) return false;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.email || "User";

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand & Portal Header */}
      <div className="flex h-18 items-center justify-between border-b border-slate-100 px-6">
        <div>
          <p className="m-0 text-lg font-bold text-konkan-700">
            KonkanTrip&trade;
          </p>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isEmployee
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              {roleName || (isOwner ? "Property Owner" : "Staff Member")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {isEmployee ? "Operations Menu" : "Management"}
        </p>

        <div className="space-y-1">
          {allowedNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-konkan-50 text-konkan-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Info & Footer */}
      <div className="border-t border-slate-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <p className="m-0 text-[11px] text-slate-400">
          KonkanTrip&trade; {isEmployee ? "Staff Portal" : "Property Hub"}
        </p>
      </div>
    </aside>
  );
}

export default OwnerSidebar;