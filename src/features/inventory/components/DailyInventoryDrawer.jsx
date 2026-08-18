import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
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
        room_id: room.room_id || item.room_id,
        property_id: propertyId || room.property_id || item.property_id,
        inventory_date: selectedCell.dateString,
        total_units: item.total_units ?? room.total_units ?? 1,
        available_units: item.available_units ?? room.available_units ?? 1,
        booked_units: item.booked_units ?? 0,
        blocked_units: item.blocked_units ?? 0,
        maintenance_units: item.maintenance_units ?? 0,
        stop_sell_units: item.stop_sell_units ?? 0,
        daily_price: item.daily_price ?? room.price ?? "",
        daily_discount_price: item.daily_discount_price ?? "",
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      inventory_id: formData.inventory_id,
      room_id: formData.room_id,
      property_id: formData.property_id,
      inventory_date: formData.inventory_date,
      total_units: Number(formData.total_units),
      available_units: Number(formData.available_units),
      booked_units: Number(formData.booked_units || 0),
      blocked_units: Number(formData.blocked_units || 0),
      maintenance_units: Number(formData.maintenance_units || 0),
      stop_sell_units: Number(formData.stop_sell_units || 0),
      daily_price: formData.daily_price !== "" ? Number(formData.daily_price) : null,
      daily_discount_price: formData.daily_discount_price !== "" ? Number(formData.daily_discount_price) : null,
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
      }, 1000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update daily inventory.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/30">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Daily Inventory (Edit)
              </h2>
              <p className="text-xs font-medium text-emerald-700 mt-0.5">
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
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold">
                {successMsg}
              </div>
            )}

            {/* Section 1: Availability Stats */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Availability
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">Total Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_units}
                    onChange={(e) => handleChange("total_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-emerald-700">Available Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.available_units}
                    onChange={(e) => handleChange("available_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-emerald-800 bg-transparent outline-none"
                  />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">Booked Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.booked_units}
                    onChange={(e) => handleChange("booked_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">Blocked Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.blocked_units}
                    onChange={(e) => handleChange("blocked_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">Maintenance Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.maintenance_units}
                    onChange={(e) => handleChange("maintenance_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">Stop Sell Units</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.stop_sell_units}
                    onChange={(e) => handleChange("stop_sell_units", e.target.value)}
                    className="w-full text-center text-sm font-bold text-slate-900 bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pricing
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Daily Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="3500"
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
                    placeholder="3100"
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
                Restrictions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Sellable</span>
                  <input
                    type="checkbox"
                    checked={formData.is_sellable}
                    onChange={(e) => handleChange("is_sellable", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Available</span>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => handleChange("is_available", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Closed for Arrival</span>
                  <input
                    type="checkbox"
                    checked={formData.closed_for_arrival}
                    onChange={(e) => handleChange("closed_for_arrival", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 cursor-pointer">
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
                Status
              </h3>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Inventory Status
                </label>
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
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors disabled:opacity-50"
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
