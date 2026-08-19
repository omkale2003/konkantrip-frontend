import { useState, useMemo } from "react";
import {
  Search,
  RotateCcw,
  Loader2,
  XCircle,
  Plus,
  Ban,
  FileEdit,
  Layers,
  Globe,
  AlertCircle,
} from "lucide-react";
import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { usePropertyRooms } from "../../properties/hooks/usePropertyRooms.js";
import {
  useStopSellList,
  useReleaseStopSellRule,
  useCancelStopSellRule,
} from "../hooks/useInventory.js";
import InventoryHeader from "../components/InventoryHeader.jsx";
import CreateStopSellModal from "../components/CreateStopSellModal.jsx";

function StopSellPage() {
  const owner = storageService.getOwner();
  const { data: propertiesRes } = useProperties({
    owner_id: owner?.p_owner_id || undefined,
    limit: 100,
  });

  const properties = propertiesRes?.data || [];
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const activePropertyId = selectedPropertyId || (properties[0]?.property_id ? String(properties[0].property_id) : "");

  const { data: roomsRes } = usePropertyRooms(activePropertyId);
  const rooms = roomsRes?.data || [];

  // Filter States
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Stop sell rules query from backend GET /inventory/stop-sell
  const { data: stopSellRes, isLoading, error: stopSellError } = useStopSellList({
    property_id: activePropertyId || undefined,
    room_id: selectedRoomId || undefined,
    status: selectedStatus || undefined,
  });

  const stopSellRules = stopSellRes?.data || [];

  const releaseMutation = useReleaseStopSellRule();
  const cancelMutation = useCancelStopSellRule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const filteredRules = useMemo(() => {
    return stopSellRules.filter((s) => {
      const matchesType = !selectedType || s.stop_sell_type === selectedType;
      const matchesSearch =
        !searchQuery ||
        s.stop_sell_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.room_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.reason?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [stopSellRules, selectedType, searchQuery]);

  const handleResetFilters = () => {
    setSelectedRoomId("");
    setSelectedStatus("");
    setSelectedType("");
    setSearchQuery("");
  };

  const handleRelease = async (id) => {
    setActionError("");
    try {
      await releaseMutation.mutateAsync(id);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to release stop sell rule.");
    }
  };

  const handleCancel = async (id) => {
    setActionError("");
    try {
      await cancelMutation.mutateAsync(id);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to cancel stop sell rule.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Shared Header & Tabs */}
      <InventoryHeader
        title="Stop Sell"
        subtitle="Stop accepting new bookings for specific rooms or dates."
        actionButtonText="+ Create Stop Sell"
        onActionButtonClick={() => setIsModalOpen(true)}
      />

      {/* Filter Control Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Property */}
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Property
            </label>
            <select
              value={activePropertyId}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
                setSelectedRoomId("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {properties.map((p) => (
                <option key={p.property_id} value={p.property_id}>
                  {p.property_name}
                </option>
              ))}
            </select>
          </div>

          {/* Room / Scope */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Room / Inventory
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Rooms</option>
              {rooms.map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  {r.room_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Active">Active</option>
              <option value="Released">Released</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Stop Sell Type */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Stop Sell Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Types</option>
              <option value="Room">Room</option>
              <option value="Property">Property</option>
              <option value="Rate Plan">Rate Plan</option>
            </select>
          </div>

          {/* Search */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search stop sell..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-8 pr-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Reset */}
          <div className="lg:col-span-1 pt-4 sm:pt-0">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {actionError}
        </div>
      )}

      {/* Stop Sell Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
            <p className="mt-3 text-sm text-slate-500">Loading stop sell rules...</p>
          </div>
        ) : stopSellError ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="text-sm text-red-700">Failed to load stop sell rules from database.</p>
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <XCircle className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-800">No stop sell rules active</h3>
            <p className="text-xs text-slate-500">
              Create a stop sell rule to pause accepting bookings for rooms or specific dates.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="p-3.5">Stop Sell ID</th>
                  <th className="p-3.5">Room / Inventory</th>
                  <th className="p-3.5">Type & Reason</th>
                  <th className="p-3.5">Date / Time Range</th>
                  <th className="p-3.5">Affects</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created On</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRules.map((rule) => {
                  const refCode = rule.stop_sell_reference || `SS-${String(rule.stop_sell_id).padStart(5, "0")}`;
                  const isPendingAction = releaseMutation.isPending || cancelMutation.isPending;

                  let statusBadge = "bg-slate-100 text-slate-700 border-slate-200";
                  if (rule.status === "Active") statusBadge = "bg-blue-50 text-blue-800 border-blue-200";
                  if (rule.status === "Scheduled") statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
                  if (rule.status === "Released") statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  if (rule.status === "Cancelled") statusBadge = "bg-rose-50 text-rose-800 border-rose-200";

                  return (
                    <tr key={rule.stop_sell_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{refCode}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold">
                            {rule.room_name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{rule.room_name || "All Rooms (Property)"}</p>
                            <p className="text-[11px] text-slate-400">{rule.room_code || "All Inventory"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block font-semibold text-slate-800">
                          {rule.stop_sell_type || "Room"} • {rule.reason_type || "Operational"}
                        </span>
                        {rule.reason && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{rule.reason}</p>
                        )}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {rule.start_date?.slice(0, 10)} → {rule.end_date?.slice(0, 10)}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {Boolean(rule.affects_new_bookings) && <Ban className="h-4 w-4 text-emerald-600" title="New Bookings" />}
                          {Boolean(rule.affects_modifications) && <FileEdit className="h-4 w-4 text-emerald-600" title="Modifications" />}
                          {Boolean(rule.affects_existing_bookings) && <Layers className="h-4 w-4 text-emerald-600" title="Existing Bookings" />}
                          {Boolean(rule.affects_all_channels) && <Globe className="h-4 w-4 text-emerald-600" title="All Channels" />}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${statusBadge}`}>
                          {rule.status || "Scheduled"}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {rule.created_at ? new Date(rule.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                      </td>
                      <td className="p-3.5 text-right">
                        {(rule.status === "Active" || rule.status === "Scheduled") ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRelease(rule.stop_sell_id)}
                              disabled={isPendingAction}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-all"
                            >
                              Release
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(rule.stop_sell_id)}
                              disabled={isPendingAction}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-100 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Stop Sell Modal */}
      <CreateStopSellModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        properties={properties}
        rooms={rooms}
        selectedPropertyId={activePropertyId}
      />
    </div>
  );
}

export default StopSellPage;
