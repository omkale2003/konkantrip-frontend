import { useNavigate } from "react-router-dom";
import { usePropertyCompletion } from "../hooks/usePropertyCompletion.js";
import { ChevronRight } from "lucide-react";

export function PropertyCompletionIndicator({ property, variant = "default" }) {
  const navigate = useNavigate();
  const { completionData, isLoading, isError } = usePropertyCompletion(property);

  const isCompact = variant === "compact";

  if (isLoading) {
    return (
      <div className={isCompact ? "mt-2 animate-pulse" : "mt-4 animate-pulse rounded-lg border border-slate-100 bg-slate-50 p-4"}>
        <div className="mb-2 h-4 w-1/3 rounded bg-slate-200"></div>
        <div className="h-2 w-full rounded bg-slate-200"></div>
      </div>
    );
  }

  if (isError || !completionData) {
    return null; // Fail gracefully
  }

  const { percentage, nextIncompleteSection } = completionData;

  const handleCompleteAction = () => {
    if (!nextIncompleteSection) return;

    if (nextIncompleteSection.route) {
      // It's a non-wizard route (like Rooms)
      navigate(nextIncompleteSection.route);
    } else if (nextIncompleteSection.wizardStep) {
      // Resume the draft using localStorage
      try {
        localStorage.setItem(
          "konkantrip_property_draft",
          JSON.stringify({
            propertyId: property.property_id,
            currentStep: nextIncompleteSection.wizardStep,
          })
        );
        navigate("/owner/properties/add?resume=true");
      } catch (err) {
        console.error("Failed to set draft in localStorage", err);
      }
    }
  };

  if (isCompact) {
    return (
      <div className="w-full max-w-[240px]">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-600">Completion</p>
          <span className="text-xs font-bold text-slate-900">{percentage}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {percentage < 100 ? (
          <button
            type="button"
            onClick={handleCompleteAction}
            className="mt-2 text-[11px] font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Finish {nextIncompleteSection?.name} &rarr;
          </button>
        ) : (
          <p className="mt-2 text-[11px] font-medium text-emerald-600">
            ✓ Profile 100% complete
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Listing Completion</p>
        <span className="text-sm font-bold text-slate-900">{percentage}%</span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-emerald-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage < 100 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Next up: <span className="font-semibold text-slate-700">{nextIncompleteSection?.name}</span>
          </p>
          <button
            type="button"
            onClick={handleCompleteAction}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            Complete Your Property
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <p className="text-xs font-medium text-emerald-700">
          ✓ Your property profile is 100% complete.
        </p>
      )}
    </div>
  );
}
