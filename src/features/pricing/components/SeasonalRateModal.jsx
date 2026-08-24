import { useState, useEffect } from "react";
import { X, CalendarRange, Sparkles, Check, AlertCircle } from "lucide-react";
import { useCreatePricingRate, useUpdatePricingRate } from "../hooks/usePricing.js";

function SeasonalRateModal({
  isOpen,
  onClose,
  initialData = null,
  properties = [],
  rooms = [],
  onSuccess,
}) {
  const createRateMutation = useCreatePricingRate();
  const updateRateMutation = useUpdatePricingRate();

  const isEditing = Boolean(initialData?.rate_id);

  const [rateName, setRateName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [extraAdultPrice, setExtraAdultPrice] = useState("0");
  const [extraChildPrice, setExtraChildPrice] = useState("0");
  const [selectedDays, setSelectedDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setRateName(initialData.rate_name || "");
      setPropertyId(initialData.property_id ? String(initialData.property_id) : "");
      setRoomId(initialData.room_id ? String(initialData.room_id) : "");
      setStartDate(
        initialData.start_date ? initialData.start_date.split("T")[0] : ""
      );
      setEndDate(
        initialData.end_date ? initialData.end_date.split("T")[0] : ""
      );
      setBasePrice(initialData.base_price ? String(initialData.base_price) : "");
      setDiscountPrice(
        initialData.discount_price !== null && initialData.discount_price !== undefined
          ? String(initialData.discount_price)
          : ""
      );
      setExtraAdultPrice(
        initialData.extra_adult_price !== null && initialData.extra_adult_price !== undefined
          ? String(initialData.extra_adult_price)
          : "0"
      );
      setExtraChildPrice(
        initialData.extra_child_price !== null && initialData.extra_child_price !== undefined
          ? String(initialData.extra_child_price)
          : "0"
      );
      if (initialData.days_of_week) {
        setSelectedDays(initialData.days_of_week.split(",").map((d) => d.trim()));
      }
      setIsActive(
        initialData.is_active !== undefined && initialData.is_active !== null
          ? Boolean(Number(initialData.is_active))
          : true
      );
      setErrorMessage("");
    } else {
      setRateName("");
      setPropertyId(properties[0]?.property_id ? String(properties[0].property_id) : "");
      setRoomId(rooms[0]?.room_id ? String(rooms[0].room_id) : "");
      setStartDate("");
      setEndDate("");
      setBasePrice("");
      setDiscountPrice("");
      setExtraAdultPrice("0");
      setExtraChildPrice("0");
      setSelectedDays([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
      setIsActive(true);
      setErrorMessage("");
    }
  }, [initialData, isOpen, properties, rooms]);

  if (!isOpen) return null;

  const availableRooms = propertyId
    ? rooms.filter((r) => Number(r.property_id) === Number(propertyId))
    : rooms;

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!rateName.trim()) {
      setErrorMessage("Rate rule name is required.");
      return;
    }
    if (!propertyId || !roomId) {
      setErrorMessage("Please select both a property and target room.");
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage("Please specify start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage("Start date cannot be later than end date.");
      return;
    }
    const baseVal = Number(basePrice);
    if (isNaN(baseVal) || baseVal <= 0) {
      setErrorMessage("Please enter a valid base price.");
      return;
    }

    const payload = {
      property_id: Number(propertyId),
      room_id: Number(roomId),
      rate_name: rateName.trim(),
      start_date: startDate,
      end_date: endDate,
      base_price: baseVal,
      discount_price: discountPrice.trim() !== "" ? Number(discountPrice) : null,
      extra_adult_price: Number(extraAdultPrice) || 0,
      extra_child_price: Number(extraChildPrice) || 0,
      days_of_week: selectedDays.join(","),
      is_active: isActive,
    };

    try {
      if (isEditing) {
        await updateRateMutation.mutateAsync({
          rateId: initialData.rate_id,
          roomId: initialData.room_id,
          data: payload,
        });
      } else {
        await createRateMutation.mutateAsync(payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to save rate rule."
      );
    }
  };

  const isLoading =
    createRateMutation.isPending || updateRateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? "Edit Seasonal Rate Rule" : "Create Seasonal Rate Rule"}
              </h3>
              <p className="text-xs text-slate-500">
                Configure special seasonal, weekend or holiday rates with custom dates.
              </p>
            </div>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Rule Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Rule / Campaign Name *
            </label>
            <input
              type="text"
              required
              value={rateName}
              onChange={(e) => setRateName(e.target.value)}
              placeholder="e.g. Diwali Weekend Surge / Monsoon Promotion"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Property & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Property *
              </label>
              <select
                required
                disabled={isEditing}
                value={propertyId}
                onChange={(e) => {
                  setPropertyId(e.target.value);
                  const matching = rooms.filter(
                    (r) => Number(r.property_id) === Number(e.target.value)
                  );
                  if (matching.length > 0) setRoomId(String(matching[0].room_id));
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {properties.map((p) => (
                  <option key={p.property_id} value={p.property_id}>
                    {p.property_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Target Room *
              </label>
              <select
                required
                disabled={isEditing}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {availableRooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>
                    {r.room_name} ({r.room_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Applicable Days
            </label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    selectedDays.includes(day)
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800">
                Seasonal Base Price (₹) *
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="50"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Promotional Offer Price (₹)
              </label>
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
                  placeholder="Optional discount"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="checkbox"
              id="isActiveCheckbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="isActiveCheckbox"
              className="text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Rule is active and available for booking calculations
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Rule" : "Create Rate Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SeasonalRateModal;
