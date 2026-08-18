import { Check, Lightbulb, Save } from "lucide-react";
import { WIZARD_STEPS } from "./RoomStepHeader.jsx";

function RoomSidebarProgress({ activeStep, maxCompletedStep = 0, roomId, onStepClick, onSaveDraft, isDraftSaving }) {
  return (
    <div className="space-y-6">
      {/* Setup Progress Timeline Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 mb-4">
          Room Setup Progress
        </h3>

        <div className="relative space-y-6 before:absolute before:left-3.5 before:top-3.5 before:h-[calc(100%-28px)] before:w-0.5 before:bg-slate-100">
          {WIZARD_STEPS.map((step) => {
            const isCompleted = step.id <= maxCompletedStep;
            const isActive = step.id === activeStep;
            const isClickable = step.id === 1 || (Boolean(roomId) && (step.id <= maxCompletedStep + 1 || isCompleted));

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                className={`relative flex items-start gap-3 w-full text-left transition-all ${
                  isClickable ? "hover:opacity-80 cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    step.id
                  )}
                </div>

                <div className="flex flex-col pt-0.5">
                  <span
                    className={`text-xs font-bold ${
                      isActive
                        ? "text-emerald-700"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {isCompleted
                      ? "Completed"
                      : isActive
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Need Help Card */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Need Help?</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              You can save as draft and complete room setup later.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isDraftSaving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5 text-slate-500" />
          {isDraftSaving ? "Saving Draft..." : "Save Draft"}
        </button>
      </div>
    </div>
  );
}

export default RoomSidebarProgress;
