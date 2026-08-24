import { useState, useEffect } from "react";
import { X, Tag, Sparkles, Users, Check, AlertCircle } from "lucide-react";
import { useUpdateSingleRoomPrice } from "../hooks/usePricing.js";

function SinglePriceEditModal({ isOpen, onClose, room, onSuccess }) {
  const updatePriceMutation = useUpdateSingleRoomPrice();

  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [extraAdultPrice, setExtraAdultPrice] = useState("0");
  const [extraChildPrice, setExtraChildPrice] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (room) {
      setBasePrice(room.base_price !== null && room.base_price !== undefined ? String(room.base_price) : "");
      setDiscountPrice(
        room.discount_price !== null && room.discount_price !== undefined
          ? String(room.discount_price)
          : ""
      );
      setExtraAdultPrice(
        room.extra_adult_price !== null && room.extra_adult_price !== undefined
          ? String(room.extra_adult_price)
          : "0"
      );
      setExtraChildPrice(
        room.extra_child_price !== null && room.extra_child_price !== undefined
          ? String(room.extra_child_price)
          : "0"
      );
      setErrorMessage("");
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const baseVal = Number(basePrice);
    if (isNaN(baseVal) || baseVal < 0) {
      setErrorMessage("Please enter a valid base price.");
      return;
    }

    const discVal = discountPrice.trim() !== "" ? Number(discountPrice) : null;
    if (discVal !== null && (isNaN(discVal) || discVal < 0)) {
      setErrorMessage("Please enter a valid promotional discount price.");
      return;
    }

    if (discVal !== null && discVal > baseVal) {
      setErrorMessage("Promotional discount price cannot be higher than base price.");
      return;
    }

    try {
      await updatePriceMutation.mutateAsync({
        roomId: room.room_id,
        data: {
          base_price: baseVal,
          discount_price: discVal,
          extra_adult_price: Number(extraAdultPrice) || 0,
          extra_child_price: Number(extraChildPrice) || 0,
        },
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to update room price."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Edit Room Pricing
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {room.room_name} ({room.room_code})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Base Price */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Base Nightly Rate (₹) *
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                required
                min="0"
                step="50"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="e.g. 3500"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Promotional / Discount Price */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Promotional Offer Price (₹)
              </label>
              <span className="text-[10px] text-slate-400">Optional</span>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Leave blank for standard rate"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            {discountPrice && basePrice && Number(discountPrice) < Number(basePrice) && (
              <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                🏷️ {Math.round(((Number(basePrice) - Number(discountPrice)) / Number(basePrice)) * 100)}% Discount will be visible to guests
              </p>
            )}
          </div>

          {/* Extra Guests */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Extra Adult (₹)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={extraAdultPrice}
                  onChange={(e) => setExtraAdultPrice(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-7 pr-2 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Extra Child (₹)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={extraChildPrice}
                  onChange={(e) => setExtraChildPrice(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-7 pr-2 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePriceMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50"
            >
              {updatePriceMutation.isPending ? "Saving..." : "Save Pricing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SinglePriceEditModal;
