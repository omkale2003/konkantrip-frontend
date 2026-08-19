import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Building2, Save, Plus } from "lucide-react";
import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { usePropertyRooms } from "../../properties/hooks/usePropertyRooms.js";
import {
  useRoomInventoryList,
  useUpsertRoomInventory,
} from "../hooks/useInventory.js";
import InventoryHeader from "../components/InventoryHeader.jsx";

function InventorySetupPage() {
  const owner = storageService.getOwner();
  const { data: propertiesRes } = useProperties({
    owner_id: owner?.p_owner_id || undefined,
    limit: 100,
  });

  const properties = propertiesRes?.data || [];
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const activePropertyId = selectedPropertyId || (properties[0]?.property_id ? String(properties[0].property_id) : "");

  // Rooms query for active property
  const { data: roomsRes, isLoading: isLoadingRooms } = usePropertyRooms(activePropertyId);
  const rooms = roomsRes?.data || [];

  // Existing room inventory list query from backend GET /inventory/rooms
  const { data: inventoryRes, isLoading: isLoadingInventory } = useRoomInventoryList({
    property_id: activePropertyId || undefined,
  });

  const inventoryRecords = inventoryRes?.data || [];
  const upsertInventoryMutation = useUpsertRoomInventory();

  // Active room selection
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) =>
      r.room_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.room_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  // Set default selected room
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].room_id);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom = rooms.find((r) => String(r.room_id) === String(selectedRoomId));

  // Find matching inventory record from backend data
  const matchingInventory = useMemo(() => {
    if (!selectedRoomId) return null;
    return inventoryRecords.find((i) => String(i.room_id) === String(selectedRoomId));
  }, [inventoryRecords, selectedRoomId]);

  // Form state for configuration
  const [formData, setFormData] = useState({
    inventory_code: "",
    inventory_mode: "Room Based",
    allocation_mode: "Automatic",
    total_units: 1,
    sellable_units: 1,
    minimum_stock: 0,
    maximum_stock: "",
    overbooking_allowed: false,
    overbooking_limit: 0,
    remarks: "",
    status: "Active",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (selectedRoom) {
      setErrorMsg("");
      setSuccessMsg("");
      const inv = matchingInventory || {};
      setFormData({
        inventory_code: inv.inventory_code || selectedRoom.room_code || `INV-${selectedRoom.room_id}`,
        inventory_mode: inv.inventory_mode || "Room Based",
        allocation_mode: inv.allocation_mode || "Automatic",
        total_units: inv.total_units ?? selectedRoom.total_units ?? 1,
        sellable_units: inv.sellable_units ?? selectedRoom.total_units ?? 1,
        minimum_stock: inv.minimum_stock ?? 0,
        maximum_stock: inv.maximum_stock ?? selectedRoom.total_units ?? 1,
        overbooking_allowed: Boolean(inv.overbooking_allowed),
        overbooking_limit: inv.overbooking_limit ?? 0,
        remarks: inv.remarks || "",
        status: inv.is_active === false ? "Inactive" : "Active",
      });
    }
  }, [selectedRoom, matchingInventory]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedRoom || !activePropertyId) return;

    try {
      await upsertInventoryMutation.mutateAsync({
        room_id: Number(selectedRoom.room_id),
        property_id: Number(activePropertyId),
        inventory_code: formData.inventory_code,
        total_units: Number(formData.total_units),
        sellable_units: Number(formData.sellable_units),
        minimum_stock: Number(formData.minimum_stock || 0),
        maximum_stock: formData.maximum_stock ? Number(formData.maximum_stock) : null,
        overbooking_allowed: Boolean(formData.overbooking_allowed),
        overbooking_limit: Number(formData.overbooking_limit || 0),
        inventory_mode: formData.inventory_mode,
        allocation_mode: formData.allocation_mode,
        remarks: formData.remarks || null,
      });

      setSuccessMsg("Room inventory configuration saved to database!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save room inventory.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Shared Header & Tabs */}
      <InventoryHeader
        title="Inventory Setup"
        subtitle="Configure inventory settings for your rooms"
        actionButtonText="+ Add Inventory"
        onActionButtonClick={handleSave}
      />

      {/* Property Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-72">
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Property
          </label>
          <select
            value={activePropertyId}
            onChange={(e) => {
              setSelectedPropertyId(e.target.value);
              setSelectedRoomId(null);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            {properties.map((p) => (
              <option key={p.property_id} value={p.property_id}>
                {p.property_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Rooms List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Rooms</h3>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Room List */}
            {isLoadingRooms ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto h-6 w-6 text-emerald-600 animate-spin" />
              </div>
            ) : filteredRooms.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No rooms found.</p>
            ) : (
              <div className="space-y-2">
                {filteredRooms.map((room) => {
                  const isSelected = String(room.room_id) === String(selectedRoomId);

                  return (
                    <button
                      key={room.room_id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.room_id)}
                      className={[
                        "w-full flex items-center justify-between rounded-xl p-3 text-left transition-all",
                        isSelected
                          ? "border border-emerald-300 bg-emerald-50/70 shadow-2xs"
                          : "border border-slate-200 bg-white hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/60 text-emerald-800 font-bold text-xs">
                          {room.room_name?.charAt(0) || "R"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{room.room_name}</p>
                          <p className="text-[11px] text-slate-500">
                            {room.room_code} • {room.total_units || 1} Units
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inventory Configuration Form */}
        <div className="lg:col-span-8">
          {selectedRoom ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Inventory Configuration – {selectedRoom.room_name}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure allocation mode, stock limits, and overbooking limits.
                </p>
              </div>

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

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Inventory Code */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Inventory Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.inventory_code}
                      onChange={(e) => handleChange("inventory_code", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Inventory Mode */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Inventory Mode
                    </label>
                    <select
                      value={formData.inventory_mode}
                      onChange={(e) => handleChange("inventory_mode", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Room Based">Room Based</option>
                      <option value="Unit Based">Unit Based</option>
                    </select>
                  </div>

                  {/* Allocation Mode */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Allocation Mode
                    </label>
                    <select
                      value={formData.allocation_mode}
                      onChange={(e) => handleChange("allocation_mode", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  {/* Total Units */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Total Units <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.total_units}
                      onChange={(e) => handleChange("total_units", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Sellable Units */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Sellable Units <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sellable_units}
                      onChange={(e) => handleChange("sellable_units", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Minimum Stock */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Minimum Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minimum_stock}
                      onChange={(e) => handleChange("minimum_stock", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Maximum Stock */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Maximum Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maximum_stock}
                      onChange={(e) => handleChange("maximum_stock", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* Overbooking Section */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Overbooking Configuration
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 cursor-pointer">
                      <div>
                        <span className="block text-xs font-semibold text-slate-900">Allow Overbooking</span>
                        <span className="text-[11px] text-slate-500">Allow more bookings than total units</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.overbooking_allowed}
                        onChange={(e) => handleChange("overbooking_allowed", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Overbooking Limit
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={!formData.overbooking_allowed}
                        value={formData.overbooking_limit}
                        onChange={(e) => handleChange("overbooking_limit", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks & Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Remarks
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Enter remarks (optional)"
                      value={formData.remarks}
                      onChange={(e) => handleChange("remarks", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Footer Submit */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={upsertInventoryMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-all disabled:opacity-50"
                  >
                    {upsertInventoryMutation.isPending ? (
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
              </form>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
              Select a room from the left list to edit inventory setup.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventorySetupPage;
