import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  RotateCcw,
  ChevronRight,
  X,
  Building2,
  LayoutGrid,
  List,
  Users,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { useRooms, useRoomLookups } from "../hooks/useRooms.js";
import RoomList from "../components/RoomList.jsx";

function RoomsPage() {
  const owner = storageService.getOwner();
  const [selectedPropertyId, setSelectedPropertyId] = useState("ALL");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("ALL");
  const [selectedStatusId, setSelectedStatusId] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [minGuests, setMinGuests] = useState("ALL");
  const [selectedRoomView, setSelectedRoomView] = useState("ALL");
  const [bookableOnly, setBookableOnly] = useState(false);
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  // Fetch properties list for filter dropdown
  const { data: propertiesData } = useProperties({
    owner_id: owner?.p_owner_id,
    limit: 100,
  });

  // Fetch room lookups for filters
  const { data: roomTypesData } = useRoomLookups("ROOM_TYPES");
  const { data: roomStatusData } = useRoomLookups("ROOM_STATUS");

  const properties = propertiesData?.data || [];
  const roomTypes = roomTypesData?.data || [];
  const roomStatuses = roomStatusData?.data || [];

  // Fetch rooms list (when property is ALL, queryParams has limit 200)
  const queryParams = useMemo(() => {
    const p = { limit: 200 };
    if (selectedPropertyId !== "ALL" && selectedPropertyId) {
      p.property_id = selectedPropertyId;
    }
    return p;
  }, [selectedPropertyId]);

  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useRooms(queryParams);

  const rawRooms = roomsData?.data || [];

  // Comprehensive Client-side Filter logic
  const filteredRooms = useMemo(() => {
    return rawRooms.filter((room) => {
      // Owner Filter (if room has p_owner_id)
      if (owner?.p_owner_id && room.p_owner_id) {
        if (room.p_owner_id.toString() !== owner.p_owner_id.toString()) {
          return false;
        }
      }

      // Property Filter
      if (selectedPropertyId !== "ALL" && selectedPropertyId) {
        if (room.property_id?.toString() !== selectedPropertyId.toString()) {
          return false;
        }
      }

      // Room Type Filter
      if (selectedRoomTypeId !== "ALL" && selectedRoomTypeId) {
        if (room.room_type_id?.toString() !== selectedRoomTypeId.toString()) {
          return false;
        }
      }

      // Status Filter
      if (selectedStatusId !== "ALL" && selectedStatusId) {
        if (room.room_status_id?.toString() !== selectedStatusId.toString()) {
          return false;
        }
      }

      // Minimum Guests Filter
      if (minGuests !== "ALL" && minGuests) {
        const capacity = room.maximum_guests || room.base_occupancy || 0;
        if (capacity < Number(minGuests)) {
          return false;
        }
      }

      // Room View Filter
      if (selectedRoomView !== "ALL" && selectedRoomView) {
        const roomViewName = room.room_view_name?.toLowerCase() || "";
        if (!roomViewName.includes(selectedRoomView.toLowerCase())) {
          return false;
        }
      }

      // Bookable Only Filter
      if (bookableOnly) {
        if (!room.is_bookable) {
          return false;
        }
      }

      // Search Query Filter (name, code, type, property)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (room.room_name || "").toLowerCase().includes(q);
        const matchesCode = (room.room_code || "").toLowerCase().includes(q);
        const matchesType = (room.room_type_name || "").toLowerCase().includes(q);
        const matchesProperty = (room.property_name || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesType && !matchesProperty) {
          return false;
        }
      }

      return true;
    });
  }, [
    rawRooms,
    owner?.p_owner_id,
    selectedPropertyId,
    selectedRoomTypeId,
    selectedStatusId,
    minGuests,
    selectedRoomView,
    bookableOnly,
    searchQuery,
  ]);

  // Count active advanced filters
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (minGuests !== "ALL") count++;
    if (selectedRoomView !== "ALL") count++;
    if (bookableOnly) count++;
    return count;
  }, [minGuests, selectedRoomView, bookableOnly]);

  // Total active filter count (including main filters)
  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (selectedPropertyId !== "ALL") count++;
    if (selectedRoomTypeId !== "ALL") count++;
    if (selectedStatusId !== "ALL") count++;
    if (searchQuery.trim() !== "") count++;
    if (minGuests !== "ALL") count++;
    if (selectedRoomView !== "ALL") count++;
    if (bookableOnly) count++;
    return count;
  }, [
    selectedPropertyId,
    selectedRoomTypeId,
    selectedStatusId,
    searchQuery,
    minGuests,
    selectedRoomView,
    bookableOnly,
  ]);

  const handleResetFilters = () => {
    setSelectedPropertyId("ALL");
    setSelectedRoomTypeId("ALL");
    setSelectedStatusId("ALL");
    setSearchQuery("");
    setMinGuests("ALL");
    setSelectedRoomView("ALL");
    setBookableOnly(false);
  };

  // Helper getters for chip labels
  const selectedPropertyName = useMemo(() => {
    if (selectedPropertyId === "ALL") return null;
    const p = properties.find((item) => item.property_id?.toString() === selectedPropertyId);
    return p ? p.property_name : `Property #${selectedPropertyId}`;
  }, [selectedPropertyId, properties]);

  const selectedRoomTypeName = useMemo(() => {
    if (selectedRoomTypeId === "ALL") return null;
    const t = roomTypes.find((item) => item.room_type_id?.toString() === selectedRoomTypeId);
    return t ? t.room_type_name : `Type #${selectedRoomTypeId}`;
  }, [selectedRoomTypeId, roomTypes]);

  const selectedStatusName = useMemo(() => {
    if (selectedStatusId === "ALL") return null;
    const s = roomStatuses.find((item) => item.room_status_id?.toString() === selectedStatusId);
    return s ? s.status_name : `Status #${selectedStatusId}`;
  }, [selectedStatusId, roomStatuses]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Rooms</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900">All Rooms</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Rooms Management
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {filteredRooms.length} {filteredRooms.length === 1 ? "Room" : "Rooms"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View, search, and manage rooms across all your properties
          </p>
        </div>

        <Link
          to="/owner/rooms/add"
          state={{ propertyId: selectedPropertyId !== "ALL" ? selectedPropertyId : undefined }}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Link>
      </div>

      {/* Main Filter & Search Bar Container */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4 transition-all">
        {/* Main Controls Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12 items-end">
          {/* Search Input (4 Cols on LG) */}
          <div className="lg:col-span-4 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Search Rooms
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, type or property..."
                className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-8 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Property Dropdown (3 Cols on LG) */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block flex items-center gap-1">
              <Building2 className="h-3 w-3 text-slate-400" /> Property
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            >
              <option value="ALL">All Properties ({properties.length})</option>
              {properties.map((p) => (
                <option key={p.property_id} value={p.property_id.toString()}>
                  {p.property_name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type Dropdown (2.5 Cols on LG) */}
          <div className="lg:col-span-2.5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Room Type
            </label>
            <select
              value={selectedRoomTypeId}
              onChange={(e) => setSelectedRoomTypeId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            >
              <option value="ALL">All Types</option>
              {roomTypes.map((t) => (
                <option key={t.room_type_id} value={t.room_type_id.toString()}>
                  {t.room_type_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown (2.5 Cols on LG) */}
          <div className="lg:col-span-2.5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Status
            </label>
            <select
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            >
              <option value="ALL">All Statuses</option>
              {roomStatuses.map((s) => (
                <option key={s.room_status_id} value={s.room_status_id.toString()}>
                  {s.status_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Advanced Filters Toggle & Reset */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                showAdvancedFilters || activeAdvancedCount > 0
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-700" />
              <span>More Filters</span>
              {activeAdvancedCount > 0 && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white">
                  {activeAdvancedCount}
                </span>
              )}
            </button>

            {totalActiveFilters > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline-block">
            Showing {filteredRooms.length} of {rawRooms.length} total rooms
          </span>
        </div>

        {/* Expandable Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Min Guests */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-500" /> Minimum Guests
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["ALL", "1", "2", "4", "6"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setMinGuests(g)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold border transition-all ${
                        minGuests === g
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {g === "ALL" ? "Any" : `${g}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room View */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-slate-500" /> Room View
                </label>
                <select
                  value={selectedRoomView}
                  onChange={(e) => setSelectedRoomView(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 py-1.5 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Views</option>
                  <option value="sea">Sea / Ocean View</option>
                  <option value="garden">Garden View</option>
                  <option value="mountain">Mountain / Hill View</option>
                  <option value="pool">Pool View</option>
                  <option value="city">City View</option>
                </select>
              </div>

              {/* Bookable Only */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Availability
                </label>
                <button
                  type="button"
                  onClick={() => setBookableOnly(!bookableOnly)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    bookableOnly
                      ? "border-emerald-600 bg-emerald-100 text-emerald-800 font-semibold"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      bookableOnly ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                  />
                  Bookable Rooms Only
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {totalActiveFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Filters:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
                Search: "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedPropertyName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                Property: {selectedPropertyName}
                <button
                  type="button"
                  onClick={() => setSelectedPropertyId("ALL")}
                  className="text-emerald-500 hover:text-emerald-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedRoomTypeName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800 border border-blue-200">
                Type: {selectedRoomTypeName}
                <button
                  type="button"
                  onClick={() => setSelectedRoomTypeId("ALL")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedStatusName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                Status: {selectedStatusName}
                <button
                  type="button"
                  onClick={() => setSelectedStatusId("ALL")}
                  className="text-amber-500 hover:text-amber-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {minGuests !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-800 border border-purple-200">
                Min Guests: {minGuests}+
                <button
                  type="button"
                  onClick={() => setMinGuests("ALL")}
                  className="text-purple-500 hover:text-purple-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedRoomView !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-800 border border-cyan-200">
                View: {selectedRoomView}
                <button
                  type="button"
                  onClick={() => setSelectedRoomView("ALL")}
                  className="text-cyan-500 hover:text-cyan-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {bookableOnly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                Bookable Only
                <button
                  type="button"
                  onClick={() => setBookableOnly(false)}
                  className="text-emerald-500 hover:text-emerald-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Header & View Mode Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-600 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredRooms.length}</span> matching rooms
        </div>

        {/* View mode toggle buttons */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "table"
                ? "bg-emerald-700 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="Table View"
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "grid"
                ? "bg-emerald-700 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* Main Table or Grid Cards List */}
      <RoomList
        rooms={filteredRooms}
        isLoading={isLoadingRooms}
        isError={isRoomsError}
        propertyId={selectedPropertyId !== "ALL" ? selectedPropertyId : undefined}
        viewMode={viewMode}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}

export default RoomsPage;
