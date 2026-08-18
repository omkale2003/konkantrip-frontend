import { useState, useMemo } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

export function BookingsOverviewChart({
  totalBookings = 0,
  trend = null,
  data = [], // [{ label: "8 Aug", value: 5, date: "2025-08-08" }, ...]
  isLoading = false,
}) {
  const [period, setPeriod] = useState("This Week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Generate dynamic date labels if data is not provided or empty
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;

    // Default 7 days window (last 7 days)
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

  const hasData = totalBookings > 0 || chartData.some((d) => d.value > 0);

  // Chart dimensions & calculations
  const width = 440;
  const height = 150;
  const paddingLeft = 30;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.value), 0);
    if (max === 0) return 30;
    return Math.ceil(max / 10) * 10;
  }, [chartData]);

  const yTicks = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];

  const points = useMemo(() => {
    if (chartData.length === 0) return [];
    return chartData.map((d, i) => {
      const x = paddingLeft + (i / Math.max(chartData.length - 1, 1)) * innerWidth;
      const y = paddingTop + innerHeight - (d.value / maxValue) * innerHeight;
      return { x, y, ...d };
    });
  }, [chartData, innerWidth, innerHeight, maxValue, paddingLeft, paddingTop]);

  // Smooth bezier curve path
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPath: "" };
    if (points.length === 1) {
      return {
        linePath: `M ${points[0].x} ${points[0].y}`,
        areaPath: `M ${points[0].x} ${points[0].y} L ${points[0].x} ${paddingTop + innerHeight} Z`,
      };
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    const area = `${d} L ${last.x} ${paddingTop + innerHeight} L ${first.x} ${paddingTop + innerHeight} Z`;

    return { linePath: d, areaPath: area };
  }, [points, innerHeight, paddingTop]);

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-6 shadow-xs transition hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CalendarDays className="h-4 w-4" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Bookings Overview</h2>
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
            {isLoading ? "..." : totalBookings}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">Total Bookings</p>

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
              Loading booking analytics...
            </div>
          ) : !hasData ? (
            <div className="flex h-40 w-full flex-col items-center justify-center rounded-xl bg-slate-50/50 p-4 text-center border border-dashed border-slate-200">
              <CalendarDays className="h-7 w-7 text-slate-300 mb-1.5" />
              <p className="text-xs font-semibold text-slate-600">No bookings found for this period.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Booking trends will appear as reservations are placed.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-40 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="bookingsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

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
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Area under curve */}
                {areaPath && (
                  <path d={areaPath} fill="url(#bookingsAreaGradient)" />
                )}

                {/* Smooth green curve line */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint?.date === pt.date ? "5.5" : "4"}
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}

                {/* X-axis date labels */}
                {points.map((pt, i) => (
                  <text
                    key={i}
                    x={pt.x}
                    y={height - 8}
                    fontSize="10"
                    fill="#94a3b8"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {pt.label}
                  </text>
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute pointer-events-none rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-md -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: `${(hoveredPoint.y / height) * 100}%`,
                    marginTop: "-8px",
                  }}
                >
                  <p className="leading-tight">{hoveredPoint.value} bookings</p>
                  <p className="text-[9px] font-normal text-slate-400">{hoveredPoint.label}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingsOverviewChart;
