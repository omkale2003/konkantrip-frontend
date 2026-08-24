import { Tag, TrendingUp, Sparkles, CalendarRange } from "lucide-react";

function PricingStatsCards({ rooms = [], rates = [], properties = [] }) {
  // Total Rooms
  const totalRooms = rooms.length;

  // Average Base Price
  const validPrices = rooms
    .map((r) => Number(r.base_price))
    .filter((p) => !isNaN(p) && p > 0);
  const avgPrice =
    validPrices.length > 0
      ? Math.round(validPrices.reduce((acc, p) => acc + p, 0) / validPrices.length)
      : 0;

  // Discounted / Promotional Rooms
  const discountedRooms = rooms.filter(
    (r) =>
      r.discount_price !== null &&
      r.discount_price !== undefined &&
      Number(r.discount_price) > 0 &&
      Number(r.discount_price) < Number(r.base_price)
  ).length;

  const discountPercent =
    totalRooms > 0 ? Math.round((discountedRooms / totalRooms) * 100) : 0;

  // Active Seasonal Rules
  const todayStr = new Date().toISOString().split("T")[0];
  const activeSeasonalRules = rates.filter((r) => {
    if (!r.is_active || r.delete_status) return false;
    const start = r.start_date ? r.start_date.split("T")[0] : "";
    const end = r.end_date ? r.end_date.split("T")[0] : "";
    return start <= todayStr && end >= todayStr;
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Average Base Price */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Tag className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Average Base Rate
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              ₹{avgPrice.toLocaleString("en-IN")}
            </h3>
            <span className="text-xs font-medium text-slate-500">/ night</span>
          </div>
        </div>
      </div>

      {/* Discounted Rooms */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Promotional Rates
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {discountedRooms}
            </h3>
            <span className="text-xs font-bold text-amber-600">
              ({discountPercent}% of inventory)
            </span>
          </div>
        </div>
      </div>

      {/* Active Seasonal Rules */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <CalendarRange className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Rate Rules
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {activeSeasonalRules}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              of {rates.length} seasonal rules
            </span>
          </div>
        </div>
      </div>

      {/* Coverage */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Properties Managed
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {properties.length}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              ({totalRooms} rooms total)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingStatsCards;
