import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useState } from "react";

import RoomForm from "../components/rooms/RoomForm.jsx";
import RoomBeds from "../components/rooms/RoomBeds.jsx";
import RoomAmenities from "../components/rooms/RoomAmenities.jsx";
import RoomFacilities from "../components/rooms/RoomFacilities.jsx";
import RoomImages from "../components/rooms/RoomImages.jsx";
import { useRoom, useUpdateRoom } from "../hooks/useRooms.js";
import { ROUTES } from "../../../constants/routes.js";

function EditRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const { data, isLoading, isError } = useRoom(roomId);
  const { mutateAsync: updateRoom, isPending } = useUpdateRoom();

  const room = data?.data;

  const handleSubmit = async (formData) => {
    try {
      setErrorMsg("");
      await updateRoom({
        roomId,
        data: formData,
      });
      navigate(ROUTES.OWNER_ROOMS);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to update room.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load room details. Please try again.
      </div>
    );
  }

  // Pre-fill form values
  const defaultValues = {
    room_name: room.room_name,
    room_code: room.room_code,
    room_type_id: room.room_type_id ? room.room_type_id.toString() : "",
    room_status_id: room.room_status_id ? room.room_status_id.toString() : "",
    base_guests: room.base_guests || 2,
    maximum_guests: room.maximum_guests || 2,
    is_bookable: room.is_bookable !== undefined ? Boolean(room.is_bookable) : true,
    is_published: room.is_published !== undefined ? Boolean(room.is_published) : true,
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          to={ROUTES.OWNER_ROOMS} 
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Edit Room
          </h1>
          <p className="text-sm text-slate-500">
            Update room configuration and details.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Basic Info Tab */}
      <RoomForm 
        defaultValues={defaultValues}
        onSubmit={handleSubmit} 
        isSubmitting={isPending} 
        onCancel={() => navigate(ROUTES.OWNER_ROOMS)}
      />

      {/* Sub-resources */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <RoomBeds roomId={roomId} />
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <RoomAmenities roomId={roomId} />
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
          <RoomFacilities roomId={roomId} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <RoomImages roomId={roomId} />
      </div>
    </div>
  );
}

export default EditRoomPage;
