import {
  BarChart3,
  Boxes,
  Building2,
  CalendarDays,
  CreditCard,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  Tag,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth.js";

const allNavigationItems = [
  {
    label: "Dashboard",
    path: "/owner/dashboard",
    icon: Home,
  },
  {
    label: "My Properties",
    path: "/owner/properties",
    icon: Building2,
    permission: "properties:read",
  },
  {
    label: "Rooms",
    path: "/owner/rooms",
    icon: LayoutGrid,
    permission: "rooms:read",
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
    icon: Tag,
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
    label: "Reports",
    path: "/owner/reports",
    icon: BarChart3,
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
  const { isOwner, hasPermission } = useAuth();

  if (!isOpen) {
    return null;
  }

  const allowedNavigationItems = allNavigationItems.filter((item) => {
    if (isOwner) return true;
    if (item.ownerOnly) return false;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <div>
            <h1 className="m-0 text-xl font-bold tracking-tight text-emerald-700">
              KonkanTrip<span className="text-xs align-top font-semibold text-emerald-600">™</span>
            </h1>
            <p className="m-0 mt-0.5 text-xs text-slate-500 font-medium">
              Property Owner Portal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MANAGEMENT
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
                      "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          isActive ? "text-emerald-600" : "text-slate-400"
                        }`}
                        strokeWidth={1.8}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default MobileSidebar;