import { CalendarDays } from "lucide-react";

function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage guest bookings.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CalendarDays className="h-7 w-7" />
        </div>

        <div className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Coming Soon
        </div>

        <h3 className="mt-3 text-lg font-semibold text-slate-900">
          Booking Management
        </h3>

        <p className="mt-1.5 mx-auto max-w-md text-sm text-slate-500">
          Booking management functionality will be developed next.
        </p>
      </div>
    </div>
  );
}

export default BookingsPage;
