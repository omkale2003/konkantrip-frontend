import { useState, useEffect } from "react";
import { X, Loader2, Plus } from "lucide-react";
import { useCreateRoomBlock } from "../hooks/useInventory.js";
import {
  roomBlockSchema,
  defaultRoomBlockValues,
  BLOCK_TYPES,
} from "../schemas/inventory.schema.js";

function CreateBlockModal({ isOpen, onClose, properties = [], rooms = [], selectedPropertyId }) {
  const createBlockMutation = useCreateRoomBlock();

  const [formData, setFormData] = useState({
    ...defaultRoomBlockValues,
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (selectedPropertyId) {
      setFormData((prev) => ({ ...prev, property_id: selectedPropertyId }));
    } else if (properties.length > 0) {
      setFormData((prev) => ({ ...prev, property_id: properties[0].property_id }));
    }
  }, [selectedPropertyId, properties]);

  useEffect(() => {
    if (rooms.length > 0 && !formData.room_id) {
      setFormData((prev) => ({ ...prev, room_id: rooms[0].room_id }));
    }
  }, [rooms, formData.room_id]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const validation = roomBlockSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Please check the form for errors.";
      setErrorMsg(firstError);
      return;
    }

    try {
      await createBlockMutation.mutateAsync({
        property_id: Number(formData.property_id),
        room_id: Number(formData.room_id),
        block_reference: formData.block_reference || undefined,
        block_type: formData.block_type,
        block_reason: formData.block_reason || undefined,
        start_date: formData.start_date,
        end_date: formData.end_date,
        blocked_units: Number(formData.blocked_units || 1),
        release_automatically: Boolean(formData.release_automatically),
        status: formData.status,
        affects_inventory: Boolean(formData.affects_inventory),
        affects_booking: Boolean(formData.affects_booking),
        affects_checkin: Boolean(formData.affects_checkin),
        remarks: formData.remarks || undefined,
      });

      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create room block.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create Room Block</h3>
            <p className="text-xs text-slate-500">
              Block rooms or units for maintenance, private use or operational reasons.
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

            {/* Room */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Room <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.room_id}
                onChange={(e) => handleChange("room_id", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>
                    {r.room_name} ({r.room_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Block Type */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Block Type
              </label>
              <select
                value={formData.block_type}
                onChange={(e) => handleChange("block_type", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="Operational">Operational</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Private Use">Private Use</option>
                <option value="Hotel Use">Hotel Use</option>
                <option value="Out Of Service">Out Of Service</option>
              </select>
            </div>

            {/* Blocked Units */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Blocked Units <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.blocked_units}
                onChange={(e) => handleChange("blocked_units", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
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

          {/* Block Reason */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Reason Description
            </label>
            <input
              type="text"
              placeholder="e.g. AC servicing / Event preparation"
              value={formData.block_reason}
              onChange={(e) => handleChange("block_reason", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Affects Flags */}
          <div className="space-y-2 pt-1">
            <span className="block text-xs font-semibold text-slate-700">Affects Behavior</span>
            <div className="grid grid-cols-3 gap-2">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_inventory}
                  onChange={(e) => handleChange("affects_inventory", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Inventory
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_booking}
                  onChange={(e) => handleChange("affects_booking", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Bookings
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.affects_checkin}
                  onChange={(e) => handleChange("affects_checkin", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Check-in
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
              placeholder="Additional internal notes..."
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
              disabled={createBlockMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {createBlockMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Block
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlockModal;
