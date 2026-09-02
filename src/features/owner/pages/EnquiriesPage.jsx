import { useState, useMemo } from "react";
import {
  MessageCircleQuestion,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Building2,
  ExternalLink,
  ChevronRight,
  Send,
  AlertCircle,
  Plus,
  RefreshCw,
} from "lucide-react";

// Mock initial enquiries data for demo & owner interaction
const initialMockEnquiries = [
  {
    enquiry_id: 1,
    guest_name: "Rahul Sawant",
    guest_mobile: "+919820123456",
    guest_email: "rahul.sawant@example.com",
    property_name: "Blue Ocean Sea View Resort",
    room_name: "Deluxe Ocean Front Villa",
    check_in_date: "2026-09-15",
    check_out_date: "2026-09-18",
    guests_count: 4,
    message: "Hi, we are planning a family trip for 4 adults and 1 toddler. Is extra mattress and beachside bonfire available?",
    status: "New",
    notes: "Needs confirmation regarding baby cot and dinner package.",
    created_at: "2026-08-31T14:30:00Z"
  },
  {
    enquiry_id: 2,
    guest_name: "Pooja Hegde",
    guest_mobile: "+919819876543",
    guest_email: "pooja.h@example.com",
    property_name: "Konkan Heritage Homestay",
    room_name: "Standard Heritage Room",
    check_in_date: "2026-09-20",
    check_out_date: "2026-09-22",
    guests_count: 2,
    message: "Looking for authentic Malvani seafood lunch and check-in around 11:00 AM. Can we get early check-in?",
    status: "Responded",
    notes: "WhatsApp message sent confirming early check-in availability.",
    created_at: "2026-08-31T11:15:00Z"
  },
  {
    enquiry_id: 3,
    guest_name: "Vikram Mehta",
    guest_mobile: "+919833445566",
    guest_email: "vikram.m@example.com",
    property_name: "Blue Ocean Sea View Resort",
    room_name: "Luxury Suite",
    check_in_date: "2026-10-02",
    check_out_date: "2026-10-05",
    guests_count: 6,
    message: "Corporate weekend retreat. We need 3 rooms with high-speed WiFi for work calls. Please share group discount rates.",
    status: "Converted",
    notes: "Converted to Booking #KT-20261002-CORP.",
    created_at: "2026-08-30T16:45:00Z"
  },
  {
    enquiry_id: 4,
    guest_name: "Ananya Joshi",
    guest_mobile: "+919765432109",
    guest_email: "ananya.joshi@example.com",
    property_name: "Devbagh Beach Shack & Villa",
    room_name: "Beachfront Wooden Cottage",
    check_in_date: "2026-09-12",
    check_out_date: "2026-09-14",
    guests_count: 2,
    message: "Is pet dog allowed on the beach premises and cottage room?",
    status: "Closed",
    notes: "Guest notified of pet policy.",
    created_at: "2026-08-29T10:00:00Z"
  }
];

function getStatusBadge(status) {
  switch (status) {
    case "New":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Responded":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Converted":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Closed":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState(initialMockEnquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newNote, setNewNote] = useState("");

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesSearch =
        item.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.guest_mobile.includes(searchTerm) ||
        item.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [enquiries, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      newCount: enquiries.filter((e) => e.status === "New").length,
      respondedCount: enquiries.filter((e) => e.status === "Responded").length,
      convertedCount: enquiries.filter((e) => e.status === "Converted").length,
    };
  }, [enquiries]);

  const handleUpdateStatus = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.enquiry_id === id ? { ...e, status: newStatus } : e))
    );
    if (selectedEnquiry && selectedEnquiry.enquiry_id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveNote = () => {
    if (!selectedEnquiry || !newNote.trim()) return;
    setEnquiries((prev) =>
      prev.map((e) =>
        e.enquiry_id === selectedEnquiry.enquiry_id
          ? { ...e, notes: newNote }
          : e
      )
    );
    setSelectedEnquiry((prev) => ({ ...prev, notes: newNote }));
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customer Enquiries & Leads
          </h1>
          <p className="text-sm text-slate-500">
            Track guest inquiries, respond via WhatsApp or Call, and convert inquiries to confirmed stays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnquiries(initialMockEnquiries)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Leads
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <MessageCircleQuestion className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{stats.total}</div>
          <p className="mt-0.5 text-xs text-slate-400">All guest requests received</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              New Inquiries
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-900">{stats.newCount}</div>
          <p className="mt-0.5 text-xs text-emerald-600 font-medium">Awaiting first response</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              Responded
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-sky-900">{stats.respondedCount}</div>
          <p className="mt-0.5 text-xs text-sky-600 font-medium">In conversation</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-800">
              Converted
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-900">{stats.convertedCount}</div>
          <p className="mt-0.5 text-xs text-purple-600 font-medium">Confirmed bookings</p>
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
            placeholder="Search by guest name, phone, property or message..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "New", "Responded", "Converted", "Closed"].map((status) => (
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

      {/* Enquiries List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Cards List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredEnquiries.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
              <MessageCircleQuestion className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">No Enquiries Found</h3>
              <p className="mt-1 text-xs text-slate-500">
                No guest inquiries match your selected filter criteria.
              </p>
            </div>
          ) : (
            filteredEnquiries.map((item) => (
              <div
                key={item.enquiry_id}
                onClick={() => {
                  setSelectedEnquiry(item);
                  setNewNote(item.notes || "");
                }}
                className={`cursor-pointer rounded-2xl border p-5 transition shadow-xs hover:shadow-sm ${
                  selectedEnquiry?.enquiry_id === item.enquiry_id
                    ? "border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500"
                    : "border-slate-200/80 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                      {item.guest_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.guest_name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{item.guest_mobile}</span>
                        {item.guest_email && <span>• {item.guest_email}</span>}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed border border-slate-100">
                  <span className="font-semibold text-slate-900">Inquiry: </span>
                  "{item.message}"
                </div>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {item.property_name}
                    </span>
                    {item.check_in_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {item.check_in_date} to {item.check_out_date} ({item.guests_count} guests)
                      </span>
                    )}
                  </div>

                  {/* Action Shortcuts */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`https://wa.me/${item.guest_mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hello ${item.guest_name}, thank you for inquiring with ${item.property_name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${item.guest_mobile}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Phone className="h-3 w-3 text-slate-500" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right 1 Col: Selected Lead Drawer/Details */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          {selectedEnquiry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Lead Management</h3>
                <span
                  className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                    selectedEnquiry.status
                  )}`}
                >
                  {selectedEnquiry.status}
                </span>
              </div>

              {/* Guest Profile Card */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-200 text-emerald-900 font-bold text-xs">
                    {selectedEnquiry.guest_name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{selectedEnquiry.guest_name}</h5>
                    <p className="text-[11px] text-slate-500">{selectedEnquiry.guest_mobile}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-800">Property:</span> {selectedEnquiry.property_name}</p>
                  <p><span className="font-semibold text-slate-800">Room:</span> {selectedEnquiry.room_name}</p>
                  <p><span className="font-semibold text-slate-800">Dates:</span> {selectedEnquiry.check_in_date || "Flexible"} to {selectedEnquiry.check_out_date || "Flexible"}</p>
                  <p><span className="font-semibold text-slate-800">Guests:</span> {selectedEnquiry.guests_count} People</p>
                </div>
              </div>

              {/* Status Updater */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Update Lead Stage
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["New", "Responded", "Converted", "Closed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedEnquiry.enquiry_id, st)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold text-center transition ${
                        selectedEnquiry.status === st
                          ? "border-emerald-600 bg-emerald-700 text-white font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add notes about quote, preferences, conversation summary..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
                <button
                  onClick={handleSaveNote}
                  className="mt-2 w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                >
                  Save Internal Note
                </button>
              </div>

              {/* Direct Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <a
                  href={`https://wa.me/${selectedEnquiry.guest_mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello ${selectedEnquiry.guest_name}! Thank you for your inquiry about ${selectedEnquiry.property_name}. We are pleased to confirm that we have availability for your selected dates.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Reply on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <MessageSquare className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs font-medium">Select an enquiry to view full details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnquiriesPage;
