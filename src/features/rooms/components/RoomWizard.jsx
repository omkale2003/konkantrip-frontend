import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Save, ArrowLeft, Loader2 } from "lucide-react";
import RoomStepHeader, { WIZARD_STEPS } from "./RoomStepHeader.jsx";
import RoomSidebarProgress from "./RoomSidebarProgress.jsx";

import RoomBasicDetailsStep from "./steps/RoomBasicDetailsStep.jsx";
import RoomCapacityStep from "./steps/RoomCapacityStep.jsx";
import RoomBedsStep from "./steps/RoomBedsStep.jsx";
import RoomAmenitiesStep from "./steps/RoomAmenitiesStep.jsx";
import RoomFacilitiesStep from "./steps/RoomFacilitiesStep.jsx";
import RoomImagesStep from "./steps/RoomImagesStep.jsx";

import { useRoom, useCreateRoom, useUpdateRoom } from "../hooks/useRooms.js";
import { ROUTES } from "../../../constants/routes.js";

function RoomWizard({ initialRoomId, initialPropertyId, isEditMode = false }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(isEditMode || initialRoomId ? 6 : 0);
  const [roomId, setRoomId] = useState(initialRoomId || null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: roomDetailsData, isLoading: isLoadingRoom } = useRoom(roomId);
  const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();

  const room = roomDetailsData?.data;

  useEffect(() => {
    if (initialRoomId) {
      setRoomId(initialRoomId);
      setMaxCompletedStep(6);
    }
  }, [initialRoomId]);

  // Handle Step 1 Save / Create
  const handleBasicDetailsSubmit = async (formData) => {
    try {
      setErrorMsg("");
      if (!roomId) {
        // Create new room in backend DB
        const response = await createRoom({
          ...formData,
          property_id: formData.property_id || initialPropertyId,
        });
        const newRoomId = response.data.room_id;
        setRoomId(newRoomId);
        setMaxCompletedStep((prev) => Math.max(prev, 1));
        // Seamlessly update browser URL without page reload
        window.history.replaceState({}, "", `/owner/rooms/${newRoomId}/edit`);
        setActiveStep(2);
      } else {
        // Update existing room in backend DB
        await updateRoom({
          roomId,
          data: formData,
        });
        setMaxCompletedStep((prev) => Math.max(prev, 1));
        setActiveStep(2);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save room basic details.");
    }
  };

  // Handle Step 2 Save / Update Capacity
  const handleCapacitySubmit = async (formData) => {
    if (!roomId) return;
    try {
      setErrorMsg("");
      await updateRoom({
        roomId,
        data: formData,
      });
      setMaxCompletedStep((prev) => Math.max(prev, 2));
      setActiveStep(3);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save capacity & configuration.");
    }
  };

  // Generic Step Advance (for Steps 3, 4, 5, 6 sub-resource steps)
  const handleStepAdvance = (currentStepNum) => {
    setMaxCompletedStep((prev) => Math.max(prev, currentStepNum));
    if (currentStepNum < 6) {
      setActiveStep(currentStepNum + 1);
    } else {
      // Completed all steps
      navigate(ROUTES.OWNER_ROOMS);
    }
  };

  // Global Save Draft Handler
  const handleSaveDraft = async () => {
    // Submit current step form programmatically if possible, or notify user
    const stepForm = document.getElementById("room-step-form");
    if (stepForm) {
      stepForm.requestSubmit();
    } else {
      navigate(ROUTES.OWNER_ROOMS);
    }
  };

  // Trigger form submit for current step when clicking "Save & Continue"
  const handleNextClick = () => {
    const stepForm = document.getElementById("room-step-form");
    if (stepForm) {
      stepForm.requestSubmit();
    } else {
      handleStepAdvance(activeStep);
    }
  };

  const handleBackClick = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      navigate(ROUTES.OWNER_ROOMS);
    }
  };

  if (isLoadingRoom && roomId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.OWNER_ROOMS}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all shrink-0"
            title="Back to Rooms"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
              <Link to={ROUTES.OWNER_ROOMS} className="hover:text-emerald-700">
                Rooms
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-900">{roomId ? "Edit Room" : "Add Room"}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {roomId ? "Edit Room" : "Add Room"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a room for your property
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={ROUTES.OWNER_ROOMS}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
            Back to Rooms
          </Link>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5 text-slate-500" />
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-800 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save & Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* Top 6-Step Stepper Header Bar */}
      <RoomStepHeader
        activeStep={activeStep}
        maxCompletedStep={maxCompletedStep}
        roomId={roomId}
        onStepClick={(stepId) => setActiveStep(stepId)}
      />

      {/* Main Grid: Left Step Form (75%) + Right Sidebar (25%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form Content Card */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[420px]">
            {activeStep === 1 && (
              <RoomBasicDetailsStep
                defaultValues={room}
                initialPropertyId={initialPropertyId}
                onSubmit={handleBasicDetailsSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {activeStep === 2 && (
              <RoomCapacityStep
                defaultValues={room}
                onSubmit={handleCapacitySubmit}
              />
            )}

            {activeStep === 3 && (
              <RoomBedsStep
                roomId={roomId}
                onSubmitNext={() => handleStepAdvance(3)}
              />
            )}

            {activeStep === 4 && (
              <RoomAmenitiesStep
                roomId={roomId}
                onSubmitNext={() => handleStepAdvance(4)}
              />
            )}

            {activeStep === 5 && (
              <RoomFacilitiesStep
                roomId={roomId}
                onSubmitNext={() => handleStepAdvance(5)}
              />
            )}

            {activeStep === 6 && (
              <RoomImagesStep
                roomId={roomId}
                onSubmitNext={() => handleStepAdvance(6)}
              />
            )}
          </div>

          {/* Bottom Action Navigation Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleNextClick}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="lg:col-span-4 xl:col-span-3">
          <RoomSidebarProgress
            activeStep={activeStep}
            maxCompletedStep={maxCompletedStep}
            roomId={roomId}
            onStepClick={(stepId) => setActiveStep(stepId)}
            onSaveDraft={handleSaveDraft}
            isDraftSaving={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default RoomWizard;
