import { useParams, useLocation } from "react-router-dom";
import RoomWizard from "../components/RoomWizard.jsx";

function EditRoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const propertyId = location.state?.propertyId;

  return (
    <RoomWizard 
      initialRoomId={roomId} 
      initialPropertyId={propertyId} 
      isEditMode={true} 
    />
  );
}

export default EditRoomPage;
