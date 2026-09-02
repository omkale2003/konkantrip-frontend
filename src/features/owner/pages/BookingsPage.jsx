import { useState, useMemo } from "react";
import {
  CalendarDays,
  Search,
  Filter,
  User,
  Building2,
  Phone,
  Mail,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  MessageSquare,
  ShieldCheck,
  Calendar,
  BedDouble,
  FileText,
} from "lucide-react";

// Mock rich initial OTA bookings for demonstration & owner management
const initialMockBookings = [
  {
    booking_id: 1,
    booking_uuid: "b101-789a-4cde-b231-102938475612",
    booking_number: "KT-20260901-A1B2",
    property_name: "Blue Ocean Sea View Resort",
    room_name: "Deluxe Ocean Front Villa",
    guest_name: "Aarav Sharma",
    guest_mobile: "+919876543210",
    guest_email: "aarav.sharma@example.com",
    check_in_date: "2026-09-05",
    check_out_date: "2026-09-08",
    total_nights: 3,
    total_guests: 2,
    adults: 2,
    children: 0,
    total_room_price: 10500,
    final_amount: 10500,
    booking_status: "CONFIRMED",
    payment_status: "Paid_At_Property",
    special_requests: "High-floor room with beach view preferred.",
    created_at: "2026-08-31T09:15:00Z",
    property_contact: {
      contact_name: "Ganesh Patil",
      contact_phone: "+919822334455",
      contact_role: "Front Desk Manager"
    }
  },
  {
    booking_id: 2,
    booking_uuid: "b102-456b-8cde-a123-998877665544",
    booking_number: "KT-20260902-C3D4",
    property_name: "Konkan Heritage Homestay",
    room_name: "Traditional Courtyard Room",
    guest_name: "Sneha Kulkarni",
    guest_mobile: "+919820556677",
    guest_email: "sneha.k@example.com",
    check_in_date: "2026-09-06",
    check_out_date: "2026-09-07",
    total_nights: 1,
    total_guests: 3,
    adults: 2,
    children: 1,
    total_room_price: 3200,
    final_amount: 3200,
    booking_status: "CONFIRMED",
    payment_status: "Paid_At_Property",
    special_requests: "Early check-in around 11:30 AM requested.",
    created_at: "2026-08-30T15:20:00Z",
    property_contact: {
      contact_name: "Suresh Kadam",
      contact_phone: "+919869112233",
      contact_role: "Reservation Desk"
    }
  },
  {
    booking_id: 3,
    booking_uuid: "b103-123c-9ef0-b456-112233445566",
    booking_number: "KT-20260903-E5F6",
    property_name: "Devbagh Beach Shack & Villa",
    room_name: "Beachfront Wooden Cottage",
    guest_name: "Prasad Deshpande",
    guest_mobile: "+919811223344",
    guest_email: "prasad.d@example.com",
    check_in_date: "2026-09-10",
    check_out_date: "2026-09-13",
    total_nights: 3,
    total_guests: 4,
    adults: 4,
    children: 0,
    total_room_price: 14400,
    final_amount: 14400,
    booking_status: "CONFIRMED",
    payment_status: "Paid_At_Property",
    special_requests: "Need water sports coordination details on arrival.",
    created_at: "2026-08-29T18:40:00Z",
    property_contact: {
      contact_name: "Mahesh Tandel",
      contact_phone: "+919823445566",
      contact_role: "Property Manager"
    }
  },
  {
    booking_id: 4,
    booking_uuid: "b104-987d-1ab2-c789-556677889900",
    booking_number: "KT-20260904-G7H8",
    property_name: "Blue Ocean Sea View Resort",
    room_name: "Standard Suite",
    guest_name: "Rohan Varma",
    guest_mobile: "+919765001122",
    guest_email: "rohan.v@example.com",
    check_in_date: "2026-08-25",
    check_out_date: "2026-08-27",
    total_nights: 2,
    total_guests: 2,
    adults: 2,
    children: 0,
    total_room_price: 6800,
    final_amount: 6800,
    booking_status: "COMPLETED",
    payment_status: "Paid",
    special_requests: null,
    created_at: "2026-08-24T12:10:00Z",
    property_contact: {
      contact_name: "Ganesh Patil",
      contact_phone: "+919822334455",
      contact_role: "Front Desk Manager"
    }
  },
  {
    booking_id: 5,
    booking_uuid: "b105-654e-3cd4-d012-990011223344",
    booking_number: "KT-20260905-I9J0",
    property_name: "Konkan Heritage Homestay",
    room_name: "Deluxe Family Suite",
    guest_name: "Aditi Joshi",
    guest_mobile: "+919890123456",
    guest_email: "aditi.j@example.com",
    check_in_date: "2026-09-02",
    check_out_date: "2026-09-04",
    total_nights: 2,
    total_guests: 4,
    adults: 3,
    children: 1,
    total_room_price: 7600,
    final_amount: 7600,
    booking_status: "CANCELLED",
    payment_status: "Refunded",
    special_requests: "Cancelled due to personal emergency. Inventory released.",
    created_at: "2026-08-26T16:00:00Z",
    property_contact: {
      contact_name: "Suresh Kadam",
      contact_phone: "+919869112233",
      contact_role: "Reservation Desk"
    }
  }
];

function getStatusBadge(status) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "COMPLETED":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "REQUESTED":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    case "NO_SHOW":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function BookingsPage() {
  const [bookings, setBookings] = useState(initialMockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "All" || b.booking_status === statusFilter;
      const matchesSearch =
        b.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.guest_mobile.includes(searchTerm) ||
        b.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.room_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.booking_status === "CONFIRMED").length;
    const completed = bookings.filter((b) => b.booking_status === "COMPLETED").length;
    const revenue = bookings
      .filter((b) => b.booking_status !== "CANCELLED")
      .reduce((acc, b) => acc + (Number(b.final_amount) || 0), 0);
    return { total, confirmed, completed, revenue };
  }, [bookings]);

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.booking_id === bookingId ? { ...b, booking_status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.booking_id === bookingId) {
      setSelectedBooking((prev) => ({ ...prev, booking_status: newStatus }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            OTA Bookings & Reservations
          </h1>
          <p className="text-sm text-slate-500">
            Real-time reservations with OTP customer verification and automated WhatsApp delivery.
          </p>
        </div>

        <button
          onClick={() => setBookings(initialMockBookings)}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Reservations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{stats.total}</div>
          <p className="mt-0.5 text-xs text-slate-400">All-time OTA bookings</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Active / Confirmed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-900">{stats.confirmed}</div>
          <p className="mt-0.5 text-xs text-emerald-600 font-medium">Upcoming stays</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              Completed Stays
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-sky-900">{stats.completed}</div>
          <p className="mt-0.5 text-xs text-sky-600 font-medium">Checked out successfully</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Total Booking Value
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-900">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </div>
          <p className="mt-0.5 text-xs text-amber-600 font-medium">Gross confirmed revenue</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Booking #, guest name, phone, property or room..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "CONFIRMED", "COMPLETED", "REQUESTED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === status
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">No Reservations Found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search keywords or status filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Booking Info</th>
                  <th className="py-3.5 px-3">Guest Details</th>
                  <th className="py-3.5 px-3">Property & Room</th>
                  <th className="py-3.5 px-3">Stay Dates</th>
                  <th className="py-3.5 px-3">Total Amount</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBookings.map((b) => (
                  <tr key={b.booking_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {b.booking_number}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(b.created_at).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                          {b.guest_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{b.guest_name}</span>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" title="OTP Verified" />
                          </div>
                          <p className="text-[11px] text-slate-500">{b.guest_mobile}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-semibold text-slate-800">{b.property_name}</div>
                      <p className="text-[11px] text-slate-500">{b.room_name}</p>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {b.check_in_date} → {b.check_out_date}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {b.total_nights} Nights • {b.total_guests} Guests
                      </p>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        ₹{Number(b.final_amount).toLocaleString("en-IN")}
                      </div>
                      <p className="text-[10px] text-slate-400">{b.payment_status.replace(/_/g, " ")}</p>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                          b.booking_status
                        )}`}
                      >
                        {b.booking_status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal / Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedBooking.booking_number}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">Reservation Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Guest & Stay Summary */}
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-xs border border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Guest Name</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedBooking.guest_name}</p>
                <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {selectedBooking.guest_mobile}
                </p>
                {selectedBooking.guest_email && (
                  <p className="text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {selectedBooking.guest_email}
                  </p>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Stay Dates</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {selectedBooking.check_in_date} to {selectedBooking.check_out_date}
                </p>
                <p className="text-slate-600 mt-1">
                  {selectedBooking.total_nights} Nights • {selectedBooking.total_guests} Guests
                </p>
                <p className="font-bold text-emerald-700 mt-1 text-sm">
                  Total: ₹{Number(selectedBooking.final_amount).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Property & Front Desk Delivery Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Property Front Desk Dispatch</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="h-3 w-3" /> WhatsApp Delivered
                </span>
              </div>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800">Assigned Contact: </span>
                {selectedBooking.property_contact.contact_name} ({selectedBooking.property_contact.contact_role}) -{" "}
                {selectedBooking.property_contact.contact_phone}
              </p>
              {selectedBooking.special_requests && (
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">Special Requests: </span>
                  "{selectedBooking.special_requests}"
                </p>
              )}
            </div>

            {/* Status Change Actions */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Update Booking Status
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedBooking.booking_id, st)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      selectedBooking.booking_status === st
                        ? "bg-slate-900 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Communication Shortcuts */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <a
                href={`https://wa.me/${selectedBooking.guest_mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello ${selectedBooking.guest_name}! Regarding your booking ${selectedBooking.booking_number} at ${selectedBooking.property_name}...`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Message Guest on WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedBooking.guest_mobile}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span>Call</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
