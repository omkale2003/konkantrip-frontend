import { useState, useMemo } from "react";
import {
  Search,
  RotateCcw,
  Loader2,
  Lock,
  Plus,
  BedDouble,
  CalendarCheck,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { usePropertyRooms } from "../../properties/hooks/usePropertyRooms.js";
import {
  useRoomBlocksList,
  useReleaseRoomBlock,
  useCancelRoomBlock,
} from "../hooks/useInventory.js";
import InventoryHeader from "../components/InventoryHeader.jsx";
import CreateBlockModal from "../components/CreateBlockModal.jsx";

function RoomBlocksPage() {
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
  const [selectedBlockType, setSelectedBlockType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Room blocks query from backend GET /inventory/blocks
  const { data: blocksRes, isLoading, error: blocksError } = useRoomBlocksList({
    property_id: activePropertyId || undefined,
    room_id: selectedRoomId || undefined,
    status: selectedStatus || undefined,
  });

  const blocks = blocksRes?.data || [];

  const releaseMutation = useReleaseRoomBlock();
  const cancelMutation = useCancelRoomBlock();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchesType = !selectedBlockType || b.block_type === selectedBlockType;
      const matchesSearch =
        !searchQuery ||
        b.block_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.room_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.block_reason?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [blocks, selectedBlockType, searchQuery]);

  const handleResetFilters = () => {
    setSelectedRoomId("");
    setSelectedStatus("");
    setSelectedBlockType("");
    setSearchQuery("");
  };

  const handleRelease = async (blockId) => {
    setActionError("");
    try {
      await releaseMutation.mutateAsync(blockId);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to release room block.");
    }
  };

  const handleCancel = async (blockId) => {
    setActionError("");
    try {
      await cancelMutation.mutateAsync(blockId);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to cancel room block.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Shared Header & Tabs */}
      <InventoryHeader
        title="Room Blocks"
        subtitle="Block rooms or units for maintenance, private use or other operational reasons."
        actionButtonText="+ Create Block"
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

          {/* Room */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Room
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
              <option value="Completed">Completed</option>
              <option value="Released">Released</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Block Type */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Block Type
            </label>
            <select
              value={selectedBlockType}
              onChange={(e) => setSelectedBlockType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Types</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Private Use">Private Use</option>
              <option value="Hotel Use">Hotel Use</option>
              <option value="Out Of Service">Out Of Service</option>
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
                placeholder="Search blocks..."
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

      {/* Blocks Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
            <p className="mt-3 text-sm text-slate-500">Loading room blocks...</p>
          </div>
        ) : blocksError ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="text-sm text-red-700">Failed to load room blocks from database.</p>
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Lock className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-800">No room blocks found</h3>
            <p className="text-xs text-slate-500">
              Create a room block to reserve or restrict units for maintenance or private use.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="p-3.5">Block ID</th>
                  <th className="p-3.5">Room / Inventory</th>
                  <th className="p-3.5">Type & Reason</th>
                  <th className="p-3.5">Date Range</th>
                  <th className="p-3.5">Units Blocked</th>
                  <th className="p-3.5">Affects</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created On</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBlocks.map((block) => {
                  const refCode = block.block_reference || `BLK-${String(block.room_block_id).padStart(5, "0")}`;
                  const isPendingAction = releaseMutation.isPending || cancelMutation.isPending;

                  let statusBadge = "bg-slate-100 text-slate-700 border-slate-200";
                  if (block.status === "Active") statusBadge = "bg-blue-50 text-blue-800 border-blue-200";
                  if (block.status === "Scheduled") statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
                  if (block.status === "Released") statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  if (block.status === "Cancelled") statusBadge = "bg-rose-50 text-rose-800 border-rose-200";

                  return (
                    <tr key={block.room_block_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{refCode}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold">
                            {block.room_name?.charAt(0) || "R"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{block.room_name || "Room"}</p>
                            <p className="text-[11px] text-slate-400">{block.room_code || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block font-semibold text-slate-800">
                          {block.block_type || "Operational"}
                        </span>
                        {block.block_reason && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{block.block_reason}</p>
                        )}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {block.start_date?.slice(0, 10)} → {block.end_date?.slice(0, 10)}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{block.blocked_units || 1} Unit(s)</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {Boolean(block.affects_inventory) && <BedDouble className="h-4 w-4 text-emerald-600" title="Inventory" />}
                          {Boolean(block.affects_booking) && <CalendarCheck className="h-4 w-4 text-emerald-600" title="Bookings" />}
                          {Boolean(block.affects_checkin) && <UserCheck className="h-4 w-4 text-emerald-600" title="Check-in" />}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${statusBadge}`}>
                          {block.status || "Scheduled"}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {block.created_at ? new Date(block.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                      </td>
                      <td className="p-3.5 text-right">
                        {(block.status === "Active" || block.status === "Scheduled") ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRelease(block.room_block_id)}
                              disabled={isPendingAction}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-all"
                            >
                              Release
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(block.room_block_id)}
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

      {/* Create Block Modal */}
      <CreateBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        properties={properties}
        rooms={rooms}
        selectedPropertyId={activePropertyId}
      />
    </div>
  );
}

export default RoomBlocksPage;
