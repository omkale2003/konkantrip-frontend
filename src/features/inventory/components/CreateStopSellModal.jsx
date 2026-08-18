import { useState, useEffect } from "react";
import { X, Loader2, Plus } from "lucide-react";
import { useCreateStopSellRule } from "../hooks/useInventory.js";
import {
  stopSellSchema,
  defaultStopSellValues,
  STOP_SELL_TYPES,
  REASON_TYPES,
} from "../schemas/inventory.schema.js";

function CreateStopSellModal({ isOpen, onClose, properties = [], rooms = [], selectedPropertyId }) {
  const createStopSellMutation = useCreateStopSellRule();

  const [formData, setFormData] = useState({
    ...defaultStopSellValues,
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (selectedPropertyId) {
      setFormData((prev) => ({ ...prev, property_id: selectedPropertyId }));
    } else if (properties.length > 0) {
      setFormData((prev) => ({ ...prev, property_id: properties[0].property_id }));
    }
  }, [selectedPropertyId, properties]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const validation = stopSellSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Please check the form for errors.";
      setErrorMsg(firstError);
      return;
    }

    try {
      await createStopSellMutation.mutateAsync({
        property_id: Number(formData.property_id),
        room_id: formData.room_id ? Number(formData.room_id) : null,
        stop_sell_type: formData.stop_sell_type,
        reason_type: formData.reason_type,
        reason: formData.reason || undefined,
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_time: formData.start_time || undefined,
        end_time: formData.end_time || undefined,
        affects_new_bookings: Boolean(formData.affects_new_bookings),
        affects_modifications: Boolean(formData.affects_modifications),
        affects_existing_bookings: Boolean(formData.affects_existing_bookings),
        affects_all_channels: Boolean(formData.affects_all_channels),
        status: formData.status,
        release_automatically: Boolean(formData.release_automatically),
        remarks: formData.remarks || undefined,
      });

      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create stop sell rule.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create Stop Sell Rule</h3>
            <p className="text-xs text-slate-500">
              Stop accepting new bookings for specific rooms or date ranges.
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Property */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Property <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.property_id}
                onChange={(e) => handleChange("property_id", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {properties.map((p) => (
                  <option key={p.property_id} value={p.property_id}>
                    {p.property_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room / Inventory */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Room Scope
              </label>
              <select
                value={formData.room_id}
                onChange={(e) => handleChange("room_id", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All Rooms (Property Level)</option>
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>
                    {r.room_name} ({r.room_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Stop Sell Type */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Stop Sell Type
              </label>
              <select
                value={formData.stop_sell_type}
                onChange={(e) => handleChange("stop_sell_type", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="Room">Room</option>
                <option value="Property">Property</option>
                <option value="Rate Plan">Rate Plan</option>
              </select>
            </div>

            {/* Reason Type */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Reason Category
              </label>
              <select
                value={formData.reason_type}
                onChange={(e) => handleChange("reason_type", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="Operational">Operational</option>
                <option value="Demand Control">Demand Control</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Event">Event</option>
                <option value="Weather">Weather</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Reason text */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Reason Details
            </label>
            <input
              type="text"
              placeholder="e.g. Operational maintenance work / High demand period"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Affects Flags */}
          <div className="space-y-2 pt-1">
            <span className="block text-xs font-semibold text-slate-700">Affects Behavior</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_new_bookings}
                  onChange={(e) => handleChange("affects_new_bookings", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                New Bookings
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_all_channels}
                  onChange={(e) => handleChange("affects_all_channels", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                All Channels
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_modifications}
                  onChange={(e) => handleChange("affects_modifications", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Modifications
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_existing_bookings}
                  onChange={(e) => handleChange("affects_existing_bookings", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Existing Bookings
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Remarks (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Additional internal details..."
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createStopSellMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {createStopSellMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Stop Sell
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStopSellModal;
