import React from "react";
import {
  Info,
  Phone,
  RotateCcw,
  ArrowLeft,
  ShieldCheck,
  Building,
  UserCheck
} from "lucide-react";
import { DEMO_PROPERTY } from "../../data/whatsappDemoData";

export default function ChatHeader({
  onOpenHotelInfo,
  onResetConversation,
  onBackToList,
  mode = "customer",
  onToggleMode
}) {
  return (
    <header className="px-4 py-3 bg-emerald-800 text-white flex items-center justify-between shadow-md z-20">
      {/* Left: Mobile Back + Hotel Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back button */}
        <button
          type="button"
          onClick={onBackToList}
          className="lg:hidden p-1.5 rounded-lg hover:bg-emerald-700 text-emerald-100 transition-colors"
          title="Back to conversation list"
          aria-label="Back to conversation list"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Hotel Avatar */}
        <div className="relative shrink-0">
          <img
            src={DEMO_PROPERTY.image}
            alt={DEMO_PROPERTY.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
          />
          {/* Online green dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
        </div>

        {/* Title & Status */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-bold text-sm sm:text-base leading-tight truncate">
              {DEMO_PROPERTY.name}
            </h2>
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" title="Verified OTA Property Partner" />
          </div>
          <p className="text-xs text-emerald-200 truncate flex items-center gap-1">
            <span>{DEMO_PROPERTY.location}</span>
            <span>•</span>
            <span className="text-emerald-300 font-medium">Online / Available for enquiries</span>
          </p>
        </div>
      </div>

      {/* Right: Mode Switcher, Info & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mode Indicator / Toggle */}
        <button
          type="button"
          onClick={onToggleMode}
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
            mode === "customer"
              ? "bg-emerald-700/80 border-emerald-600 text-white hover:bg-emerald-600"
              : "bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400"
          }`}
          title="Click to toggle between Customer View and Hotel Front Desk View"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{mode === "customer" ? "Customer View" : "Hotel Front Desk"}</span>
        </button>

        {/* Info Drawer Button */}
        <button
          type="button"
          onClick={onOpenHotelInfo}
          className="p-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
          title="View Hotel Details, Rates & Gallery"
          aria-label="View hotel information"
        >
          <Info className="w-5 h-5" />
        </button>

        {/* Reset Conversation */}
        <button
          type="button"
          onClick={onResetConversation}
          className="p-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 hover:text-white transition-colors cursor-pointer"
          title="Reset conversation to initial scenario"
          aria-label="Reset conversation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
