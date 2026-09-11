import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { ShieldCheck, Info } from "lucide-react";
import { DEMO_PROPERTY } from "../../data/whatsappDemoData";

export default function MessageList({
  messages,
  isHotelTyping,
  onOpenBookingModal
}) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message whenever messages or typing state changes
  useEffect(() => {
    if (typeof bottomRef.current?.scrollIntoView === "function") {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isHotelTyping]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/90 relative"
      style={{
        backgroundImage: `radial-gradient(#cbd5e1 0.75px, transparent 0.75px)`,
        backgroundSize: "16px 16px"
      }}
    >
      {/* Simulation Notice Pill */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] shadow-2xs">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Simulation:</strong> No actual WhatsApp messages are sent. Automated replies run via local engine.
          </span>
        </div>
      </div>

      {/* Date Separator Pill */}
      <div className="flex justify-center mb-5">
        <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-slate-500 text-[11px] font-medium shadow-2xs border border-slate-200/60 uppercase tracking-wider">
          Today, 20 September 2026
        </span>
      </div>

      {/* Encrypted Notice Banner (WhatsApp-like) */}
      <div className="max-w-md mx-auto mb-6 p-2.5 bg-emerald-50/80 border border-emerald-200/60 rounded-xl text-center text-[11px] text-emerald-800 flex items-center justify-center gap-2 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Enquiry directly connected to <strong>{DEMO_PROPERTY.name}</strong> official verified desk.
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-1">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onOpenBookingModal={onOpenBookingModal}
          />
        ))}

        {/* Typing indicator */}
        {isHotelTyping && <TypingIndicator senderName={DEMO_PROPERTY.name} />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
