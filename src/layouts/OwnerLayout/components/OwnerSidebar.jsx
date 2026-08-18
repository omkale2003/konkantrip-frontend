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

function OwnerSidebar() {
  const { isOwner, hasPermission } = useAuth();

  const allowedNavigationItems = allNavigationItems.filter((item) => {
    if (isOwner) return true;
    if (item.ownerOnly) return false;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white lg:flex">
      {/* Brand & Portal Header */}
      <div className="flex h-20 flex-col justify-center border-b border-slate-100 px-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-emerald-700">
          KonkanTrip<span className="text-xs align-top font-semibold text-emerald-600">™</span>
        </h1>
        <p className="m-0 mt-0.5 text-xs text-slate-500 font-medium">
          Property Owner Portal
        </p>
      </div>

      {/* Navigation */}
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
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
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
  );
}

export default OwnerSidebar;