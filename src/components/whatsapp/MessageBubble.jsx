import React from "react";
import { Check, CheckCheck, Clock, BedDouble, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { DEMO_ROOM, DEMO_PROPERTY } from "../../data/whatsappDemoData";

export default function MessageBubble({ message, onOpenBookingModal }) {
  const isCustomer = message.sender === "customer";

  // Status icon for customer messages
  const renderStatus = () => {
    if (!isCustomer) return null;

    if (message.status === "read") {
      return <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline-block ml-1" title="Read" />;
    }
    if (message.status === "delivered") {
      return <CheckCheck className="w-3.5 h-3.5 text-slate-400 inline-block ml-1" title="Delivered" />;
    }
    return <Check className="w-3.5 h-3.5 text-slate-400 inline-block ml-1" title="Sent" />;
  };

  return (
    <div
      className={`flex flex-col mb-3 ${
        isCustomer ? "items-end" : "items-start"
      } animate-fade-in group`}
    >
      {/* Sender label for clarity */}
      <span className="text-[10px] text-slate-600 mb-0.5 px-1 font-semibold uppercase tracking-wider">
        {isCustomer ? "Rahul Patil (Customer)" : "Konkan Beach Resort (Front Desk)"}
      </span>

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-xs transition-shadow ${
          isCustomer
            ? "bg-emerald-100 text-slate-900 rounded-tr-xs border border-emerald-200/60"
            : "bg-white text-slate-900 rounded-tl-xs border border-slate-200"
        }`}
      >
        {/* Message Text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>

        {/* Embedded Booking CTA Card if triggered */}
        {message.isBookingCTA && (
          <div className="mt-3 pt-3 border-t border-slate-200 bg-emerald-50/70 -mx-3 -mb-3 p-3 rounded-b-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-700 text-white">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="font-bold text-slate-900 text-xs">{DEMO_ROOM.name}</h6>
                  <p className="text-[11px] text-slate-500">2 Nights (20–22 Sep 2026) • 2 Adults</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800">₹9,000</span>
                <span className="text-[10px] text-slate-400 block">+ GST</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free cancellation up to 48 hours prior</span>
            </div>

            <button
              type="button"
              onClick={onOpenBookingModal}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Continue to Booking
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Timestamp & Status Indicator */}
        <div
          className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
            isCustomer ? "text-emerald-800/80" : "text-slate-600"
          }`}
        >
          <span>{message.timestamp}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
