import { Link } from "react-router-dom";
import { Hotel, Loader2, Edit, Trash2 } from "lucide-react";

import Button from "../../../../components/ui/Button/Button.jsx";
import { useDeleteRoom } from "../../hooks/useRooms.js";
import { useState } from "react";

function RoomList({ rooms, isLoading, isError, propertyId }) {
  const [roomToDelete, setRoomToDelete] = useState(null);
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();

  const handleDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete, {
        onSuccess: () => setRoomToDelete(null)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        Failed to load rooms. Please try again later.
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Hotel className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No rooms added yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Add your first room to start managing availability.
        </p>
        <div className="mt-6">
          <Link to="/owner/rooms/add" state={{ propertyId }}>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
              Add Room
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Room Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Occupancy</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rooms.map((room) => (
              <tr key={room.room_id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{room.room_name}</span>
                    <span className="text-xs text-slate-500">Code: {room.room_code}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                  {room.room_type_name || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                  <div className="flex flex-col">
                    <span>Base: {room.base_guests || "-"}</span>
                    <span className="text-xs text-slate-500">Max: {room.maximum_guests || "-"}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${room.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                    {room.room_status_name || (room.is_published ? "Published" : "Draft")}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <Link to={`/owner/rooms/${room.room_id}/edit`} state={{ propertyId }} className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => setRoomToDelete(room.room_id)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Room</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setRoomToDelete(null)}
                disabled={isDeleting}
                className="bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Room"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomList;
