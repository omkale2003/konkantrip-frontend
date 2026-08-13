import { Check } from "lucide-react";

const WIZARD_STEPS = [
  {
    number: 1,
    label: "Basic Details",
  },
  {
    number: 2,
    label: "Location",
  },
  {
    number: 3,
    label: "Amenities",
  },
  {
    number: 4,
    label: "Photos",
  },
  {
    number: 5,
    label: "Contact",
  },
  {
    number: 6,
    label: "Policies",
  },
  {
    number: 7,
    label: "Documents",
  },
  {
    number: 8,
    label: "Review",
  },
];

function WizardProgress({ currentStep = 1 }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px] px-2 py-2">
        <div className="flex items-start">
          {WIZARD_STEPS.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            const isLastStep =
              index === WIZARD_STEPS.length - 1;

            return (
              <div
                key={step.number}
                className="flex flex-1 items-start"
              >
                {/* Step */}
                <div className="flex min-w-0 flex-col items-center">
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                      isCompleted
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "",
                      isCurrent
                        ? "border-emerald-700 bg-white text-emerald-700 ring-4 ring-emerald-50"
                        : "",
                      !isCompleted && !isCurrent
                        ? "border-slate-300 bg-white text-slate-400"
                        : "",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      step.number
                    )}
                  </div>

                  <p
                    className={[
                      "mt-2 whitespace-nowrap text-xs font-medium",
                      isCompleted || isCurrent
                        ? "text-emerald-700"
                        : "text-slate-400",
                    ].join(" ")}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connecting Line */}
                {!isLastStep && (
                  <div
                    className={[
                      "mt-[18px] h-0.5 min-w-6 flex-1 transition-colors",
                      step.number < currentStep
                        ? "bg-emerald-700"
                        : "bg-slate-200",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WizardProgress;