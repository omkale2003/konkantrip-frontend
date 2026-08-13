import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Hotel, Loader2 } from "lucide-react";

import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { useRooms } from "../hooks/useRooms.js";
import RoomList from "../components/rooms/RoomList.jsx";
import Button from "../../../components/ui/Button/Button.jsx";

function RoomsPage() {
  const owner = storageService.getOwner();
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const { data: propertiesData, isLoading: isLoadingProperties } = useProperties({
    owner_id: owner?.p_owner_id,
    limit: 100, // Fetch all for dropdown
  });
  
  const properties = propertiesData?.data || [];
  
  // Use derived state for active property ID instead of setting state in effect
  const activePropertyId = selectedPropertyId || (properties.length > 0 ? properties[0].property_id.toString() : "");

  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useRooms({ property_id: activePropertyId });
  
  const rooms = roomsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Rooms
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your rooms, bed configurations, and amenities.
          </p>
        </div>

        {properties.length > 0 && (
          <div className="flex items-center gap-3">
            <label htmlFor="property-select" className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Active Property:
            </label>
            <div className="relative">
              <select
                id="property-select"
                className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                value={activePropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
              >
                {properties.map((property) => (
                  <option key={property.property_id} value={property.property_id.toString()}>
                    {property.property_name}
                  </option>
                ))}
              </select>
            </div>
            
            <Link to="/owner/rooms/add" state={{ propertyId: activePropertyId }}>
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </Link>
          </div>
        )}
      </div>

      {isLoadingProperties ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Hotel className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No Properties Found</h3>
          <p className="mt-2 text-sm text-slate-500">
            You must add a property before managing rooms.
          </p>
          <div className="mt-6">
            <Link to="/owner/properties/add">
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <RoomList 
          rooms={rooms} 
          isLoading={isLoadingRooms} 
          isError={isRoomsError} 
          propertyId={activePropertyId} 
        />
      )}
    </div>
  );
}

export default RoomsPage;
