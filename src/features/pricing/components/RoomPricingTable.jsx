import { useState } from "react";
import {
  Zap,
  Tag,
  Sparkles,
  TrendingUp,
  Percent,
  Edit2,
  CalendarRange,
  Check,
  X,
  Hotel,
  Users,
  ChevronRight,
} from "lucide-react";
import { getImageUrl, handleImageError } from "../../../utils/imageUrl.js";
import { useBulkUpdatePricing } from "../hooks/usePricing.js";

function RoomPricingTable({
  rooms = [],
  selectedRoomIds = [],
  onToggleSelectRoom,
  onSelectAllRooms,
  onOpenBulkModal,
  onOpenSingleEditModal,
  onOpenSeasonalModal,
}) {
  const bulkMutation = useBulkUpdatePricing();
  const [inlineEditingRoomId, setInlineEditingRoomId] = useState(null);
  const [inlineBasePrice, setInlineBasePrice] = useState("");
  const [inlineDiscountPrice, setInlineDiscountPrice] = useState("");

  const isAllSelected =
    rooms.length > 0 && selectedRoomIds.length === rooms.length;

  const handleStartInlineEdit = (room) => {
    setInlineEditingRoomId(room.room_id);
    setInlineBasePrice(
      room.base_price !== null && room.base_price !== undefined
        ? String(room.base_price)
        : ""
    );
    setInlineDiscountPrice(
      room.discount_price !== null && room.discount_price !== undefined
        ? String(room.discount_price)
        : ""
    );
  };

  const handleSaveInlineEdit = async (room) => {
    const baseVal = Number(inlineBasePrice);
    if (isNaN(baseVal) || baseVal < 0) {
      setInlineEditingRoomId(null);
      return;
    }

    const discVal =
      inlineDiscountPrice.trim() !== "" ? Number(inlineDiscountPrice) : null;

    try {
      await bulkMutation.mutateAsync({
        room_ids: [room.room_id],
        action: "set_price",
        base_price: baseVal,
        discount_price: discVal,
      });
    } catch (_) {}

    setInlineEditingRoomId(null);
  };

  const handleQuickPercent = async (room, percent) => {
    try {
      await bulkMutation.mutateAsync({
        room_ids: [room.room_id],
        action: "adjust_percent",
        percentage: percent,
      });
    } catch (_) {}
  };

  return (
    <div className="space-y-3">
      {/* Floating / Sticky Selected Items Action Bar */}
      {selectedRoomIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
              {selectedRoomIds.length}
            </span>
            <span className="text-xs font-semibold">
              {selectedRoomIds.length === 1 ? "1 room" : `${selectedRoomIds.length} rooms`} selected for bulk pricing action
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenBulkModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-2xs"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>Bulk Adjust Prices</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectAllRooms(false)}
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAllRooms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[220px]">Room & Property</th>
                <th className="py-3 px-4 min-w-[150px] text-right">
                  Base Nightly Rate
                </th>
                <th className="py-3 px-4 min-w-[160px] text-right">
                  Promotional Rate
                </th>
                <th className="py-3 px-4 min-w-[130px] text-center">
                  Extra Guests
                </th>
                <th className="py-3 px-4 min-w-[130px] text-center">
                  Effective Rate
                </th>
                <th className="py-3 px-4 min-w-[160px] text-right">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <Tag className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      No rooms found
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search terms or property filter.
                    </p>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => {
                  const isSelected = selectedRoomIds.includes(room.room_id);
                  const isInlineEditing = inlineEditingRoomId === room.room_id;
                  const imageUrl = getImageUrl(room);

                  const base = Number(room.base_price) || 0;
                  const discount =
                    room.discount_price !== null &&
                    room.discount_price !== undefined
                      ? Number(room.discount_price)
                      : null;
                  const hasDiscount = discount !== null && discount < base;
                  const discountPct = hasDiscount
                    ? Math.round(((base - discount) / base) * 100)
                    : 0;

                  const effectivePrice = hasDiscount ? discount : base;

                  return (
                    <tr
                      key={room.room_id}
                      className={`transition ${
                        isSelected
                          ? "bg-emerald-50/40 hover:bg-emerald-50/60"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelectRoom(room.room_id)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Room & Property Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={room.room_name}
                                className="h-full w-full object-cover"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Hotel className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">
                              {room.room_name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono font-semibold text-slate-600">
                                {room.room_code}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[130px]">
                                {room.property_name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Base Nightly Rate */}
                      <td className="py-3.5 px-4 text-right">
                        {isInlineEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs font-bold text-slate-400">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              value={inlineBasePrice}
                              onChange={(e) => setInlineBasePrice(e.target.value)}
                              className="w-20 rounded border border-emerald-600 bg-white py-1 px-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartInlineEdit(room)}
                            className="group cursor-pointer inline-flex flex-col items-end"
                            title="Click to inline edit base price"
                          >
                            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                              ₹{base.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 group-hover:text-emerald-600">
                              <span>Standard</span>
                              <Edit2 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition" />
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Promotional Rate */}
                      <td className="py-3.5 px-4 text-right">
                        {isInlineEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs font-bold text-slate-400">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              placeholder="None"
                              value={inlineDiscountPrice}
                              onChange={(e) => setInlineDiscountPrice(e.target.value)}
                              className="w-20 rounded border border-amber-500 bg-white py-1 px-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveInlineEdit(room)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              title="Save"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setInlineEditingRoomId(null)}
                              className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300"
                              title="Cancel"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : hasDiscount ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-amber-700">
                              ₹{discount.toLocaleString("en-IN")}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 border border-amber-200">
                              {discountPct}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            No active promo
                          </span>
                        )}
                      </td>

                      {/* Extra Guests */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                          <div>
                            Adult: <strong className="text-slate-800">₹{room.extra_adult_price || 0}</strong>
                          </div>
                          <div>
                            Child: <strong className="text-slate-800">₹{room.extra_child_price || 0}</strong>
                          </div>
                        </div>
                      </td>

                      {/* Effective Rate */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-900">
                          ₹{effectivePrice.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick +10% */}
                          <button
                            type="button"
                            onClick={() => handleQuickPercent(room, 10)}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition"
                            title="Quick +10% surge on base price"
                          >
                            +10%
                          </button>

                          {/* Quick -10% */}
                          <button
                            type="button"
                            onClick={() => handleQuickPercent(room, -10)}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition"
                            title="Quick -10% discount on base price"
                          >
                            -10%
                          </button>

                          {/* Full Edit Modal */}
                          <button
                            type="button"
                            onClick={() => onOpenSingleEditModal(room)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                            title="Edit full room pricing"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Add Seasonal Rule */}
                          <button
                            type="button"
                            onClick={() => onOpenSeasonalModal(room)}
                            className="rounded-md p-1.5 text-indigo-600 hover:bg-indigo-50 transition"
                            title="Add seasonal rate rule for this room"
                          >
                            <CalendarRange className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoomPricingTable;
