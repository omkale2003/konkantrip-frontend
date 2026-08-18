import {
  Boxes,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Gauge,
  Hotel,
  MessageSquare,
  Settings,
  Tags,
  Users,
  X,
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
    label: "Inventory",
    path: "/owner/inventory",
    icon: Boxes,
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

function MobileSidebar({ isOpen, onClose }) {
  const { user, isOwner, isEmployee, roleName, hasPermission, logout } = useAuth();

  if (!isOpen) {
    return null;
  }

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
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/30"
        onClick={onClose}
        aria-label="Close navigation"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <div>
            <p className="m-0 text-lg font-bold text-konkan-700">
              KonkanTrip&trade;
            </p>

            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isEmployee
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                {roleName || (isOwner ? "Property Owner" : "Staff")}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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
                  onClick={onClose}
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
        </div>
      </aside>
    </div>
  );
}

export default MobileSidebar;