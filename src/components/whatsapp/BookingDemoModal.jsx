import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  BedDouble,
  MapPin,
  ShieldCheck,
  CreditCard,
  Building,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { DEMO_PROPERTY, DEMO_ROOM, DEFAULT_BOOKING_ENQUIRY, DEMO_CUSTOMER } from "../../data/whatsappDemoData";

export default function BookingDemoModal({ isOpen, onClose, onBookingSuccess }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [specialRequest, setSpecialRequest] = useState("Sea view higher floor requested via WhatsApp enquiry.");

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (onBookingSuccess) onBookingSuccess();
  };

  const handleReset = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-5 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> KonkanTrip Booking Flow Demo
            </div>
            <h3 className="text-xl font-bold">{DEMO_PROPERTY.name}</h3>
            <p className="text-emerald-100 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {DEMO_PROPERTY.location}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-slate-700 text-sm">
          {!isConfirmed ? (
            <>
              {/* Hotel Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{DEMO_ROOM.name}</p>
                      <p className="text-xs text-slate-500">Includes Breakfast for 2 Guests</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md">
                    WhatsApp Enquiry Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400 block">Dates</span>
                      <span className="font-medium text-slate-800">20 Sep – 22 Sep (2N)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400 block">Occupancy</span>
                      <span className="font-medium text-slate-800">2 Adults (1 Room)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Guest Information</h4>
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{DEMO_CUSTOMER.name}</p>
                    <p className="text-xs text-slate-500">{DEMO_CUSTOMER.phone} • {DEMO_CUSTOMER.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Primary Guest</span>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Special Notes from WhatsApp Enquiry
                </label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Room Tariff (₹4,500 × 2 nights)</span>
                  <span className="font-medium text-slate-800">₹9,000</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Taxes & GST (12%)</span>
                  <span className="font-medium text-slate-800">₹1,080</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                  <span>Instant WhatsApp Enquiry Discount</span>
                  <span>- ₹0</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-emerald-700">₹10,080</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-emerald-50 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Free Cancellation</strong> up to 48 hours prior to arrival. Pay at property or via secure UPI.
                </span>
              </div>
            </>
          ) : (
            /* Confirmation State */
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Reservation Request Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Booking ref: <span className="font-mono font-semibold text-emerald-800">KT-TRK-2026-0920</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <p className="font-medium text-slate-800">Confirmation has been linked to the WhatsApp simulation thread.</p>
                <p className="text-slate-600">
                  Front desk at <strong>{DEMO_PROPERTY.name}</strong> will receive the guest details for <strong>{DEMO_CUSTOMER.name}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          {!isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Back to Chat
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
              >
                Confirm Booking Demo <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              Return to WhatsApp Conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
