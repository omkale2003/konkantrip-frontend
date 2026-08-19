import { useState, useEffect } from "react";
import { X, Loader2, Save, CheckCircle2, AlertCircle, Plus, Minus } from "lucide-react";
import { useUpdateInventoryCalendarDay } from "../hooks/useInventory.js";
import {
  dailyInventoryCalendarSchema,
  defaultDailyInventoryCalendarValues,
  INVENTORY_STATUSES,
} from "../schemas/inventory.schema.js";

function DailyInventoryDrawer({ isOpen, onClose, selectedCell, propertyId }) {
  const updateCalendarMutation = useUpdateInventoryCalendarDay();

  const [formData, setFormData] = useState({
    ...defaultDailyInventoryCalendarValues,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (selectedCell) {
      setErrorMsg("");
      setSuccessMsg("");
      const item = selectedCell.inventoryItem || {};
      const room = selectedCell.room || {};

      setFormData({
        inventory_id: item.inventory_id || room.inventory_id || room.room_id || 1,
        room_id: Number(room.room_id || item.room_id),
        property_id: Number(propertyId || room.property_id || item.property_id),
        inventory_date: selectedCell.dateString,
        total_units: item.total_units ?? room.total_units ?? 1,
        available_units: item.available_units ?? room.available_units ?? 1,
        booked_units: item.booked_units ?? 0,
        blocked_units: item.blocked_units ?? 0,
        maintenance_units: item.maintenance_units ?? 0,
        stop_sell_units: item.stop_sell_units ?? 0,
        daily_price: item.daily_price ?? room.base_price ?? room.price ?? "",
        daily_discount_price: item.daily_discount_price ?? room.room_discount_price ?? room.discount_price ?? "",
        is_sellable: item.is_sellable !== undefined ? Boolean(item.is_sellable) : true,
        is_available: item.is_available !== undefined ? Boolean(item.is_available) : true,
        closed_for_arrival: Boolean(item.closed_for_arrival),
        closed_for_departure: Boolean(item.closed_for_departure),
        minimum_stay_nights: item.minimum_stay_nights ?? 1,
        maximum_stay_nights: item.maximum_stay_nights ?? "",
        inventory_status: item.inventory_status || "Available",
      });
    }
  }, [selectedCell, propertyId]);

  if (!isOpen || !selectedCell) return null;

  const roomName = selectedCell.room?.room_name || "Room";
  const dateStr = selectedCell.dateFormatted || selectedCell.dateString;

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-recalculate available units if deductions change
      if (["total_units", "booked_units", "blocked_units", "maintenance_units", "stop_sell_units"].includes(field)) {
        const total = Math.max(0, Number(field === "total_units" ? value : updated.total_units || 0));
        const bkd = Math.max(0, Number(field === "booked_units" ? value : updated.booked_units || 0));
        const blk = Math.max(0, Number(field === "blocked_units" ? value : updated.blocked_units || 0));
        const mnt = Math.max(0, Number(field === "maintenance_units" ? value : updated.maintenance_units || 0));
        const ss = Math.max(0, Number(field === "stop_sell_units" ? value : updated.stop_sell_units || 0));
        const calculated = Math.max(0, total - (bkd + blk + mnt + ss));
        updated.available_units = calculated;

        // Auto sync status
        if (ss > 0) {
          updated.inventory_status = "Stop Sell";
          updated.is_available = false;
        } else if (mnt > 0 && calculated === 0) {
          updated.inventory_status = "Maintenance";
        } else if (blk > 0 && calculated === 0) {
          updated.inventory_status = "Blocked";
        } else if (calculated === 0) {
          updated.inventory_status = "Sold Out";
        } else {
          updated.inventory_status = "Available";
          updated.is_available = true;
        }
      }

      // Auto adjust flags if status is explicitly changed
      if (field === "inventory_status") {
        if (value === "Stop Sell") {
          updated.is_available = false;
          updated.is_sellable = false;
        } else if (value === "Available") {
          updated.is_available = true;
          updated.is_sellable = true;
        }
      }

      return updated;
    });
  };

  const handleStepUnit = (field, delta) => {
    const current = Number(formData[field] || 0);
    const nextVal = Math.max(0, current + delta);
    handleChange(field, nextVal);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      inventory_id: formData.inventory_id ? Number(formData.inventory_id) : undefined,
      room_id: Number(formData.room_id),
      property_id: Number(formData.property_id),
      inventory_date: formData.inventory_date,
      total_units: Number(formData.total_units),
      available_units: Number(formData.available_units),
      booked_units: Number(formData.booked_units || 0),
      blocked_units: Number(formData.blocked_units || 0),
      maintenance_units: Number(formData.maintenance_units || 0),
      stop_sell_units: Number(formData.stop_sell_units || 0),
      daily_price: formData.daily_price !== "" && formData.daily_price !== null ? Number(formData.daily_price) : null,
      daily_discount_price: formData.daily_discount_price !== "" && formData.daily_discount_price !== null ? Number(formData.daily_discount_price) : null,
      is_sellable: Boolean(formData.is_sellable),
      is_available: Boolean(formData.is_available),
      closed_for_arrival: Boolean(formData.closed_for_arrival),
      closed_for_departure: Boolean(formData.closed_for_departure),
      minimum_stay_nights: Number(formData.minimum_stay_nights || 1),
      maximum_stay_nights: formData.maximum_stay_nights ? Number(formData.maximum_stay_nights) : null,
      inventory_status: formData.inventory_status,
    };

    const validation = dailyInventoryCalendarSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Please check form values.";
      setErrorMsg(firstError);
      return;
    }

    try {
      await updateCalendarMutation.mutateAsync(payload);
      setSuccessMsg("Inventory calendar updated successfully!");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update daily inventory.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Daily Inventory (Edit)
              </h2>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                {roomName} • {dateStr}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Section 1: Availability Stats */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Availability & Unit Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Total Units */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-500">Total Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_units}
                    onChange={(e) => handleChange("total_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none focus:text-emerald-700"
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleStepUnit("total_units", -1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepUnit("total_units", 1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Available Units */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-emerald-800">Available Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.available_units}
                    onChange={(e) => handleChange("available_units", e.target.value)}
                    className="w-full text-center text-base font-extrabold text-emerald-800 bg-transparent outline-none"
                  />
                  <span className="text-[9px] font-semibold text-emerald-600">Open for sale</span>
                </div>

                {/* Booked Units */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-500">Booked Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.booked_units}
                    onChange={(e) => handleChange("booked_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                  <span className="text-[9px] font-medium text-slate-400">Stays</span>
                </div>

                {/* Blocked Units */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-500">Blocked Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.blocked_units}
                    onChange={(e) => handleChange("blocked_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleStepUnit("blocked_units", -1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepUnit("blocked_units", 1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Maintenance Units */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-500">Maintenance</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.maintenance_units}
                    onChange={(e) => handleChange("maintenance_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleStepUnit("maintenance_units", -1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepUnit("maintenance_units", 1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Stop Sell Units */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-500">Stop Sell Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.stop_sell_units}
                    onChange={(e) => handleChange("stop_sell_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleStepUnit("stop_sell_units", -1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepUnit("stop_sell_units", 1)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Daily Pricing Override
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Daily Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="2500"
                    value={formData.daily_price}
                    onChange={(e) => handleChange("daily_price", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="2200"
                    value={formData.daily_discount_price}
                    onChange={(e) => handleChange("daily_discount_price", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Restrictions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Booking Restrictions & Stays
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50">
                  <span className="text-xs font-semibold text-slate-700">Sellable</span>
                  <input
                    type="checkbox"
                    checked={formData.is_sellable}
                    onChange={(e) => handleChange("is_sellable", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50">
                  <span className="text-xs font-semibold text-slate-700">Available</span>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => handleChange("is_available", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50">
                  <span className="text-xs font-semibold text-slate-700">Closed for Arrival</span>
                  <input
                    type="checkbox"
                    checked={formData.closed_for_arrival}
                    onChange={(e) => handleChange("closed_for_arrival", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer hover:bg-slate-50">
                  <span className="text-xs font-semibold text-slate-700">Closed for Departure</span>
                  <input
                    type="checkbox"
                    checked={formData.closed_for_departure}
                    onChange={(e) => handleChange("closed_for_departure", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Minimum Stay (Nights)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minimum_stay_nights}
                    onChange={(e) => handleChange("minimum_stay_nights", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Maximum Stay (Nights)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Optional"
                    value={formData.maximum_stay_nights}
                    onChange={(e) => handleChange("maximum_stay_nights", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Status */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Inventory Status
              </h3>
              <div>
                <select
                  value={formData.inventory_status}
                  onChange={(e) => handleChange("inventory_status", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="Available">Available</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Stop Sell">Stop Sell</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-end gap-3 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={updateCalendarMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors disabled:opacity-50 shadow-2xs"
            >
              {updateCalendarMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyInventoryDrawer;
