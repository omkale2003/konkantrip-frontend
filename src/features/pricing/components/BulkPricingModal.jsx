import { useState, useMemo, useEffect } from "react";
import {
  X,
  Zap,
  TrendingUp,
  Percent,
  Plus,
  Minus,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { useBulkUpdatePricing, useBulkCreateSeasonalRates } from "../hooks/usePricing.js";

function BulkPricingModal({
  isOpen,
  onClose,
  allRooms = [],
  selectedRoomIds = [],
  properties = [],
  defaultSeasonal = false,
  onSuccess,
}) {
  const bulkUpdateMutation = useBulkUpdatePricing();
  const bulkSeasonalMutation = useBulkCreateSeasonalRates();

  // Target scope
  const [targetScope, setTargetScope] = useState(
    selectedRoomIds.length > 0 ? "selected" : "property"
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties[0]?.property_id ? String(properties[0].property_id) : ""
  );

  // Strategy
  const [action, setAction] = useState("adjust_percent"); // "set_price" | "adjust_percent" | "adjust_fixed" | "set_discount" | "clear_discount" | "extra_guests"
  
  // Strategy Values
  const [fixedBasePrice, setFixedBasePrice] = useState("");
  const [percentageValue, setPercentageValue] = useState("10"); // +10 or -10
  const [isIncrease, setIsIncrease] = useState(true);
  const [fixedAmountValue, setFixedAmountValue] = useState("500");
  const [discountType, setDiscountType] = useState("percentage"); // "percentage" | "fixed_price"
  const [discountValue, setDiscountValue] = useState("15");
  const [extraAdultPrice, setExtraAdultPrice] = useState("500");
  const [extraChildPrice, setExtraChildPrice] = useState("250");

  // Optional Seasonal Rule
  const [createAsSeasonal, setCreateAsSeasonal] = useState(defaultSeasonal);
  const [seasonalRateName, setSeasonalRateName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);

  useEffect(() => {
    if (isOpen) {
      setCreateAsSeasonal(Boolean(defaultSeasonal));
      setErrorMessage("");
    }
  }, [isOpen, defaultSeasonal]);

  const [errorMessage, setErrorMessage] = useState("");

  // Determine target rooms list
  const targetRooms = useMemo(() => {
    if (targetScope === "selected") {
      const idSet = new Set(selectedRoomIds.map(Number));
      return allRooms.filter((r) => idSet.has(Number(r.room_id)));
    }
    if (targetScope === "property" && selectedPropertyId) {
      return allRooms.filter(
        (r) => Number(r.property_id) === Number(selectedPropertyId)
      );
    }
    return allRooms;
  }, [targetScope, selectedRoomIds, selectedPropertyId, allRooms]);

  // Compute live price preview for each room
  const previewData = useMemo(() => {
    return targetRooms.map((room) => {
      const oldBase = Number(room.base_price) || 0;
      const oldDiscount =
        room.discount_price !== null && room.discount_price !== undefined
          ? Number(room.discount_price)
          : null;
      let newBase = oldBase;
      let newDiscount = oldDiscount;
      let newExtraAdult = Number(room.extra_adult_price) || 0;
      let newExtraChild = Number(room.extra_child_price) || 0;

      if (action === "set_price") {
        const val = Number(fixedBasePrice);
        if (!isNaN(val) && fixedBasePrice !== "") {
          newBase = Math.max(0, val);
        }
      } else if (action === "adjust_percent") {
        const pct = (Number(percentageValue) || 0) * (isIncrease ? 1 : -1);
        newBase = Math.max(0, Math.round(oldBase * (1 + pct / 100)));
        if (oldDiscount !== null) {
          newDiscount = Math.max(0, Math.round(oldDiscount * (1 + pct / 100)));
        }
      } else if (action === "adjust_fixed") {
        const amt = (Number(fixedAmountValue) || 0) * (isIncrease ? 1 : -1);
        newBase = Math.max(0, oldBase + amt);
        if (oldDiscount !== null) {
          newDiscount = Math.max(0, oldDiscount + amt);
        }
      } else if (action === "set_discount") {
        if (discountType === "fixed_price") {
          const val = Number(discountValue);
          if (!isNaN(val) && discountValue !== "") {
            newDiscount = Math.max(0, val);
          }
        } else {
          const pct = Math.max(0, Math.min(100, Number(discountValue) || 0));
          newDiscount = Math.max(0, Math.round(oldBase * (1 - pct / 100)));
        }
      } else if (action === "clear_discount") {
        newDiscount = null;
      } else if (action === "extra_guests") {
        if (extraAdultPrice !== "") newExtraAdult = Math.max(0, Number(extraAdultPrice));
        if (extraChildPrice !== "") newExtraChild = Math.max(0, Number(extraChildPrice));
      }

      const diff = newBase - oldBase;
      const diffPct =
        oldBase > 0 ? Math.round(((newBase - oldBase) / oldBase) * 100) : 0;

      return {
        room,
        oldBase,
        newBase,
        oldDiscount,
        newDiscount,
        newExtraAdult,
        newExtraChild,
        diff,
        diffPct,
      };
    });
  }, [
    targetRooms,
    action,
    fixedBasePrice,
    percentageValue,
    isIncrease,
    fixedAmountValue,
    discountType,
    discountValue,
    extraAdultPrice,
    extraChildPrice,
  ]);

  if (!isOpen) return null;

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

    if (targetRooms.length === 0) {
      setErrorMessage("Please select at least one room to apply bulk changes.");
      return;
    }

    const roomIds = targetRooms.map((r) => r.room_id);

    try {
      if (createAsSeasonal) {
        if (!seasonalRateName.trim()) {
          setErrorMessage("Please provide a name for the seasonal rate rule.");
          return;
        }
        if (!startDate || !endDate) {
          setErrorMessage("Please specify both start and end dates.");
          return;
        }
        if (new Date(startDate) > new Date(endDate)) {
          setErrorMessage("Start date cannot be later than end date.");
          return;
        }

        // Apply bulk seasonal rate rule
        const representativePreview = previewData[0];
        const propId = targetRooms[0]?.property_id;

        await bulkSeasonalMutation.mutateAsync({
          room_ids: roomIds,
          property_id: propId,
          rate_name: seasonalRateName,
          start_date: startDate,
          end_date: endDate,
          base_price: representativePreview?.newBase || 0,
          discount_price: representativePreview?.newDiscount,
          extra_adult_price: Number(extraAdultPrice) || 0,
          extra_child_price: Number(extraChildPrice) || 0,
          days_of_week: selectedDays.join(","),
          is_active: true,
        });
      } else {
        // Apply direct bulk pricing update
        const payload = {
          room_ids: roomIds,
          action:
            action === "extra_guests"
              ? "set_price"
              : action,
        };

        if (action === "set_price") {
          payload.base_price = Number(fixedBasePrice);
        } else if (action === "adjust_percent") {
          payload.percentage =
            (Number(percentageValue) || 0) * (isIncrease ? 1 : -1);
        } else if (action === "adjust_fixed") {
          payload.fixed_amount =
            (Number(fixedAmountValue) || 0) * (isIncrease ? 1 : -1);
        } else if (action === "set_discount") {
          if (discountType === "fixed_price") {
            payload.discount_price = Number(discountValue);
          } else {
            payload.percentage = Number(discountValue);
          }
        } else if (action === "clear_discount") {
          payload.action = "clear_discount";
        } else if (action === "extra_guests") {
          payload.extra_adult_price = Number(extraAdultPrice);
          payload.extra_child_price = Number(extraChildPrice);
        }

        await bulkUpdateMutation.mutateAsync(payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to execute bulk update."
      );
    }
  };

  const isLoading =
    bulkUpdateMutation.isPending || bulkSeasonalMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Bulk Pricing & Rate Adjuster
              </h2>
              <p className="text-xs text-slate-500">
                Adjust base rates, discounts, or seasonal pricing across multiple rooms simultaneously.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Operation Mode Selector */}
          <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-1.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCreateAsSeasonal(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
                !createAsSeasonal
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              <span>Standard Base & Discount (Permanent)</span>
            </button>
            <button
              type="button"
              onClick={() => setCreateAsSeasonal(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
                createAsSeasonal
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Scheduled Seasonal / Upcoming Rule</span>
            </button>
          </div>

          {/* 1. Target Scope Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Select Target Inventory Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTargetScope("selected")}
                disabled={selectedRoomIds.length === 0}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                  targetScope === "selected"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20"
                    : selectedRoomIds.length === 0
                    ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">
                    Selected Rooms
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {selectedRoomIds.length}
                  </span>
                </div>
                <span className="mt-1 text-[11px] text-slate-500">
                  {selectedRoomIds.length > 0
                    ? `Apply to ${selectedRoomIds.length} checked rooms`
                    : "No rooms checked in table"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope("property")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                  targetScope === "property"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">
                    Entire Property
                  </span>
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <span className="mt-1 text-[11px] text-slate-500">
                  All rooms under one property
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope("all")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                  targetScope === "all"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-900">
                    All Properties
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {allRooms.length} rooms
                  </span>
                </div>
                <span className="mt-1 text-[11px] text-slate-500">
                  Entire inventory portfolio
                </span>
              </button>
            </div>

            {/* Property Selector when property scope chosen */}
            {targetScope === "property" && (
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">
                  Choose Property:
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {properties.map((p) => (
                    <option key={p.property_id} value={p.property_id}>
                      {p.property_name} (
                      {allRooms.filter((r) => r.property_id === p.property_id).length} rooms)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Choose Adjustment Strategy */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Select Pricing Operation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { id: "adjust_percent", label: "Percentage %", icon: Percent },
                { id: "adjust_fixed", label: "Fixed +/- (₹)", icon: Plus },
                { id: "set_price", label: "Set Base (₹)", icon: Zap },
                { id: "set_discount", label: "Set Promo %/₹", icon: Sparkles },
                { id: "clear_discount", label: "Clear Promo", icon: Minus },
                { id: "extra_guests", label: "Extra Guests", icon: Users },
              ].map((strat) => {
                const IconComponent = strat.icon;
                return (
                  <button
                    key={strat.id}
                    type="button"
                    onClick={() => setAction(strat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                      action === strat.id
                        ? "border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-medium"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mb-1" />
                    <span className="text-[11px]">{strat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Parameter Inputs based on Strategy */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
            {/* Percentage Adjustment */}
            {action === "adjust_percent" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Adjust Base Price by Percentage (%)
                  </span>
                  <div className="flex items-center gap-1 rounded-lg bg-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setIsIncrease(true)}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        isIncrease
                          ? "bg-emerald-600 text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      + Increase Rate
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsIncrease(false)}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        !isIncrease
                          ? "bg-rose-600 text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      - Decrease Rate
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["5", "10", "15", "20", "25", "50"].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setPercentageValue(quick)}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                          percentageValue === quick
                            ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {quick}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Fixed Amount Adjustment */}
            {action === "adjust_fixed" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Adjust Base Price by Fixed Amount (₹)
                  </span>
                  <div className="flex items-center gap-1 rounded-lg bg-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setIsIncrease(true)}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        isIncrease
                          ? "bg-emerald-600 text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      + Add Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsIncrease(false)}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        !isIncrease
                          ? "bg-rose-600 text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      - Subtract Amount
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={fixedAmountValue}
                      onChange={(e) => setFixedAmountValue(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["200", "500", "750", "1000", "1500", "2000"].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setFixedAmountValue(quick)}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                          fixedAmountValue === quick
                            ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        ₹{quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Set Fixed Base Price */}
            {action === "set_price" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800">
                  Set Identical Base Nightly Rate (₹) For All Selected Rooms
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={fixedBasePrice}
                      onChange={(e) => setFixedBasePrice(e.target.value)}
                      placeholder="e.g. 3500"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["2000", "2500", "3000", "3500", "4500", "6000"].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setFixedBasePrice(quick)}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                          fixedBasePrice === quick
                            ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        ₹{quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Set Promotional Discount */}
            {action === "set_discount" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Set Promotional Discount / Offer Price
                  </span>
                  <div className="flex items-center gap-1 rounded-lg bg-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setDiscountType("percentage")}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        discountType === "percentage"
                          ? "bg-amber-500 text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      % Discount Off Base
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType("fixed_price")}
                      className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                        discountType === "fixed_price"
                          ? "bg-amber-500 text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Fixed Offer Price (₹)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    {discountType === "fixed_price" && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        ₹
                      </span>
                    )}
                    <input
                      type="number"
                      min="1"
                      max={discountType === "percentage" ? "99" : "100000"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 2999"}
                      className={`w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
                        discountType === "fixed_price" ? "pl-7" : "pl-3"
                      }`}
                    />
                    {discountType === "percentage" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        % OFF
                      </span>
                    )}
                  </div>
                  {discountType === "percentage" && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["10", "15", "20", "25", "30"].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => setDiscountValue(quick)}
                          className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                            discountValue === quick
                              ? "border-amber-500 bg-amber-50 text-amber-800"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {quick}% OFF
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clear Discount */}
            {action === "clear_discount" && (
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  This will remove all promotional/discount pricing from the selected rooms, restoring standard base rates.
                </span>
              </div>
            )}

            {/* Extra Guest Pricing */}
            {action === "extra_guests" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Extra Adult Rate (₹ / night)
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
                      placeholder="e.g. 500"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Extra Child Rate (₹ / night)
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
                      placeholder="e.g. 250"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Seasonal Rate Option */}
          <div className={`rounded-xl border p-4 space-y-3 transition ${
            createAsSeasonal
              ? "border-indigo-300 bg-indigo-50/30 ring-2 ring-indigo-500/10"
              : "border-slate-200 bg-white"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="createAsSeasonalCheckbox"
                  checked={createAsSeasonal}
                  onChange={(e) => setCreateAsSeasonal(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="createAsSeasonalCheckbox"
                  className="text-xs font-bold text-slate-900 cursor-pointer"
                >
                  Create as a Scheduled Seasonal / Promotional Rule (Date Window)
                </label>
              </div>
              <span className="text-[11px] text-slate-500">
                Leaves standard base rates intact and applies this rate during specific dates
              </span>
            </div>

            {createAsSeasonal && (
              <div className="pt-2 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Rule Name / Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={seasonalRateName}
                    onChange={(e) => setSeasonalRateName(e.target.value)}
                    placeholder="e.g. Diwali Peak Season / Summer Vacation Weekend"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
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
                    <label className="text-xs font-semibold text-slate-700">
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

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Applicable Days of Week
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
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
                            ? "bg-emerald-700 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Live Calculation Preview Matrix */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Live Calculation Impact Preview ({previewData.length} rooms)
              </label>
              <span className="text-[11px] text-slate-400">
                Calculated in real-time
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="sticky top-0 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3 text-right">Current Base</th>
                    <th className="py-2.5 px-3 text-right">New Base</th>
                    <th className="py-2.5 px-3 text-right">Promo / Discount</th>
                    <th className="py-2.5 px-3 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.map((item) => (
                    <tr key={item.room.room_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        <div>{item.room.room_name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.room.room_code}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500">
                        ₹{item.oldBase.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ₹{item.newBase.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {item.newDiscount !== null ? (
                          <span className="font-bold text-amber-700">
                            ₹{item.newDiscount.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {item.diff !== 0 ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              item.diff > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.diff > 0 ? "+" : ""}₹{item.diff} (
                            {item.diffPct > 0 ? "+" : ""}
                            {item.diffPct}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No change</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="text-xs text-slate-500">
            Affecting <strong className="text-slate-900">{previewData.length}</strong> room(s)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || previewData.length === 0}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold text-white transition disabled:opacity-50 shadow-xs ${
                createAsSeasonal
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              {isLoading ? (
                <span>{createAsSeasonal ? "Creating Seasonal Rules..." : "Applying Updates..."}</span>
              ) : createAsSeasonal ? (
                <>
                  <Calendar className="h-4 w-4" />
                  <span>Create Scheduled Seasonal Rules</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Execute Bulk Update</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkPricingModal;
