import React from "react";
import {
  Calendar,
  Tag,
  BedDouble,
  Coffee,
  Car,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { QUICK_ENQUIRY_PRESETS } from "../../data/whatsappDemoData";

export default function QuickEnquiryActions({ onSelectPreset, disabled }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Calendar":
        return <Calendar className="w-3.5 h-3.5 text-emerald-700" />;
      case "Tag":
        return <Tag className="w-3.5 h-3.5 text-blue-700" />;
      case "BedDouble":
        return <BedDouble className="w-3.5 h-3.5 text-purple-700" />;
      case "Coffee":
        return <Coffee className="w-3.5 h-3.5 text-amber-700" />;
      case "Car":
        return <Car className="w-3.5 h-3.5 text-slate-700" />;
      case "Clock":
        return <Clock className="w-3.5 h-3.5 text-orange-700" />;
      case "MapPin":
        return <MapPin className="w-3.5 h-3.5 text-rose-700" />;
      case "Users":
        return <Users className="w-3.5 h-3.5 text-teal-700" />;
      case "CheckCircle":
        return <Sparkles className="w-3.5 h-3.5 text-emerald-800" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-700" />;
    }
  };

  return (
    <div className="px-4 py-2 bg-white/95 border-t border-slate-200/80 backdrop-blur-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0 select-none">
          Quick Enquiries:
        </span>
        {QUICK_ENQUIRY_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPreset(preset.message)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
              preset.id === "book_now"
                ? "bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200/90"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {getIcon(preset.icon)}
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
