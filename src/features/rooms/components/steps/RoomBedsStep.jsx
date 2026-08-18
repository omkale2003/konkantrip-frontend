import { useState } from "react";
import { BedDouble, Plus, Edit2, Trash2, Loader2, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoomBeds,
  useAddRoomBed,
  useUpdateRoomBed,
  useDeleteRoomBed,
  useRoomLookups,
} from "../../hooks/useRooms.js";
import {
  roomBedSchema,
  defaultRoomBedValues,
  BED_POSITIONS,
} from "../../schemas/room.schema.js";

function RoomBedsStep({ roomId, onSubmitNext }) {
  const { data: bedsData, isLoading } = useRoomBeds(roomId);
  const { data: bedTypesData } = useRoomLookups("BED_TYPES");

  const { mutateAsync: addBed, isPending: isAdding } = useAddRoomBed();
  const { mutateAsync: updateBed, isPending: isUpdating } = useUpdateRoomBed();
  const { mutateAsync: deleteBed, isPending: isDeleting } = useDeleteRoomBed();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const beds = bedsData?.data || [];
  const bedTypes = bedTypesData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomBedSchema),
    defaultValues: {
      ...defaultRoomBedValues,
      is_default: beds.length === 0,
    },
  });

  const openAddModal = () => {
    setEditingBed(null);
    reset({
      bed_type_id: "",
      quantity: 1,
      bed_position: "Primary",
      is_default: beds.length === 0,
      is_extra_bed: false,
      additional_charge: 0,
      is_active: true,
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (bed) => {
    setEditingBed(bed);
    reset({
      bed_type_id: bed.bed_type_id ? bed.bed_type_id.toString() : "",
      quantity: bed.quantity || 1,
      bed_position: bed.bed_position || "Primary",
      is_default: Boolean(bed.is_default),
      is_extra_bed: Boolean(bed.is_extra_bed),
      additional_charge: bed.additional_charge || 0,
      is_active: bed.is_active !== undefined ? Boolean(bed.is_active) : true,
      remarks: bed.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveBed = async (data) => {
    try {
      setErrorMsg("");
      if (editingBed) {
        await updateBed({
          roomId,
          bedId: editingBed.room_bed_id,
          data,
        });
      } else {
        await addBed({ roomId, data });
      }
      setIsModalOpen(false);
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save bed configuration.");
    }
  };

  const handleDeleteBed = async (bedId) => {
    try {
      await deleteBed({ roomId, bedId });
    } catch (err) {
      console.error("Failed to delete bed", err);
    }
  };

  const handleToggleActive = async (bed) => {
    try {
      await updateBed({
        roomId,
        bedId: bed.room_bed_id,
        data: { is_active: !bed.is_active },
      });
    } catch (err) {
      console.error("Failed to toggle bed status", err);
    }
  };

  // Calculations for summary banner
  const totalBedsCount = beds.length;
  const totalQuantitySum = beds.reduce((acc, b) => acc + (Number(b.quantity) || 1), 0);
  const defaultBedObj = beds.find((b) => b.is_default);
  const defaultBedName = defaultBedObj ? defaultBedObj.bed_type_name : totalBedsCount > 0 ? beds[0].bed_type_name : "None";

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-7 w-7 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden dummy form for stepper trigger */}
      <form id="room-step-form" onSubmit={(e) => { e.preventDefault(); onSubmitNext(); }}>
        <button type="submit" className="hidden" />
      </form>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <BedDouble className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Beds</h2>
            <p className="text-xs text-slate-500">Add bed types available in this room</p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4 text-emerald-700" />
          Add Bed
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Bed Cards List */}
      {beds.length > 0 ? (
        <div className="space-y-4">
          {beds.map((bed) => {
            const isBedActive = bed.is_active !== undefined ? Boolean(bed.is_active) : true;

            return (
              <div
                key={bed.room_bed_id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <BedDouble className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{bed.bed_type_name}</h3>
                        {bed.is_default ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {bed.bed_type_name} • {bed.bed_size || "Standard Size"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-500">Active</span>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(bed)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isBedActive ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isBedActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                      <button
                        type="button"
                        onClick={() => openEditModal(bed)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBed(bed.room_bed_id)}
                        disabled={isDeleting}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Quantity</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{bed.quantity || 1}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Position</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{bed.bed_position || "Primary"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Extra Bed</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{bed.is_extra_bed ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Additional Charge</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">₹{Number(bed.additional_charge || 0)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Footer Summary Banner */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Total Beds</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{totalBedsCount}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Total Quantity</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{totalQuantitySum}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Default Bed</span>
              <span className="text-sm font-bold text-emerald-700 mt-0.5 block truncate">{defaultBedName}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
          <BedDouble className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-2 text-sm font-bold text-slate-900">No Beds Configured</h3>
          <p className="mt-1 text-xs text-slate-500">Add bed types available in this room to complete setup.</p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" /> Add Bed
          </button>
        </div>
      )}

      {/* Add / Edit Bed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingBed ? "Edit Bed Configuration" : "Add Bed to Room"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSaveBed)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bed Type */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Bed Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("bed_type_id")}
                    className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select Bed Type</option>
                    {bedTypes.map((t) => (
                      <option key={t.bed_type_id} value={t.bed_type_id.toString()}>
                        {t.bed_type_name} {t.bed_size ? `(${t.bed_size})` : ""}
                      </option>
                    ))}
                  </select>
                  {errors.bed_type_id && (
                    <p className="text-xs text-red-600">{errors.bed_type_id.message}</p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Quantity</label>
                  <input
                    {...register("quantity")}
                    type="number"
                    min="1"
                    className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Bed Position */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Position</label>
                  <select
                    {...register("bed_position")}
                    className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Extra">Extra</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>

                {/* Additional Charge */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Additional Charge (₹)</label>
                  <input
                    {...register("additional_charge")}
                    type="number"
                    min="0"
                    className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Checkboxes */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_default")}
                      className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">Set as Default Bed</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_extra_bed")}
                      className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">Is Extra Bed</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {isAdding || isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Bed"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomBedsStep;
