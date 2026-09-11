import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  ShieldCheck,
  Hotel,
  MapPin,
  CheckCheck,
  User,
  Phone,
  Sparkles,
  Settings2,
  ChevronRight
} from "lucide-react";
import {
  DEMO_CUSTOMER,
  CONVERSATION_CONTACTS,
  DEMO_PROPERTY
} from "../../data/whatsappDemoData";

export default function ConversationSidebar({
  activeContactId,
  onSelectContact,
  latestMessageSnippet,
  onOpenControls
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = CONVERSATION_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside
      aria-label="Conversations Sidebar"
      className="w-full lg:w-80 xl:w-96 bg-white border-r border-slate-200 flex flex-col h-full shrink-0"
    >
      {/* Top Header: Customer Profile info */}
      <div className="p-3.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={DEMO_CUSTOMER.avatar}
              alt={DEMO_CUSTOMER.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {DEMO_CUSTOMER.name}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                Guest
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" /> {DEMO_CUSTOMER.phone}
            </p>
          </div>
        </div>

        {/* Demo Controls Launcher button */}
        <button
          type="button"
          onClick={onOpenControls}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
          title="Open Simulator Demo Controls & Scenarios"
          aria-label="Open Demo Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-100 bg-slate-50">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search hotel enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-3 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Conversations Section Header */}
      <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
        <span>Active Hotel Enquiries</span>
        <span>{filteredContacts.length} Resorts</span>
      </div>

      {/* Contact Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredContacts.map((contact) => {
          const isActive = contact.id === activeContactId;

          return (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                isActive
                  ? "bg-emerald-50/80 border-l-4 border-emerald-700"
                  : "hover:bg-slate-50 bg-white"
              }`}
            >
              {/* Hotel Avatar */}
              <div className="relative shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate flex items-center gap-1">
                    {contact.name}
                    {contact.isPrimary && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {contact.lastActive}
                  </span>
                </div>

                <p className="text-xs text-slate-500 truncate flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  {contact.location}
                </p>

                {/* Snippet */}
                <p className="text-xs text-slate-600 truncate flex items-center gap-1">
                  {isActive ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate italic">{latestMessageSnippet || "Active WhatsApp enquiry thread"}</span>
                    </>
                  ) : (
                    <span>Enquiry on KonkanTrip portal</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Pill */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
        <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>KonkanTrip WhatsApp CRM Simulation</span>
        </div>
      </div>
    </aside>
  );
}
