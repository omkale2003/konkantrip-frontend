import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  Boxes,
  Lock,
  XCircle,
  History,
  Plus,
} from "lucide-react";
import { ROUTES } from "../../../constants/routes.js";

const tabs = [
  {
    label: "Overview / Calendar",
    path: ROUTES.OWNER_INVENTORY,
    icon: CalendarDays,
    exact: true,
  },
  {
    label: "Inventory Setup",
    path: ROUTES.OWNER_INVENTORY_SETUP,
    icon: Boxes,
  },
  {
    label: "Room Blocks",
    path: ROUTES.OWNER_INVENTORY_BLOCKS,
    icon: Lock,
  },
  {
    label: "Stop Sell",
    path: ROUTES.OWNER_INVENTORY_STOP_SELL,
    icon: XCircle,
  },
  {
    label: "History",
    path: ROUTES.OWNER_INVENTORY_HISTORY,
    icon: History,
  },
];

function InventoryHeader({
  title,
  subtitle,
  actionButtonText = "+ Quick Action",
  onActionButtonClick,
  showActionButton = true,
}) {
  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {showActionButton && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={onActionButtonClick}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{actionButtonText}</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xs">
        <div className="flex overflow-x-auto gap-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.exact}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all",
                    isActive
                      ? "border border-emerald-200 bg-emerald-50/70 text-emerald-800 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InventoryHeader;
