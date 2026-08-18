import { useState, useMemo } from "react";
import {
  Search,
  RotateCcw,
  Loader2,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertCircle,
  X,
  User,
  Clock,
  FileText,
  Tag,
  Building2,
} from "lucide-react";
import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { usePropertyRooms } from "../../properties/hooks/usePropertyRooms.js";
import { useInventoryTransactionsList } from "../hooks/useInventory.js";
import InventoryHeader from "../components/InventoryHeader.jsx";

function InventoryHistoryPage() {
  const owner = storageService.getOwner();
  const { data: propertiesRes } = useProperties({
    owner_id: owner?.p_owner_id,
    limit: 100,
  });

  const properties = propertiesRes?.data || [];
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const activePropertyId = selectedPropertyId || (properties[0]?.property_id ? String(properties[0].property_id) : "");

  const { data: roomsRes } = usePropertyRooms(activePropertyId);
  const rooms = roomsRes?.data || [];

  // Filter States
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Transaction for Right Drawer View
  const [selectedTx, setSelectedTx] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Transactions query from real backend GET /inventory/transactions
  const { data: txRes, isLoading, error: txError } = useInventoryTransactionsList({
    property_id: activePropertyId || undefined,
    room_id: selectedRoomId || undefined,
    transaction_type: selectedType || undefined,
    limit: 100,
  });

  const transactions = txRes?.data || [];

  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.room_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.transaction_type?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [transactions, searchQuery]);

  const handleResetFilters = () => {
    setSelectedRoomId("");
    setSelectedType("");
    setSearchQuery("");
  };

  const handleRowClick = (tx) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Shared Header & Tabs */}
      <InventoryHeader
        title="Inventory History / Transactions"
        subtitle="View all inventory changes, adjustments and activities."
        showActionButton={false}
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
          <div className="lg:col-span-3">
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

          {/* Transaction Type */}
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Transaction Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Transaction Types</option>
              <option value="Calendar Update">Calendar Update</option>
              <option value="Block Created">Block Created</option>
              <option value="Block Released">Block Released</option>
              <option value="Stop Sell Created">Stop Sell Created</option>
              <option value="Stop Sell Released">Stop Sell Released</option>
              <option value="Stock Adjustment">Stock Adjustment</option>
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
                placeholder="Search history..."
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

      {/* Transactions Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
            <p className="mt-3 text-sm text-slate-500">Loading transaction history...</p>
          </div>
        ) : txError ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="text-sm text-red-700">Failed to load transaction history from database.</p>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <History className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-800">No inventory transactions found</h3>
            <p className="text-xs text-slate-500">
              Audit records will appear here whenever room availability or pricing is modified.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                  <th className="p-3.5">Date &amp; Time</th>
                  <th className="p-3.5">Room / Property</th>
                  <th className="p-3.5">Transaction Type</th>
                  <th className="p-3.5">Direction</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Available Units</th>
                  <th className="p-3.5">Reason / Remarks</th>
                  <th className="p-3.5">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTx.map((tx) => {
                  const direction = tx.transaction_direction || "Adjustment";
                  let dirBadge = "bg-slate-100 text-slate-700 border-slate-200";
                  let DirIcon = RefreshCw;

                  if (direction === "In") {
                    dirBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    DirIcon = ArrowDownLeft;
                  } else if (direction === "Out") {
                    dirBadge = "bg-rose-50 text-rose-800 border-rose-200";
                    DirIcon = ArrowUpRight;
                  }

                  return (
                    <tr
                      key={tx.inventory_transaction_id}
                      onClick={() => handleRowClick(tx)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 text-slate-600 font-medium whitespace-nowrap">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : tx.transaction_date || "-"}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{tx.room_name || "Room"}</p>
                        <p className="text-[11px] text-slate-400">{tx.property_name || ""}</p>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{tx.transaction_type || "Update"}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold ${dirBadge}`}>
                          <DirIcon className="h-3 w-3" />
                          {direction}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{tx.quantity || 1}</td>
                      <td className="p-3.5 text-slate-700">
                        {tx.previous_available_units ?? 0} → <span className="font-bold text-slate-900">{tx.new_available_units ?? 0}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{tx.reason || tx.remarks || "-"}</td>
                      <td className="p-3.5 text-slate-500">{tx.source || "System"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Right Drawer (Screen 2 Drawer Pattern) */}
      {isDrawerOpen && selectedTx && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/30 backdrop-blur-xs">
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Transaction Details
                  </h2>
                  <p className="text-xs font-medium text-emerald-700 mt-0.5">
                    {selectedTx.room_name || "Room"} • {selectedTx.transaction_type || "Activity"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                {/* Unit Changes Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Unit State Changes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-1">
                      <span className="block text-[10px] font-semibold text-slate-400">Available Units</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedTx.previous_available_units ?? 0} → {selectedTx.new_available_units ?? 0}
                      </span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-1">
                      <span className="block text-[10px] font-semibold text-slate-400">Booked Units</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedTx.previous_booked_units ?? 0} → {selectedTx.new_booked_units ?? 0}
                      </span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-1">
                      <span className="block text-[10px] font-semibold text-slate-400">Blocked Units</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedTx.previous_blocked_units ?? 0} → {selectedTx.new_blocked_units ?? 0}
                      </span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-1">
                      <span className="block text-[10px] font-semibold text-slate-400">Maintenance Units</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedTx.previous_maintenance_units ?? 0} → {selectedTx.new_maintenance_units ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Audit Information
                  </h3>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        Transaction Type
                      </span>
                      <span className="font-bold text-slate-900">{selectedTx.transaction_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                        Direction
                      </span>
                      <span className="font-bold text-slate-900">{selectedTx.transaction_direction || "Adjustment"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Date &amp; Time
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedTx.created_at ? new Date(selectedTx.created_at).toLocaleString() : selectedTx.transaction_date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Source / User
                      </span>
                      <span className="font-semibold text-slate-800">{selectedTx.source || "System"}</span>
                    </div>
                  </div>
                </div>

                {/* Reason & Remarks */}
                {(selectedTx.reason || selectedTx.remarks) && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Reason &amp; Remarks
                    </h3>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 text-slate-700">
                      {selectedTx.reason && (
                        <div>
                          <span className="block font-bold text-slate-900">Reason</span>
                          <p>{selectedTx.reason}</p>
                        </div>
                      )}
                      {selectedTx.remarks && (
                        <div>
                          <span className="block font-bold text-slate-900">Remarks</span>
                          <p>{selectedTx.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-100 p-4 flex justify-end bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryHistoryPage;
