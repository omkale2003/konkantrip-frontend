import React from "react";

/**
 * Animated WhatsApp-style typing indicator
 */
export default function TypingIndicator({ senderName = "Konkan Beach Resort" }) {
  return (
    <div className="flex items-end gap-2 mb-3 animate-fade-in">
      {/* Hotel mini-avatar */}
      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-sm">
        KB
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-sm max-w-[80%] inline-flex items-center gap-3">
        <span className="text-xs font-medium text-slate-500">
          {senderName} is typing
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
