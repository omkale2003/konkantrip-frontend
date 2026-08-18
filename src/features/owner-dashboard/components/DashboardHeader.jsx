import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

function formatCurrentWeekRange() {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  start.setDate(now.getDate() - 6);

  const formatShort = (d) => {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const year = end.getFullYear();
  return `${formatShort(start)} – ${formatShort(end)}, ${year}`;
}

export function DashboardHeader({ ownerName, onDateRangeChange }) {
  const [selectedRange, setSelectedRange] = useState("This Week");
  const [isOpen, setIsOpen] = useState(false);
  const dateRangeLabel = formatCurrentWeekRange();

  const handleSelect = (range) => {
    setSelectedRange(range);
    setIsOpen(false);
    if (onDateRangeChange) onDateRangeChange(range);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {ownerName || "Owner"}! 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Date Range Selector matching reference */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition"
        >
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>{selectedRange === "This Week" ? dateRangeLabel : selectedRange}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-30 mt-1.5 w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
            {["This Week", "This Month", "Last 30 Days", "This Year"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                  selectedRange === opt
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
