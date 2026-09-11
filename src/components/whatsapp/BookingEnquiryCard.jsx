import React from "react";
import { Hotel, MapPin, Calendar, Users, BedDouble, Info, ChevronRight } from "lucide-react";
import { DEMO_PROPERTY, DEMO_ROOM, DEFAULT_BOOKING_ENQUIRY } from "../../data/whatsappDemoData";

export default function BookingEnquiryCard({ onOpenHotelInfo }) {
  return (
    <div className="bg-white/95 backdrop-blur-xs border-b border-emerald-950/10 px-4 py-2.5 shadow-xs z-10 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left: Property & Room */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs border border-emerald-200">
            <Hotel className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {DEMO_PROPERTY.name}
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                Active Property Context
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs truncate">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" /> {DEMO_PROPERTY.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <BedDouble className="w-3 h-3" /> {DEMO_ROOM.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Stay Context & Action */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-xs">
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{DEFAULT_BOOKING_ENQUIRY.formattedDates}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-700">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>{DEFAULT_BOOKING_ENQUIRY.adults} Adults</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenHotelInfo}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
            title="View full hotel information, policies, and photos"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hotel Info</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
