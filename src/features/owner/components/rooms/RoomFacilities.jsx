import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import Button from "../../../../components/ui/Button/Button.jsx";
import { 
  useRoomFacilities, 
  useAddRoomFacility, 
  useDeleteRoomFacility, 
  useRoomLookups 
} from "../../hooks/useRooms.js";

function RoomFacilities({ roomId }) {
  const { data: facilitiesData, isLoading: isLoadingFacilities } = useRoomFacilities(roomId);
  const { data: allFacilitiesData } = useRoomLookups("facilities");
  
  const { mutateAsync: addFacility, isPending: isAdding } = useAddRoomFacility();
  const { mutateAsync: deleteFacility, isPending: isDeleting } = useDeleteRoomFacility();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const roomFacilities = facilitiesData?.data || [];
  const allFacilities = allFacilitiesData?.data || [];
  
  // Filter out facilities that are already added
  const availableFacilities = allFacilities.filter(
    (f) => !roomFacilities.some((rf) => rf.room_facility_id === f.room_facility_id)
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedFacilityId) return;

    try {
      setErrorMsg("");
      await addFacility({ roomId, facilityId: selectedFacilityId });
      setSelectedFacilityId("");
      setIsFormOpen(false);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add facility.");
    }
  };

  const handleDelete = async (facilityId) => {
    try {
      await deleteFacility({ roomId, facilityId });
    } catch (error) {
      console.error("Failed to delete facility", error);
    }
  };

  if (isLoadingFacilities) {
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
          <h2 className="text-lg font-semibold text-slate-900">Facilities</h2>
          <p className="text-sm text-slate-500">Manage the facilities available in this room.</p>
        </div>
        {!isFormOpen && availableFacilities.length > 0 && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Facility
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
              <label className="text-xs font-medium text-slate-700">Select Facility</label>
              <select
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                required
                className="block w-full rounded-md border-slate-300 py-2 px-3 sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">Select Facility</option>
                {availableFacilities.map(f => (
                  <option key={f.room_facility_id} value={f.room_facility_id.toString()}>
                    {f.facility_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mb-0.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setIsFormOpen(false); setSelectedFacilityId(""); }}
                disabled={isAdding}
                className="bg-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isAdding || !selectedFacilityId}
                className="bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {roomFacilities.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {roomFacilities.map((facility) => (
            <div 
              key={facility.room_facility_mapping_id || facility.room_facility_id} 
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm"
            >
              <span className="text-slate-900 font-medium">{facility.facility_name}</span>
              <button
                type="button"
                onClick={() => handleDelete(facility.room_facility_id)}
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
          No facilities configured for this room yet.
        </div>
      )}
    </div>
  );
}

export default RoomFacilities;
