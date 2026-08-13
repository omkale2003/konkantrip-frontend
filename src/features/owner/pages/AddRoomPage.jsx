import { useNavigate, useLocation, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import RoomForm from "../components/rooms/RoomForm.jsx";
import { useCreateRoom } from "../hooks/useRooms.js";
import { ROUTES } from "../../../constants/routes.js";
import { useState } from "react";

function AddRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyId = location.state?.propertyId;
  const [errorMsg, setErrorMsg] = useState("");

  const { mutateAsync: createRoom, isPending } = useCreateRoom();

  const handleSubmit = async (data) => {
    try {
      setErrorMsg("");
      await createRoom({
        ...data,
        property_id: propertyId,
      });
      navigate(ROUTES.OWNER_ROOMS);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to create room.");
    }
  };

  if (!propertyId) {
    return (
      <div className="p-6 text-center text-red-600">
        Missing property context. Please go back to the rooms list.
      </div>
    );
  }

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
            Add New Room
          </h1>
          <p className="text-sm text-slate-500">
            Create a new room for your property.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <RoomForm 
        onSubmit={handleSubmit} 
        isSubmitting={isPending} 
        onCancel={() => navigate(ROUTES.OWNER_ROOMS)}
      />
    </div>
  );
}

export default AddRoomPage;
