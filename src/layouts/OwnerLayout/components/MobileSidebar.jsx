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
  X,
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

function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

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
              KonkanTrip
            </p>

            <p className="m-0 text-xs text-slate-500">
              Property Owner
            </p>
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
            Management
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
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

        <div className="border-t border-slate-100 p-4">
          <p className="m-0 text-xs leading-5 text-slate-400">
            KonkanTrip Property Management
          </p>
        </div>
      </aside>
    </div>
  );
}

export default MobileSidebar;