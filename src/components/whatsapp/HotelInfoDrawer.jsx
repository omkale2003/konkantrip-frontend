import React, { useEffect } from "react";
import {
  X,
  MapPin,
  Star,
  BedDouble,
  Check,
  Calendar,
  Clock,
  Shield,
  Phone,
  MessageCircle,
  Wifi,
  Coffee,
  Car,
  Waves,
  Wind,
  Eye,
  ExternalLink
} from "lucide-react";
import { DEMO_PROPERTY, DEMO_ROOM } from "../../data/whatsappDemoData";

export default function HotelInfoDrawer({ isOpen, onClose }) {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Hotel Information"
          className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slideInRight"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-700/60 rounded-lg">
                <MessageCircle className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-base font-bold">Property Details</h3>
                <p className="text-xs text-emerald-200">KonkanTrip Verified Partner</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-700 text-sm">
            {/* Property Photo & Badges */}
            <div className="relative rounded-xl overflow-hidden shadow-sm aspect-video bg-slate-100">
              <img
                src={DEMO_PROPERTY.image}
                alt={DEMO_PROPERTY.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {DEMO_PROPERTY.rating} ({DEMO_PROPERTY.reviewsCount} reviews)
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/70 backdrop-blur-xs text-white p-2.5 rounded-lg">
                <h4 className="font-bold text-sm leading-tight">{DEMO_PROPERTY.name}</h4>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  {DEMO_PROPERTY.location}
                </p>
              </div>
            </div>

            {/* Room Category Card */}
            <div className="border border-slate-200 bg-emerald-50/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                    Active Enquiry Room
                  </span>
                  <h5 className="font-bold text-slate-900 text-base">{DEMO_ROOM.name}</h5>
                  <p className="text-xs text-slate-500">{DEMO_ROOM.bedType} • Max {DEMO_ROOM.maxOccupancy} Guests</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-700">₹{DEMO_ROOM.pricePerNight}</span>
                  <span className="text-xs text-slate-400 block">/ night</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60 text-xs text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Includes Daily Complimentary Breakfast</span>
              </div>
            </div>

            {/* Check-in / Check-out Timings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> Check-in
                </span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{DEMO_PROPERTY.checkInTime}</p>
                <span className="text-[10px] text-slate-500">Early check-in on request</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" /> Check-out
                </span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{DEMO_PROPERTY.checkOutTime}</p>
                <span className="text-[10px] text-slate-500">Late check-out available</span>
              </div>
            </div>

            {/* Location & Beach Access */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Location Highlights</h5>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <p className="text-slate-800 font-medium">
                  {DEMO_PROPERTY.fullAddress}
                </p>
                <p className="text-emerald-700 flex items-center gap-1.5 font-medium">
                  <Waves className="w-3.5 h-3.5 shrink-0" />
                  {DEMO_PROPERTY.beachDistance}
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Amenities & Services</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {DEMO_PROPERTY.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cancellation Policy</h5>
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{DEMO_PROPERTY.cancellationPolicy}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Direct Hotel Contacts</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-emerald-600" /> Phone
                  </span>
                  <span className="font-mono font-medium text-slate-900">{DEMO_PROPERTY.phone}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="flex items-center gap-2 text-slate-600">
                    <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Direct
                  </span>
                  <span className="font-semibold text-emerald-700">Verified OTA Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close Information
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
