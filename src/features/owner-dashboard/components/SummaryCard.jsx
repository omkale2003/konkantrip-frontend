export function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-emerald-50 text-emerald-600",
  subtext,
  subtextType = "default", // 'dots', 'trend', 'plain'
  activeCount,
  inactiveCount,
  trend,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-100 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-6 w-16 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center">
          <div className="h-3 w-28 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-xs transition hover:shadow-sm hover:border-slate-200">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgColor}`}
        >
          {Icon && <Icon className="h-6 w-6" strokeWidth={1.9} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 truncate">{title}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-50 text-xs">
        {subtextType === "dots" ? (
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {activeCount ?? 0} Active
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              {inactiveCount ?? 0} Inactive
            </span>
          </div>
        ) : subtextType === "trend" ? (
          <div className="flex items-center gap-1.5">
            {trend && (
              <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600">
                ↑ {trend}
              </span>
            )}
            <span className="text-slate-400">{subtext || "vs last 7 days"}</span>
          </div>
        ) : (
          <span className="font-medium text-emerald-600">{subtext}</span>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
