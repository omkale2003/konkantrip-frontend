export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-xl bg-slate-200" />
          <div className="h-4 w-80 rounded-lg bg-slate-100" />
        </div>
        <div className="h-9 w-44 rounded-xl bg-slate-200" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-24 rounded bg-slate-100" />
                <div className="h-7 w-16 rounded bg-slate-200" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50">
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="h-5 w-36 rounded bg-slate-200" />
              <div className="h-7 w-24 rounded-xl bg-slate-100" />
            </div>
            <div className="mt-5 flex flex-col gap-6 lg:flex-row">
              <div className="space-y-2 lg:w-36">
                <div className="h-8 w-20 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
              <div className="h-40 flex-1 rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded bg-slate-100" />
            </div>
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4].map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-100" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-24 rounded bg-slate-200" />
                      <div className="h-2.5 w-16 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-3.5 w-16 rounded bg-slate-100" />
                  <div className="h-5 w-16 rounded-md bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-8 w-28 rounded-xl bg-slate-100" />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-slate-100 border border-slate-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
