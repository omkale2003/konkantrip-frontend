import { Check } from "lucide-react";

export const WIZARD_STEPS = [
  { id: 1, key: "basic", label: "Basic Details" },
  { id: 2, key: "capacity", label: "Capacity & Configuration" },
  { id: 3, key: "beds", label: "Beds" },
  { id: 4, key: "amenities", label: "Amenities" },
  { id: 5, key: "facilities", label: "Facilities" },
  { id: 6, key: "images", label: "Images" },
];

function RoomStepHeader({ activeStep, maxCompletedStep = 0, roomId, onStepClick }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px]">
        {WIZARD_STEPS.map((step, idx) => {
          const isCompleted = step.id <= maxCompletedStep;
          const isActive = step.id === activeStep;
          const isClickable = step.id === 1 || (Boolean(roomId) && (step.id <= maxCompletedStep + 1 || isCompleted));

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
                    : isCompleted
                    ? "text-slate-700 hover:text-emerald-700 cursor-pointer"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="whitespace-nowrap">{step.label}</span>
              </button>

              {idx < WIZARD_STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 bg-slate-100 min-w-[12px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomStepHeader;
