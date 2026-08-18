import { useState, useMemo } from "react";
import { Sparkles, Plus, Search, Edit2, Trash2, Loader2, X, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoomAmenities,
  useAddRoomAmenity,
  useDeleteRoomAmenity,
  useAmenitiesLookup,
} from "../../hooks/useRooms.js";
import {
  roomAmenitySchema,
  defaultRoomAmenityValues,
} from "../../schemas/room.schema.js";

function RoomAmenitiesStep({ roomId, onSubmitNext }) {
  const { data: roomAmenitiesData, isLoading: isLoadingRoomAmenities } = useRoomAmenities(roomId);
  const { data: allAmenitiesData } = useAmenitiesLookup();

  const { mutateAsync: addAmenity, isPending: isAdding } = useAddRoomAmenity();
  const { mutateAsync: deleteAmenity, isPending: isDeleting } = useDeleteRoomAmenity();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [errorMsg, setErrorMsg] = useState("");

  const roomAmenities = roomAmenitiesData?.data || [];
  const allAmenities = allAmenitiesData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomAmenitySchema),
    defaultValues: {
      ...defaultRoomAmenityValues,
    },
  });

  const isComplimentary = watch("is_complimentary");

  // Filtered room amenities for main list
  const filteredRoomAmenities = useMemo(() => {
    return roomAmenities.filter((item) => {
      const matchesSearch = item.amenity_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [roomAmenities, searchQuery]);

  const openAddModal = () => {
    setEditingAmenity(null);
    reset({
      amenity_id: "",
      is_available: true,
      is_complimentary: true,
      additional_charge: 0,
      quantity: 1,
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingAmenity(item);
    reset({
      amenity_id: item.amenity_id ? item.amenity_id.toString() : "",
      is_available: item.is_available !== undefined ? Boolean(item.is_available) : true,
      is_complimentary: item.is_complimentary !== undefined ? Boolean(item.is_complimentary) : true,
      additional_charge: item.additional_charge || 0,
      quantity: item.quantity || 1,
      remarks: item.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveAmenity = async (data) => {
    try {
      setErrorMsg("");
      await addAmenity({
        roomId,
        amenityId: data.amenity_id,
        data: {
          amenity_id: Number(data.amenity_id),
          is_available: Boolean(data.is_available),
          is_complimentary: Boolean(data.is_complimentary),
          additional_charge: Number(data.additional_charge),
          quantity: Number(data.quantity),
          remarks: data.remarks || null,
        },
      });
      setIsModalOpen(false);
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save amenity.");
    }
  };

  const handleDeleteAmenity = async (amenityId) => {
    try {
      await deleteAmenity({ roomId, amenityId });
    } catch (err) {
      console.error("Failed to delete amenity", err);
    }
  };

  // Summary Banner calculations
  const totalAmenitiesCount = roomAmenities.length;
  const complimentaryCount = roomAmenities.filter((a) => Boolean(a.is_complimentary)).length;
  const paidCount = totalAmenitiesCount - complimentaryCount;

  if (isLoadingRoomAmenities) {
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
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Amenities</h2>
          <p className="text-xs text-slate-500">Add amenities available in this room</p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search amenities..."
            className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-44 rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
        </select>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 shrink-0"
        >
          <Plus className="h-4 w-4 text-emerald-700" />
          Add Amenity
        </button>
      </div>

      {/* Selected Amenities List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700">
          Selected Amenities ({roomAmenities.length})
        </h3>

        {filteredRoomAmenities.length > 0 ? (
          <div className="space-y-3">
            {filteredRoomAmenities.map((item) => {
              const isComp = item.is_complimentary !== undefined ? Boolean(item.is_complimentary) : true;

              return (
                <div
                  key={item.room_amenity_id || item.amenity_id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.amenity_name}</h4>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            isComp
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                          }`}
                        >
                          {isComp ? "Complimentary" : "Paid"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.amenity_description || "Room amenity item"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium block">Available</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">
                        {item.is_available !== false ? "Yes" : "No"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Additional Charge</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">
                        ₹{Number(item.additional_charge || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Quantity</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{item.quantity || 1}</span>
                    </div>

                    <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAmenity(item.amenity_id)}
                        disabled={isDeleting}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
            <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
            <h4 className="mt-2 text-sm font-bold text-slate-900">No Amenities Selected</h4>
            <p className="mt-1 text-xs text-slate-500">Select amenities to feature in this room.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
            >
              <Plus className="h-4 w-4" /> Add Amenity
            </button>
          </div>
        )}

        {/* Footer Summary Banner */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Total Amenities</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{totalAmenitiesCount}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Complimentary</span>
            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{complimentaryCount}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Paid Amenities</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{paidCount}</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Amenity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingAmenity ? "Edit Amenity" : "Add Amenity to Room"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSaveAmenity)} className="space-y-4">
              {/* Select Amenity */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Select Amenity <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("amenity_id")}
                  disabled={Boolean(editingAmenity)}
                  className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Amenity</option>
                  {allAmenities.map((a) => (
                    <option key={a.amenity_id} value={a.amenity_id.toString()}>
                      {a.amenity_name}
                    </option>
                  ))}
                </select>
                {errors.amenity_id && (
                  <p className="text-xs text-red-600">{errors.amenity_id.message}</p>
                )}
              </div>

              {/* Complimentary / Paid Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-700">Complimentary Amenity</span>
                <button
                  type="button"
                  onClick={() => setValue("is_complimentary", !isComplimentary)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isComplimentary ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isComplimentary ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Additional Charge */}
              {!isComplimentary && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Additional Charge (₹)</label>
                  <input
                    {...register("additional_charge")}
                    type="number"
                    min="0"
                    className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}

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
                  disabled={isAdding}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Amenity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomAmenitiesStep;
