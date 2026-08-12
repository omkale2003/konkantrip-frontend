const steps = [
  {
    number: 1,
    title: "Basic Details",
    description: "Property information",
  },
  {
    number: 2,
    title: "Location",
    description: "Property location",
  },
  {
    number: 3,
    title: "Contact",
    description: "Contact details",
  },
  {
    number: 4,
    title: "Amenities",
    description: "Property amenities",
  },
  {
    number: 5,
    title: "Photos",
    description: "Property photos",
  },
  {
    number: 6,
    title: "Policies",
    description: "Property policies",
  },
  {
    number: 7,
    title: "Documents",
    description: "Required documents",
  },
  {
    number: 8,
    title: "Review",
    description: "Review & submit",
  },
];

function WizardProgress({ currentStep = 1 }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[900px] items-start">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="flex flex-1 items-start"
            >
              {/* Step */}
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition",
                    isCompleted
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : isCurrent
                        ? "border-emerald-700 bg-white text-emerald-700"
                        : "border-slate-300 bg-white text-slate-400",
                  ].join(" ")}
                >
                  {isCompleted
                    ? "✓"
                    : String(step.number).padStart(2, "0")}
                </div>

                <div className="mt-2 text-center">
                  <p
                    className={[
                      "whitespace-nowrap text-xs font-semibold",
                      isCompleted || isCurrent
                        ? "text-emerald-700"
                        : "text-slate-400",
                    ].join(" ")}
                  >
                    {step.title}
                  </p>

                  <p className="mt-0.5 whitespace-nowrap text-[11px] text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={[
                    "mt-4 h-0.5 flex-1 transition",
                    currentStep > step.number
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
  );
}

export default WizardProgress;