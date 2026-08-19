import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  Building2,
  AlertCircle,
  HelpCircle,
  Plus,
  CheckCircle2,
  Lock,
  XCircle,
  IndianRupee,
  BedDouble,
  SlidersHorizontal,
} from "lucide-react";
import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { usePropertyRooms } from "../../properties/hooks/usePropertyRooms.js";
import { useInventoryCalendar } from "../hooks/useInventory.js";
import InventoryHeader from "../components/InventoryHeader.jsx";
import DailyInventoryDrawer from "../components/DailyInventoryDrawer.jsx";
import CreateBlockModal from "../components/CreateBlockModal.jsx";
import CreateStopSellModal from "../components/CreateStopSellModal.jsx";

// Date Helpers (YYYY-MM-DD local formatting without timezone shift)
function formatDateYYYYMMDD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekDays(startDate) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push({
      dateObj: d,
      dateString: formatDateYYYYMMDD(d),
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      monthDay: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      isToday: formatDateYYYYMMDD(d) === formatDateYYYYMMDD(new Date()),
    });
  }
  return days;
}

function InventoryCalendarPage() {
  const owner = storageService.getOwner();
  const { data: propertiesRes, isLoading: isLoadingProperties } = useProperties({
    owner_id: owner?.p_owner_id || undefined,
    limit: 100,
  });

  const properties = propertiesRes?.data || [];
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  // Default selected property id once loaded
  const activePropertyId = selectedPropertyId || (properties[0]?.property_id ? String(properties[0].property_id) : "");

  // Rooms query for active property
  const { data: roomsRes, isLoading: isLoadingRooms } = usePropertyRooms(activePropertyId);
  const rooms = roomsRes?.data || [];

  const [selectedRoomId, setSelectedRoomId] = useState("");

  // Date range state (defaults to today's week start)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    return today;
  });

  const weekDays = useMemo(() => getWeekDays(weekStartDate), [weekStartDate]);
  const startDateStr = weekDays[0].dateString;
  const endDateStr = weekDays[6].dateString;

  // Calendar query from real backend GET /inventory/calendar
  const { data: calendarRes, isLoading: isLoadingCalendar, error: calendarError } = useInventoryCalendar({
    property_id: activePropertyId || undefined,
    room_id: selectedRoomId || undefined,
    start_date: startDateStr,
    end_date: endDateStr,
  });

  const calendarData = calendarRes?.data || [];

  // Cell Drawer & Modals state
  const [selectedCell, setSelectedCell] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateBlockOpen, setIsCreateBlockOpen] = useState(false);
  const [isCreateStopSellOpen, setIsCreateStopSellOpen] = useState(false);

  // Overview KPI Stats for selected date range
  const todayDateStr = formatDateYYYYMMDD(new Date());

  const overviewStats = useMemo(() => {
    let totalUnits = 0;
    let availableToday = 0;
    let bookedToday = 0;
    let blockedToday = 0;
    let stopSellCount = 0;

    rooms.forEach((r) => {
      const units = Number(r.total_units || 1);
      totalUnits += units;

      const todayItem = calendarData.find(
        (c) => String(c.room_id) === String(r.room_id) && c.inventory_date?.slice(0, 10) === todayDateStr
      );

      if (todayItem) {
        availableToday += Number(todayItem.available_units || 0);
        bookedToday += Number(todayItem.booked_units || 0);
        blockedToday += Number((todayItem.blocked_units || 0) + (todayItem.maintenance_units || 0));
        if (todayItem.inventory_status === "Stop Sell" || (todayItem.stop_sell_units || 0) > 0) {
          stopSellCount += 1;
        }
      } else {
        availableToday += units;
      }
    });

    return {
      totalUnits,
      availableToday,
      bookedToday,
      blockedToday,
      stopSellCount,
    };
  }, [rooms, calendarData, todayDateStr]);

  // Navigation handlers
  const handlePrevWeek = () => {
    setWeekStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setWeekStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleToday = () => {
    setWeekStartDate(new Date());
  };

  const handleCellClick = (room, day) => {
    // Find calendar item matching this room_id and date
    const item = calendarData.find(
      (c) => String(c.room_id) === String(room.room_id) && c.inventory_date?.slice(0, 10) === day.dateString
    );

    setSelectedCell({
      room,
      dateString: day.dateString,
      dateFormatted: `${day.dayName}, ${day.monthDay}`,
      inventoryItem: item,
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Shared Header & Tabs */}
      <InventoryHeader
        title="Inventory Overview & Calendar"
        subtitle="Live daily availability, custom rate overrides, and instant restrictions"
        actionButtonText="+ Block Room"
        onActionButtonClick={() => setIsCreateBlockOpen(true)}
      />

      {/* Overview KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Stock</span>
            <BedDouble className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{overviewStats.totalUnits}</p>
          <span className="text-[11px] font-medium text-slate-400">Total room units configured</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Available Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">{overviewStats.availableToday}</p>
          <span className="text-[11px] font-medium text-emerald-600">Open for immediate booking</span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-semibold">Booked Today</span>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-700">{overviewStats.bookedToday}</p>
          <span className="text-[11px] font-medium text-blue-600">Confirmed guest stays</span>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-semibold">Blocked / Maint</span>
            <Lock className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-purple-700">{overviewStats.blockedToday}</p>
          <span className="text-[11px] font-medium text-purple-600">Operational holds</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-semibold">Stop Sell Rules</span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{overviewStats.stopSellCount}</p>
          <button
            type="button"
            onClick={() => setIsCreateStopSellOpen(true)}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
          >
            + Add Stop Sell
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Property Dropdown */}
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Property
            </label>
            {isLoadingProperties ? (
              <div className="h-9 w-full rounded-lg bg-slate-100 animate-pulse" />
            ) : (
              <select
                value={activePropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  setSelectedRoomId("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {properties.length === 0 ? (
                  <option value="">No Properties Found</option>
                ) : (
                  properties.map((p) => (
                    <option key={p.property_id} value={p.property_id}>
                      {p.property_name}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          {/* Date Range Navigator */}
          <div className="lg:col-span-4">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Date Range (7-Day Overview)
            </label>
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1">
              <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
              <span className="flex-1 text-center text-xs font-semibold text-slate-800 truncate">
                {weekDays[0].monthDay} – {weekDays[6].monthDay} {weekDays[0].dateObj.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handlePrevWeek}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                title="Previous Week"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                title="Next Week"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Room Filter Dropdown */}
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Room Filter
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Rooms ({rooms.length})</option>
              {rooms.map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  {r.room_name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-2 flex items-center gap-2 pt-1 sm:pt-4">
            <button
              type="button"
              onClick={handleToday}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Today</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateStopSellOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all"
              title="Add Stop Sell Rule"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {isLoadingCalendar || isLoadingRooms ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading live inventory overview from database...
            </p>
          </div>
        ) : calendarError ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="text-sm font-medium text-red-700">
              {calendarError?.response?.data?.message || "Unable to load inventory data from server."}
            </p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Building2 className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-800">No rooms found</h3>
            <p className="text-xs text-slate-500">
              Add rooms to this property to manage their inventory overview and calendar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <th className="p-4 w-64 min-w-[200px] border-r border-slate-200">
                    Room Details
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.dateString}
                      className={[
                        "p-3 text-center min-w-[120px] border-r border-slate-200 last:border-r-0",
                        day.isToday ? "bg-emerald-50/60 font-bold text-emerald-900" : "",
                      ].join(" ")}
                    >
                      <div className="text-xs font-bold text-slate-900">
                        {day.dayName}, {day.monthDay}
                      </div>
                      {day.isToday && (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                          Today
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {rooms.map((room) => (
                  <tr key={room.room_id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Left Room Info Column */}
                    <td className="p-4 border-r border-slate-200 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm">
                          {room.room_name?.charAt(0) || "R"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {room.room_name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {room.room_code || `RM-${room.room_id}`}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-0.5 flex-wrap">
                            <span>Units: {room.total_units || 1}</span>
                            {room.discount_price && Number(room.discount_price) > 0 ? (
                              <span>
                                • <span className="font-bold text-emerald-700">₹{Number(room.discount_price).toLocaleString("en-IN")}</span>
                                {Number(room.base_price) > Number(room.discount_price) && (
                                  <span className="text-slate-400 line-through ml-1 text-[10px]">
                                    ₹{Number(room.base_price).toLocaleString("en-IN")}
                                  </span>
                                )}
                                /nt
                              </span>
                            ) : room.base_price > 0 ? (
                              <span>• ₹{Number(room.base_price).toLocaleString("en-IN")}/nt</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 7 Days Cells */}
                    {weekDays.map((day) => {
                      // Find real backend record for this room and date
                      const item = calendarData.find(
                        (c) =>
                          String(c.room_id) === String(room.room_id) &&
                          c.inventory_date?.slice(0, 10) === day.dateString
                      );

                      const totalUnits = item?.total_units ?? room.total_units ?? 1;
                      const availableUnits = item?.available_units ?? totalUnits;
                      const bookedUnits = item?.booked_units || 0;
                      const blockedUnits = item?.blocked_units || 0;
                      const maintenanceUnits = item?.maintenance_units || 0;
                      const stopSellUnits = item?.stop_sell_units || 0;
                      const status = item?.inventory_status;

                      // Resolve daily price and daily discount price
                      const dailyPrice = item?.daily_price !== undefined && item?.daily_price !== null && item?.daily_price !== ""
                        ? Number(item.daily_price)
                        : (room.base_price ? Number(room.base_price) : null);

                      const dailyDiscountPrice = item?.daily_discount_price !== undefined && item?.daily_discount_price !== null && item?.daily_discount_price !== ""
                        ? Number(item.daily_discount_price)
                        : (room.room_discount_price ? Number(room.room_discount_price) : (room.discount_price ? Number(room.discount_price) : null));

                      // Status & Styling computation from real DB fields
                      let badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300";
                      let dotColor = "bg-emerald-500";
                      let statusText = "Available";

                      if (status === "Blocked" || (blockedUnits > 0 && availableUnits === 0)) {
                        badgeColor = "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-300";
                        dotColor = "bg-blue-500";
                        statusText = "Blocked";
                      } else if (status === "Maintenance" || (maintenanceUnits > 0 && availableUnits === 0)) {
                        badgeColor = "bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-300";
                        dotColor = "bg-purple-500";
                        statusText = "Maintenance";
                      } else if (status === "Stop Sell" || item?.is_available === false || stopSellUnits > 0) {
                        badgeColor = "bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400";
                        dotColor = "bg-slate-500";
                        statusText = "Stop Sell";
                      } else if (availableUnits === 0) {
                        badgeColor = "bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-300";
                        dotColor = "bg-rose-500";
                        statusText = "Sold Out";
                      } else if (availableUnits <= 2) {
                        badgeColor = "bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300";
                        dotColor = "bg-amber-500";
                        statusText = "Low Stock";
                      }

                      return (
                        <td
                          key={day.dateString}
                          onClick={() => handleCellClick(room, day)}
                          className="p-2 border-r border-slate-200 last:border-r-0 cursor-pointer hover:bg-slate-100/50 transition-all text-center align-middle"
                        >
                          <div className={`rounded-xl border p-2.5 space-y-1 transition-all shadow-2xs ${badgeColor}`}>
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              {dailyDiscountPrice && Number(dailyDiscountPrice) > 0 ? (
                                <div className="flex items-center gap-1 min-w-0 truncate">
                                  <span className="text-emerald-800 font-extrabold truncate">
                                    ₹{Number(dailyDiscountPrice).toLocaleString("en-IN")}
                                  </span>
                                  {dailyPrice && Number(dailyPrice) > Number(dailyDiscountPrice) && (
                                    <span className="text-[9px] text-slate-400 line-through truncate font-normal">
                                      ₹{Number(dailyPrice).toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-800 font-bold truncate">
                                  {dailyPrice ? `₹${Number(dailyPrice).toLocaleString("en-IN")}` : "-"}
                                </span>
                              )}
                              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                            </div>

                            <span className="block text-lg font-black tracking-tight">
                              {availableUnits} <span className="text-[10px] font-normal text-slate-500">avail</span>
                            </span>

                            <div className="text-[10px] font-semibold tracking-wide uppercase">
                              <span>{statusText}</span>
                            </div>

                            {(bookedUnits > 0 || blockedUnits > 0) && (
                              <div className="text-[9px] text-slate-500 font-medium pt-0.5 border-t border-slate-200/60 flex justify-between">
                                {bookedUnits > 0 && <span>{bookedUnits} bkd</span>}
                                {blockedUnits > 0 && <span>{blockedUnits} blkd</span>}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend & Help Footer */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Low Stock
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Sold Out
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              Maintenance
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
              Stop Sell
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-500 font-semibold">
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
            <span>Click any cell to manually edit rates, stock, restrictions & status</span>
          </div>
        </div>
      </div>

      {/* Screen 2 Drawer */}
      <DailyInventoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCell={selectedCell}
        propertyId={activePropertyId}
      />

      {/* Quick Action Block Modal */}
      <CreateBlockModal
        isOpen={isCreateBlockOpen}
        onClose={() => setIsCreateBlockOpen(false)}
        properties={properties}
        rooms={rooms}
        selectedPropertyId={activePropertyId}
      />

      {/* Quick Action Stop Sell Modal */}
      <CreateStopSellModal
        isOpen={isCreateStopSellOpen}
        onClose={() => setIsCreateStopSellOpen(false)}
        properties={properties}
        rooms={rooms}
        selectedPropertyId={activePropertyId}
      />
    </div>
  );
}

export default InventoryCalendarPage;
