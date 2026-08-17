import { useLocation } from "react-router-dom";
import RoomWizard from "../components/RoomWizard.jsx";

function AddRoomPage() {
  const location = useLocation();
  const propertyId = location.state?.propertyId;

  return (
    <RoomWizard 
      initialPropertyId={propertyId} 
      isEditMode={false} 
    />
  );
}

export default AddRoomPage;
