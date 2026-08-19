import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Hotel,
  Loader2,
  Edit2,
  Trash2,
  MoreVertical,
  Waves,
  Leaf,
  EyeOff,
  Users,
  ChevronLeft,
  ChevronRight,
  Mountain,
  RotateCcw,
  Plus,
  Power,
} from "lucide-react";
import { useDeleteRoom, useUpdateRoom } from "../hooks/useRooms.js";
import { getImageUrl, handleImageError, DEFAULT_ROOM_IMAGE } from "../../../utils/imageUrl.js";

// Helper for type badges
const getTypeBadgeStyle = (typeName = "") => {
  const lower = (typeName || "").toLowerCase();
  if (lower.includes("deluxe")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (lower.includes("standard")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (lower.includes("superior") || lower.includes("suite")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }
  if (lower.includes("economy")) {
    return "bg-slate-100 text-slate-700 border-slate-200";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

// Helper for View Icon & Text
const renderRoomView = (viewName = "") => {
  const safeName = viewName || "";
  const lower = safeName.toLowerCase();
  if (lower.includes("sea") || lower.includes("ocean") || lower.includes("beach")) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-700">
        <Waves className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
        {safeName || "Sea View"}
      </span>
    );
  }
  if (lower.includes("garden") || lower.includes("park") || lower.includes("lawn")) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
        <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        {safeName || "Garden View"}
      </span>
    );
  }
  if (lower.includes("mountain") || lower.includes("hill")) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
        <Mountain className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
        {safeName || "Mountain View"}
      </span>
    );
  }
  if (lower.includes("no") || lower.includes("none")) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <EyeOff className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        {safeName || "No View"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
      <Leaf className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      {safeName || "Standard View"}
    </span>
  );
};

// Helper for Status Badge & Dot
const renderStatusBadge = (statusName = "", isPublished = true, isActive = true) => {
  const safeName = statusName || "";
  const lower = safeName.toLowerCase();
  if (lower.includes("maintenance") || lower.includes("need")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Maintenance
      </span>
    );
  }
  if (lower.includes("out") || lower.includes("service") || !isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Out of Service
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {safeName || (isPublished ? "Available" : "Draft")}
    </span>
  );
};

// Helper for room price display
const getRoomPrice = (room) => {
  if (room?.price !== undefined && room?.price !== null && room?.price !== "" && Number(room.price) > 0) return Number(room.price);
  if (room?.base_price !== undefined && room?.base_price !== null && room?.base_price !== "" && Number(room.base_price) > 0) return Number(room.base_price);
  return null;
};

function RoomList({
  rooms = [],
  isLoading,
  isError,
  propertyId,
  viewMode = "table",
  onResetFilters,
}) {
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === "grid" ? 9 : 10;

  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const [updatingRoomId, setUpdatingRoomId] = useState(null);

  const handleToggleBookable = (room, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setUpdatingRoomId(room.room_id);
    const newBookable = !(room.is_bookable === 1 || room.is_bookable === true);
    updateRoom(
      {
        roomId: room.room_id,
        data: {
          is_bookable: newBookable,
        },
      },
      {
        onSettled: () => setUpdatingRoomId(null),
      }
    );
  };

  const handleDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete, {
        onSuccess: () => {
          setRoomToDelete(null);
          setActiveMenuId(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading rooms...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700 space-y-3">
        <p className="text-sm font-semibold">Failed to load rooms.</p>
        <p className="text-xs text-red-600">Please check your network connection and try again.</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Hotel className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">No rooms found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            No rooms match your currently active filters. Try resetting the filters or add a new room.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              Reset All Filters
            </button>
          )}
          <Link
            to="/owner/rooms/add"
            state={{ propertyId }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-sm transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Room
          </Link>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const totalItems = rooms.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRooms = rooms.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {/* Grid Mode View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedRooms.map((room, idx) => {
            const maxGuests = room.maximum_guests || room.base_occupancy || 2;
            const price = getRoomPrice(room, startIndex + idx);
            const imageUrl = getImageUrl(room, DEFAULT_ROOM_IMAGE);

            return (
              <div
                key={room.room_id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Room Image Header */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={room.room_name}
                        onError={(e) => handleImageError(e, DEFAULT_ROOM_IMAGE)}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                        <Hotel className="h-10 w-10 text-slate-300" />
                      </div>
                    )}

                    {/* Status badge floating */}
                    <div className="absolute top-3 right-3">
                      {renderStatusBadge(
                        room.room_status_name,
                        room.is_published,
                        room.is_active
                      )}
                    </div>

                    {/* Property name badge floating */}
                    <div className="absolute bottom-3 left-3 max-w-[80%]">
                      <span className="inline-block truncate rounded-md bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-white shadow-xs">
                        {room.property_name || "KonkanTrip Property"}
                      </span>
                    </div>
                  </div>

                  {/* Room Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {room.room_name}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">
                          {room.room_code || `RM-${room.room_id}`}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border shrink-0 ${getTypeBadgeStyle(
                          room.room_type_name
                        )}`}
                      >
                        {room.room_type_name || "Room"}
                      </span>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div>{renderRoomView(room.room_view_name)}</div>

                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold">{maxGuests} Guests</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Price per night
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {price ? `₹${price.toLocaleString("en-IN")}` : <span className="text-xs text-slate-400 font-normal italic">Not Set</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookable(room, e)}
                      disabled={updatingRoomId === room.room_id}
                      className={`inline-flex h-8 items-center gap-1.5 px-2.5 rounded-lg border text-xs font-semibold shadow-2xs transition-colors ${
                        room.is_bookable
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                      title={room.is_bookable ? "Room is Bookable (Click to Pause)" : "Room is Paused (Click to Make Bookable)"}
                    >
                      {updatingRoomId === room.room_id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <Power className="h-3.5 w-3.5" />
                      )}
                      <span>{room.is_bookable ? "Bookable" : "Paused"}</span>
                    </button>

                    <Link
                      to={`/owner/rooms/${room.room_id}/edit`}
                      state={{ propertyId: room.property_id || propertyId }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-emerald-700 shadow-2xs hover:bg-emerald-50 transition-colors"
                      title="Edit Room"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setRoomToDelete(room.room_id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-red-600 shadow-2xs hover:bg-red-50 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode View */
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Room
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Property
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Type
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    View
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Max Guests
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Price/Night
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-xs">
                {paginatedRooms.map((room, idx) => {
                  const maxGuests = room.maximum_guests || room.base_occupancy || 2;
                  const maxAdults = room.maximum_adults || maxGuests;
                  const maxChildren = room.maximum_children || 0;
                  const price = getRoomPrice(room, startIndex + idx);

                  return (
                    <tr key={room.room_id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Room Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            {getImageUrl(room, DEFAULT_ROOM_IMAGE) ? (
                              <img
                                src={getImageUrl(room, DEFAULT_ROOM_IMAGE)}
                                alt={room.room_name}
                                onError={(e) => handleImageError(e, DEFAULT_ROOM_IMAGE)}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                <Hotel className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{room.room_name}</span>
                            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                              {room.room_code || `RM-${room.room_id}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Property Column */}
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-700">
                        {room.property_name || "KonkanTrip Beach Resort"}
                      </td>

                      {/* Type Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold border ${getTypeBadgeStyle(
                            room.room_type_name
                          )}`}
                        >
                          {room.room_type_name || "Deluxe Room"}
                        </span>
                      </td>

                      {/* View Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {renderRoomView(room.room_view_name)}
                      </td>

                      {/* Max Guests Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-1.5">
                          <Users className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{maxGuests}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {maxChildren > 0
                                ? `(${maxAdults} Adults + ${maxChildren} Child)`
                                : `(${maxAdults} Adults)`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Column with quick toggle */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookable(room, e)}
                          disabled={updatingRoomId === room.room_id}
                          className="cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
                          title={room.is_bookable ? "Click to Pause booking availability" : "Click to Enable booking availability"}
                        >
                          {updatingRoomId === room.room_id ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating...
                            </span>
                          ) : (
                            renderStatusBadge(
                              room.room_status_name || (room.is_bookable ? "Available" : "Paused"),
                              room.is_published,
                              room.is_active && room.is_bookable
                            )
                          )}
                        </button>
                      </td>

                      {/* Price/Night Column */}
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900 text-xs">
                        {price ? `₹${price.toLocaleString("en-IN")}` : <span className="text-slate-400 font-normal italic">Not Set</span>}
                      </td>

                      {/* Actions Column */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-flex items-center justify-end gap-2">
                          <Link
                            to={`/owner/rooms/${room.room_id}/edit`}
                            state={{ propertyId: room.property_id || propertyId }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-emerald-700 shadow-2xs hover:bg-slate-50 transition-colors"
                            title="Edit Room"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === room.room_id ? null : room.room_id)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-slate-50 transition-colors"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === room.room_id && (
                            <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg text-left">
                              <Link
                                to={`/owner/rooms/${room.room_id}/edit`}
                                state={{ propertyId: room.property_id || propertyId }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Edit2 className="h-3.5 w-3.5 text-emerald-700" />
                                Edit Room
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setRoomToDelete(room.room_id);
                                  setActiveMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                Delete Room
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs">
        <span className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{" "}
          <span className="font-bold text-slate-900">
            {Math.min(startIndex + pageSize, totalItems)}
          </span>{" "}
          of <span className="font-bold text-slate-900">{totalItems}</span> rooms
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                  page === currentPage
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Room</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRoomToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomList;
