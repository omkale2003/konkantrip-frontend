import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight, User } from "lucide-react";
import { ROUTES } from "../../../constants/routes.js";

function getStatusBadge(status) {
  const norm = String(status || "").toLowerCase();
  if (norm.includes("confirm") || norm === "approved" || norm === "active") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (norm.includes("pend") || norm.includes("review") || norm === "in transit") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }
  if (norm.includes("cancel") || norm.includes("reject")) {
    return "bg-red-50 text-red-700 border-red-100";
  }
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export function RecentBookingsTable({ bookings = [], isLoading = false }) {
  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-6 shadow-xs transition hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Bookings</h2>
        </div>

        <Link
          to={ROUTES.OWNER_BOOKINGS}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
        >
          <span>View All</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="mt-4 overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between py-2 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100" />
                  <div className="h-3.5 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-3.5 w-28 bg-slate-100 rounded" />
                <div className="h-3.5 w-16 bg-slate-100 rounded" />
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-2">
              <CalendarDays className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              No bookings found for this period.
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 max-w-xs">
              When guests book your properties or rooms, their reservation details will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="pb-3 font-semibold">Guest</th>
                <th className="pb-3 font-semibold">Property</th>
                <th className="pb-3 font-semibold">Check-in</th>
                <th className="pb-3 font-semibold">Check-out</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {bookings.slice(0, 5).map((booking, idx) => {
                const guestName =
                  booking.guest_name ||
                  booking.customer_name ||
                  booking.user_name ||
                  `Guest #${booking.booking_id || idx + 1}`;
                const propertyName =
                  booking.property_name ||
                  booking.room_name ||
                  "Standard Room";
                const checkIn = booking.check_in_date || booking.start_date || "-";
                const checkOut = booking.check_out_date || booking.end_date || "-";
                const amount = booking.total_amount || booking.daily_price || 0;
                const status = booking.status || booking.booking_status || "Confirmed";

                return (
                  <tr key={booking.booking_id || idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                          {guestName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 truncate max-w-[110px]">
                          {guestName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-slate-600 truncate max-w-[120px]">
                      {propertyName}
                    </td>

                    <td className="py-3.5 px-2 text-slate-500 whitespace-nowrap">
                      {checkIn}
                    </td>

                    <td className="py-3.5 px-2 text-slate-500 whitespace-nowrap">
                      {checkOut}
                    </td>

                    <td className="py-3.5 px-2 font-semibold text-slate-900 whitespace-nowrap">
                      ₹{Number(amount).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 pl-2 text-right">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RecentBookingsTable;
