import { useState, useMemo } from "react";
import { ChevronDown, Receipt } from "lucide-react";

export function RevenueOverviewChart({
  totalRevenue = 0,
  trend = null,
  data = [], // [{ label: "8 Aug", value: 12000, date: "..." }, ...]
  isLoading = false,
}) {
  const [period, setPeriod] = useState("This Week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Generate dynamic 7-day window if data is empty
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;

    const result = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      result.push({ label, value: 0, date: d.toISOString() });
    }
    return result;
  }, [data]);

  const hasData = totalRevenue > 0 || chartData.some((d) => d.value > 0);

  // Chart dimensions & calculations
  const width = 440;
  const height = 150;
  const paddingLeft = 38;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.value), 0);
    if (max === 0) return 30000;
    return Math.ceil(max / 10000) * 10000;
  }, [chartData]);

  const formatRupees = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${Math.round(num / 1000)}K`;
    return `₹${num}`;
  };

  const yTicks = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];

  const barWidth = 14;
  const bars = useMemo(() => {
    if (chartData.length === 0) return [];
    return chartData.map((d, i) => {
      const slotWidth = innerWidth / chartData.length;
      const x = paddingLeft + i * slotWidth + (slotWidth - barWidth) / 2;
      const barHeight = (d.value / maxValue) * innerHeight;
      const y = paddingTop + innerHeight - barHeight;
      return { x, y, barHeight, ...d };
    });
  }, [chartData, innerWidth, innerHeight, maxValue, paddingLeft, paddingTop]);

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-6 shadow-xs transition hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Receipt className="h-4 w-4" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Revenue Overview</h2>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <span>{period}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-20 mt-1 w-32 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
              {["This Week", "This Month", "This Year"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setPeriod(opt);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                    period === opt
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Metric summary on the left */}
        <div className="lg:w-40 shrink-0">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {isLoading ? "..." : `₹${Number(totalRevenue || 0).toLocaleString("en-IN")}`}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">Total Revenue</p>

          {trend && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span>↑ {trend}</span>
              <span className="text-[10px] font-normal text-emerald-600">vs last 7 days</span>
            </div>
          )}
        </div>

        {/* Chart area on the right */}
        <div className="relative flex-1 min-w-0">
          {isLoading ? (
            <div className="h-40 w-full animate-pulse rounded-xl bg-slate-50 flex items-center justify-center text-xs text-slate-400">
              Loading revenue analytics...
            </div>
          ) : !hasData ? (
            <div className="flex h-40 w-full flex-col items-center justify-center rounded-xl bg-slate-50/50 p-4 text-center border border-dashed border-slate-200">
              <Receipt className="h-7 w-7 text-slate-300 mb-1.5" />
              <p className="text-xs font-semibold text-slate-600">No revenue data available.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Earnings and payment settlements will appear here.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-40 overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Y-axis grid lines and labels */}
                {yTicks.map((val, idx) => {
                  const y = paddingTop + innerHeight - (val / maxValue) * innerHeight;
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 3}
                        fontSize="10"
                        fill="#94a3b8"
                        textAnchor="end"
                        fontFamily="sans-serif"
                      >
                        {formatRupees(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Green Bars */}
                {bars.map((bar, i) => (
                  <g key={i}>
                    {/* Background hover capture area */}
                    <rect
                      x={bar.x - 6}
                      y={paddingTop}
                      width={barWidth + 12}
                      height={innerHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredBar(bar)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />

                    {/* Green Bar */}
                    <rect
                      x={bar.x}
                      y={bar.value > 0 ? bar.y : paddingTop + innerHeight - 2}
                      width={barWidth}
                      height={bar.value > 0 ? Math.max(bar.barHeight, 4) : 2}
                      rx="3"
                      ry="3"
                      fill={
                        hoveredBar?.date === bar.date
                          ? "#047857"
                          : bar.value > 0
                          ? "#059669"
                          : "#e2e8f0"
                      }
                      className="transition-colors duration-150 cursor-pointer pointer-events-none"
                    />

                    {/* X-axis date label */}
                    <text
                      x={bar.x + barWidth / 2}
                      y={height - 8}
                      fontSize="10"
                      fill="#94a3b8"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {bar.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredBar && (
                <div
                  className="absolute pointer-events-none rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${((hoveredBar.x + barWidth / 2) / width) * 100}%`,
                    top: `${(hoveredBar.y / height) * 100}%`,
                    marginTop: "-8px",
                  }}
                >
                  <p className="leading-tight">₹{hoveredBar.value.toLocaleString("en-IN")}</p>
                  <p className="text-[9px] font-normal text-slate-400">{hoveredBar.label}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevenueOverviewChart;
