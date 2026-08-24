import { useState } from "react";
import {
  CalendarRange,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Hotel,
  Tag,
  Search,
  Zap,
} from "lucide-react";
import { useDeletePricingRate, useUpdatePricingRate } from "../hooks/usePricing.js";

function SeasonalRatesTab({
  rates = [],
  rooms = [],
  properties = [],
  onOpenCreateModal,
  onOpenEditModal,
  onOpenBulkModal,
}) {
  const deleteRateMutation = useDeletePricingRate();
  const updateRateMutation = useUpdatePricingRate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "active" | "upcoming" | "expired"
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // Decorate rates with active/upcoming/expired status
  const decoratedRates = rates.map((rate) => {
    const start = rate.start_date ? rate.start_date.split("T")[0] : "";
    const end = rate.end_date ? rate.end_date.split("T")[0] : "";
    const isActive = Boolean(Number(rate.is_active));

    let status = "expired";
    if (rate.delete_status) {
      status = "deleted";
    } else if (start > todayStr) {
      status = "upcoming";
    } else if (start <= todayStr && end >= todayStr) {
      status = isActive ? "active" : "inactive";
    } else {
      status = "expired";
    }

    return { ...rate, is_active: isActive, computedStatus: status, startFormatted: start, endFormatted: end };
  });

  // Filter rates
  const filteredRates = decoratedRates.filter((rate) => {
    if (selectedPropertyId && Number(rate.property_id) !== Number(selectedPropertyId)) {
      return false;
    }
    if (filterStatus === "active" && rate.computedStatus !== "active") return false;
    if (filterStatus === "upcoming" && rate.computedStatus !== "upcoming") return false;
    if (filterStatus === "expired" && rate.computedStatus !== "expired") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rate.rate_name?.toLowerCase().includes(q);
      const matchRoom = rate.room_name?.toLowerCase().includes(q);
      const matchProp = rate.property_name?.toLowerCase().includes(q);
      if (!matchName && !matchRoom && !matchProp) return false;
    }

    return true;
  });

  const handleDelete = async (rate) => {
    if (
      window.confirm(
        `Are you sure you want to delete the rate rule "${rate.rate_name}"?`
      )
    ) {
      try {
        await deleteRateMutation.mutateAsync({
          rateId: rate.rate_id,
          roomId: rate.room_id,
        });
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete rate rule");
      }
    }
  };

  const handleToggleActive = async (rate) => {
    try {
      await updateRateMutation.mutateAsync({
        rateId: rate.rate_id,
        roomId: rate.room_id,
        data: { is_active: !rate.is_active },
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to toggle rate rule status");
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seasonal rules..."
              className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Property Dropdown */}
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="">All Properties ({properties.length})</option>
            {properties.map((p) => (
              <option key={p.property_id} value={p.property_id}>
                {p.property_name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
            {[
              { id: "all", label: "All Rules" },
              { id: "active", label: "Active Now" },
              { id: "upcoming", label: "Upcoming" },
              { id: "expired", label: "Past / Expired" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  filterStatus === tab.id
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenBulkModal && (
            <button
              type="button"
              onClick={onOpenBulkModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Bulk Seasonal Rules</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>New Seasonal Rule</span>
          </button>
        </div>
      </div>

      {/* Rules Table / Cards */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[220px]">Rule & Property</th>
                <th className="py-3 px-4 min-w-[160px]">Date Window</th>
                <th className="py-3 px-4 min-w-[140px]">Applicable Days</th>
                <th className="py-3 px-4 min-w-[130px] text-right">Seasonal Rate</th>
                <th className="py-3 px-4 min-w-[130px] text-center">Status</th>
                <th className="py-3 px-4 min-w-[120px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 mb-2">
                      <CalendarRange className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      No seasonal rate rules found
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Create a seasonal rule for festival surges, monsoon offers, or holiday weekends.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {onOpenBulkModal && (
                        <button
                          type="button"
                          onClick={onOpenBulkModal}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Zap className="h-3.5 w-3.5 text-amber-500" />
                          <span>Bulk Seasonal Rules</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Seasonal Rule</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRates.map((rate) => {
                  const base = Number(rate.base_price) || 0;
                  const discount =
                    rate.discount_price !== null &&
                    rate.discount_price !== undefined
                      ? Number(rate.discount_price)
                      : null;

                  return (
                    <tr key={rate.rate_id} className="hover:bg-slate-50/80 transition">
                      {/* Rule Name & Room */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {rate.rate_name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Hotel className="h-3 w-3 text-slate-400" />
                            <span className="font-semibold text-slate-700">
                              {rate.room_name} ({rate.room_code})
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[130px]">
                              {rate.property_name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date Window */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <CalendarRange className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{rate.startFormatted}</span>
                          <span className="text-slate-400">→</span>
                          <span>{rate.endFormatted}</span>
                        </div>
                      </td>

                      {/* Applicable Days */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-600 font-medium max-w-[180px]">
                          {rate.days_of_week
                            ? rate.days_of_week
                                .split(",")
                                .map((d) => d.slice(0, 3))
                                .join(", ")
                            : "All Days"}
                        </div>
                      </td>

                      {/* Seasonal Rate */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-slate-900">
                            ₹{base.toLocaleString("en-IN")}
                          </span>
                          {discount !== null && (
                            <span className="text-[11px] font-bold text-amber-700">
                              Promo: ₹{discount.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {rate.computedStatus === "active" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Active Now
                          </span>
                        )}
                        {rate.computedStatus === "upcoming" && (
                          rate.is_active ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                              <Clock className="h-3 w-3" />
                              Upcoming
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                              <Clock className="h-3 w-3" />
                              Upcoming (Paused)
                            </span>
                          )
                        )}
                        {rate.computedStatus === "expired" && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                            Expired
                          </span>
                        )}
                        {rate.computedStatus === "inactive" && (
                          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800">
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(rate)}
                            className={`rounded-md p-1.5 transition ${
                              rate.is_active
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            }`}
                            title={rate.is_active ? "Pause rule" : "Activate rule"}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(rate)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                            title="Edit seasonal rule"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rate)}
                            className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                            title="Delete seasonal rule"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SeasonalRatesTab;
