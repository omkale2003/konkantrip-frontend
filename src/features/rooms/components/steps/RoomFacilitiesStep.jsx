import { useState, useMemo } from "react";
import { Wrench, Plus, Search, Edit2, Trash2, Loader2, X, ChevronDown, ChevronUp, ShowerHead, Tv, Wifi, AirVent, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoomFacilities,
  useAddRoomFacility,
  useDeleteRoomFacility,
  useRoomLookups,
} from "../../hooks/useRooms.js";
import {
  roomFacilitySchema,
  defaultRoomFacilityValues,
} from "../../schemas/room.schema.js";

function RoomFacilitiesStep({ roomId, onSubmitNext }) {
  const { data: facilitiesData, isLoading: isLoadingRoomFacilities } = useRoomFacilities(roomId);
  const { data: allFacilitiesData } = useRoomLookups("FACILITIES");
  const { data: categoriesData } = useRoomLookups("FACILITY_CATEGORIES");

  const { mutateAsync: addFacility, isPending: isAdding } = useAddRoomFacility();
  const { mutateAsync: deleteFacility, isPending: isDeleting } = useDeleteRoomFacility();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const roomFacilities = facilitiesData?.data || [];
  const allFacilities = allFacilitiesData?.data || [];
  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomFacilitySchema),
    defaultValues: {
      ...defaultRoomFacilityValues,
    },
  });

  const isComplimentary = watch("is_complimentary");

  // Group room facilities by Category Name
  const groupedFacilities = useMemo(() => {
    const map = {};
    roomFacilities.forEach((item) => {
      const catName = item.category_name || item.facility_category_name || "General";
      if (categoryFilter !== "ALL" && catName !== categoryFilter) return;

      if (searchQuery) {
        const matchesSearch = item.facility_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.facility_value?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return;
      }

      if (!map[catName]) {
        map[catName] = [];
      }
      map[catName].push(item);
    });
    return map;
  }, [roomFacilities, categoryFilter, searchQuery]);

  const toggleCategoryCollapse = (catName) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const openAddModal = () => {
    setEditingFacility(null);
    reset({
      room_facility_id: "",
      facility_value: "",
      is_available: true,
      is_complimentary: true,
      additional_charge: 0,
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingFacility(item);
    reset({
      room_facility_id: item.room_facility_id ? item.room_facility_id.toString() : "",
      facility_value: item.facility_value || "",
      is_available: item.is_available !== undefined ? Boolean(item.is_available) : true,
      is_complimentary: item.is_complimentary !== undefined ? Boolean(item.is_complimentary) : true,
      additional_charge: item.additional_charge || 0,
      remarks: item.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveFacility = async (data) => {
    try {
      setErrorMsg("");
      await addFacility({
        roomId,
        facilityId: data.room_facility_id,
        data: {
          room_facility_id: Number(data.room_facility_id),
          facility_value: data.facility_value || null,
          is_available: Boolean(data.is_available),
          is_complimentary: Boolean(data.is_complimentary),
          additional_charge: Number(data.additional_charge),
          remarks: data.remarks || null,
        },
      });
      setIsModalOpen(false);
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save facility.");
    }
  };

  const handleDeleteFacility = async (facilityId) => {
    try {
      await deleteFacility({ roomId, facilityId });
    } catch (err) {
      console.error("Failed to delete facility", err);
    }
  };

  if (isLoadingRoomFacilities) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-7 w-7 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const groupKeys = Object.keys(groupedFacilities);

  return (
    <div className="space-y-6">
      {/* Hidden dummy form for stepper trigger */}
      <form id="room-step-form" onSubmit={(e) => { e.preventDefault(); onSubmitNext(); }}>
        <button type="submit" className="hidden" />
      </form>

      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Wrench className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Facilities</h2>
          <p className="text-xs text-slate-500">Add facilities available in this room</p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facilities..."
            className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-44 rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.room_facility_category_id} value={c.category_name}>
              {c.category_name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 shrink-0"
        >
          <Plus className="h-4 w-4 text-emerald-700" />
          Add Facility
        </button>
      </div>

      {/* Categorized Facilities Accordions */}
      {groupKeys.length > 0 ? (
        <div className="space-y-5">
          {groupKeys.map((catName) => {
            const items = groupedFacilities[catName];
            const isCollapsed = Boolean(collapsedCategories[catName]);

            return (
              <div key={catName} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse(catName)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100/70 transition-colors border-b border-slate-100 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{catName}</h3>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      {items.length} facilities
                    </span>
                  </div>

                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {/* Facilities Grid under Category */}
                {!isCollapsed && (
                  <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const isAvailable = item.is_available !== false;
                      const isComp = item.is_complimentary !== false;

                      return (
                        <div
                          key={item.room_facility_mapping_id || item.room_facility_id}
                          className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-slate-300 transition-all flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mt-0.5">
                              <Wrench className="h-4 w-4" />
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{item.facility_name}</h4>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                {isAvailable ? "Available" : "Not Available"} • {isComp ? "Complimentary" : "Paid"}
                              </p>
                              {item.facility_value && (
                                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                                  Value: {item.facility_value}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFacility(item.room_facility_id)}
                              disabled={isDeleting}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
          <Wrench className="mx-auto h-8 w-8 text-slate-400" />
          <h4 className="mt-2 text-sm font-bold text-slate-900">No Facilities Configured</h4>
          <p className="mt-1 text-xs text-slate-500">Add facilities to highlight room features.</p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" /> Add Facility
          </button>
        </div>
      )}

      {/* Add / Edit Facility Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingFacility ? "Edit Room Facility" : "Add Facility to Room"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSaveFacility)} className="space-y-4">
              {/* Select Facility */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Select Facility <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("room_facility_id")}
                  disabled={Boolean(editingFacility)}
                  className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Facility</option>
                  {allFacilities.map((f) => (
                    <option key={f.room_facility_id} value={f.room_facility_id.toString()}>
                      {f.facility_name}
                    </option>
                  ))}
                </select>
                {errors.room_facility_id && (
                  <p className="text-xs text-red-600">{errors.room_facility_id.message}</p>
                )}
              </div>

              {/* Facility Value */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Facility Value / Details</label>
                <input
                  {...register("facility_value")}
                  type="text"
                  placeholder="e.g. 24 Hours, Rain Shower, 42 inch LED, Split AC"
                  className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Complimentary Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-700">Complimentary Facility</span>
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
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomFacilitiesStep;
