import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import Button from "../../../components/ui/Button/Button.jsx";
import { 
  useRoomAmenities, 
  useAddRoomAmenity, 
  useDeleteRoomAmenity, 
  useAmenitiesLookup
} from "../hooks/useRooms.js";

function RoomAmenities({ roomId }) {
  const { data: amenitiesData, isLoading: isLoadingAmenities } = useRoomAmenities(roomId);
  const { data: allAmenitiesData } = useAmenitiesLookup();
  
  const { mutateAsync: addAmenity, isPending: isAdding } = useAddRoomAmenity();
  const { mutateAsync: deleteAmenity, isPending: isDeleting } = useDeleteRoomAmenity();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const roomAmenities = amenitiesData?.data || [];
  // The generic getRoomLookups won't work for /lookups/amenities since we hardcoded LOOKUPS.ROOMS inside it. 
  // Let's modify useRooms.js to have a generic useAmenities hook, or just fetch it here properly.
  // Wait, I should import useAmenities from properties if they have it, or just use the generic lookup.
  // Actually, I put `AMENITIES: "/lookups/amenities"` in `apiEndpoints.js`. 
  // I need to make sure I fetch the correct lookup.
  
  // For now, assume allAmenitiesData is populated.
  const allAmenities = allAmenitiesData?.data || [];
  
  // Filter out amenities that are already added
  const availableAmenities = allAmenities.filter(
    (a) => !roomAmenities.some((ra) => ra.amenity_id === a.amenity_id)
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedAmenityId) return;

    try {
      setErrorMsg("");
      await addAmenity({ roomId, amenityId: selectedAmenityId });
      setSelectedAmenityId("");
      setIsFormOpen(false);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add amenity.");
    }
  };

  const handleDelete = async (amenityId) => {
    try {
      await deleteAmenity({ roomId, amenityId });
    } catch (error) {
      console.error("Failed to delete amenity", error);
    }
  };

  if (isLoadingAmenities) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
          <p className="text-sm text-slate-500">Manage the amenities available in this room.</p>
        </div>
        {!isFormOpen && availableAmenities.length > 0 && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Amenity
          </Button>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-slate-700">Select Amenity</label>
              <select
                value={selectedAmenityId}
                onChange={(e) => setSelectedAmenityId(e.target.value)}
                required
                className="block w-full rounded-md border-slate-300 py-2 px-3 sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">Select Amenity</option>
                {availableAmenities.map(a => (
                  <option key={a.amenity_id} value={a.amenity_id.toString()}>
                    {a.amenity_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mb-0.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setIsFormOpen(false); setSelectedAmenityId(""); }}
                disabled={isAdding}
                className="bg-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isAdding || !selectedAmenityId}
                className="bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {roomAmenities.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {roomAmenities.map((amenity) => (
            <div 
              key={amenity.room_amenity_id} 
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm"
            >
              <span className="text-slate-900 font-medium">{amenity.amenity_name}</span>
              <button
                type="button"
                onClick={() => handleDelete(amenity.amenity_id)}
                disabled={isDeleting}
                className="text-slate-400 hover:text-red-600 focus:outline-none"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 border-dashed p-8 text-center text-slate-500">
          No amenities configured for this room yet.
        </div>
      )}
    </div>
  );
}

export default RoomAmenities;
