import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Gauge,
  Hotel,
  MessageSquare,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/owner/dashboard",
    icon: Gauge,
  },
  {
    label: "My Properties",
    path: "/owner/properties",
    icon: Hotel,
  },
  {
    label: "Rooms",
    path: "/owner/rooms",
    icon: ClipboardList,
  },
  {
    label: "Bookings",
    path: "/owner/bookings",
    icon: CalendarDays,
  },
  {
    label: "Availability",
    path: "/owner/availability",
    icon: Users,
  },
  {
    label: "Pricing",
    path: "/owner/pricing",
    icon: Tags,
  },
  {
    label: "Reviews",
    path: "/owner/reviews",
    icon: MessageSquare,
  },
  {
    label: "Payments",
    path: "/owner/payments",
    icon: CreditCard,
  },
  {
    label: "Settings",
    path: "/owner/settings",
    icon: Settings,
  },
];

function OwnerSidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand */}
      <div className="flex h-18 items-center border-b border-slate-100 px-6">
        <div>
          <p className="m-0 text-lg font-bold text-konkan-700">
            KonkanTrip&trade;
          </p>

          <p className="m-0 text-xs text-slate-500">
            Property Owner
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Management
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-konkan-50 text-konkan-700"
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

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <p className="m-0 text-xs leading-5 text-slate-400">
          KonkanTrip&trade; Property Management
        </p>
      </div>
    </aside>
  );
}

export default OwnerSidebar;