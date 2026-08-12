import { MessageSquare } from "lucide-react";

function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Reviews
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and respond to guest reviews.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <MessageSquare className="h-7 w-7" />
        </div>

        <div className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Coming Soon
        </div>

        <h3 className="mt-3 text-lg font-semibold text-slate-900">
          Guest Reviews
        </h3>

        <p className="mt-1.5 mx-auto max-w-md text-sm text-slate-500">
          Review management functionality will be developed next.
        </p>
      </div>
    </div>
  );
}

export default ReviewsPage;
