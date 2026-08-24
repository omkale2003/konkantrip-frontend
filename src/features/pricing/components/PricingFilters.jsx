import { Search, RotateCcw, Building2, SlidersHorizontal, Zap } from "lucide-react";

function PricingFilters({
  searchTerm,
  onSearchChange,
  selectedProperty,
  onPropertyChange,
  selectedRoomType,
  onRoomTypeChange,
  pricingFilter,
  onPricingFilterChange,
  properties = [],
  roomTypes = [],
  selectedCount = 0,
  onOpenBulkModal,
  onResetFilters,
}) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedProperty) ||
    Boolean(selectedRoomType) ||
    pricingFilter !== "all";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search room name, code, or property..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Property Dropdown */}
          <div className="relative min-w-[170px]">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={selectedProperty}
              onChange={(e) => onPropertyChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-8 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="">All Properties ({properties.length})</option>
              {properties.map((prop) => (
                <option key={prop.property_id} value={prop.property_id}>
                  {prop.property_name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type Dropdown */}
          {roomTypes.length > 0 && (
            <div className="relative min-w-[140px]">
              <select
                value={selectedRoomType}
                onChange={(e) => onRoomTypeChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="">All Room Types</option>
                {roomTypes.map((rt) => (
                  <option
                    key={rt.room_type_id || rt.type_id || rt}
                    value={rt.room_type_id || rt.type_id || rt}
                  >
                    {rt.room_type_name || rt.name || rt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing Status Tabs / Pill Filter */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
            {[
              { id: "all", label: "All Rates" },
              { id: "discounted", label: "Promotional" },
              { id: "standard", label: "Standard" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onPricingFilterChange(tab.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  pricingFilter === tab.id
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Bulk Update Action Trigger */}
          <button
            type="button"
            onClick={onOpenBulkModal}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition shadow-2xs ${
              selectedCount > 0
                ? "bg-emerald-700 text-white hover:bg-emerald-800 animate-pulse-once ring-2 ring-emerald-600/30"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-300" />
            <span>
              {selectedCount > 0
                ? `Bulk Update (${selectedCount} Selected)`
                : "Bulk Price Update"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PricingFilters;
