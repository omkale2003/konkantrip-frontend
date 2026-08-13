import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronRight, Info, ShieldCheck } from "lucide-react";

import {
  PROPERTY_CATEGORIES,
  PROPERTY_TYPES,
  PRICE_DISPLAY_TYPES,
  propertyBasicDetailsSchema,
  defaultBasicDetailsValues,
} from "../../../schemas/property.schema.js";

const PROPERTY_TYPE_CONFIG = {
  Hotel: {
    allowStarRating: true,
    totalFloorsRequired: true,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Night"],
    forcedPriceDisplayType: "Per Night",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star rating (1–5 stars) applies to commercial hotels and resorts.",
    floorsTooltip: "Total floors count is required for commercial hotels and resorts.",
  },
  Resort: {
    allowStarRating: true,
    totalFloorsRequired: true,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Night"],
    forcedPriceDisplayType: "Per Night",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star rating (1–5 stars) applies to commercial hotels and resorts.",
    floorsTooltip: "Total floors count is required for commercial hotels and resorts.",
  },
  Villa: {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: true,
    forcedTotalRooms: 1,
    priceDisplayTypeOptions: ["Entire Property"],
    forcedPriceDisplayType: "Entire Property",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts. For villas, rating is calculated from verified guest reviews.",
    totalRoomsTooltip: "Entire villa listing count is fixed at 1 unit.",
    priceDisplayTooltip: "Villas are rented out as an entire property.",
  },
  Bungalow: {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: true,
    forcedTotalRooms: 1,
    priceDisplayTypeOptions: ["Entire Property"],
    forcedPriceDisplayType: "Entire Property",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    totalRoomsTooltip: "Entire bungalow unit count is set to 1.",
    priceDisplayTooltip: "Bungalows are rented out as an entire property.",
  },
  "Beach House": {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: true,
    forcedTotalRooms: 1,
    priceDisplayTypeOptions: ["Entire Property"],
    forcedPriceDisplayType: "Entire Property",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    totalRoomsTooltip: "Entire beach house count is set to 1.",
    priceDisplayTooltip: "Beach houses are rented out as an entire property.",
  },
  Apartment: {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: true,
    forcedTotalRooms: 1,
    priceDisplayTypeOptions: ["Entire Property"],
    forcedPriceDisplayType: "Entire Property",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    totalRoomsTooltip: "Entire apartment unit count is set to 1.",
    priceDisplayTooltip: "Apartments are rented out as an entire property.",
  },
  Homestay: {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Night", "Per Person"],
    showYears: true,
    defaultInstantBooking: false,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
  },
  Cottage: {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Night", "Per Person"],
    showYears: true,
    defaultInstantBooking: false,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
  },
  "Farm Stay": {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Night", "Per Person"],
    showYears: true,
    defaultInstantBooking: false,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
  },
  "Guest House": {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Night", "Per Person"],
    showYears: true,
    defaultInstantBooking: false,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
  },
  Tent: {
    allowStarRating: false,
    totalFloorsDisabled: true,
    forcedTotalFloors: 0,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Person", "Per Night"],
    showYears: false,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    totalFloorsTooltip: "Floors are not applicable for outdoor tent setups.",
    showYearsTooltip: "Construction & renovation years are hidden for outdoor tent setups.",
  },
  Camping: {
    allowStarRating: false,
    totalFloorsDisabled: true,
    forcedTotalFloors: 0,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Person", "Per Night"],
    showYears: false,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    totalFloorsTooltip: "Floors are not applicable for outdoor camping setups.",
    showYearsTooltip: "Construction & renovation years are hidden for camping setups.",
  },
  Houseboat: {
    allowStarRating: false,
    totalFloorsDisabled: true,
    forcedTotalFloors: 1,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Entire Property", "Per Night"],
    showYears: true,
    defaultInstantBooking: false,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    totalFloorsTooltip: "Houseboats are configured with 1 deck floor level.",
  },
  Hostel: {
    allowStarRating: false,
    totalFloorsDisabled: false,
    totalRoomsDisabled: false,
    priceDisplayTypeOptions: ["Per Person"],
    forcedPriceDisplayType: "Per Person",
    showYears: true,
    defaultInstantBooking: true,
    starRatingTooltip: "Star ratings apply to commercial hotels and resorts.",
    priceDisplayTooltip: "Hostels operate on a per-person dorm bed pricing model.",
  },
};

function normalizeBasicDetailsValues(initialValues = {}) {
  const merged = { ...defaultBasicDetailsValues, ...(initialValues || {}) };
  return {
    ...merged,
    property_name: merged.property_name ?? "",
    property_type: merged.property_type ?? "",
    property_category: merged.property_category ?? "Standard",
    short_description: merged.short_description ?? "",
    property_description: merged.property_description ?? "",
    star_rating: merged.star_rating ?? 0,
    check_in_time: merged.check_in_time ?? "12:00",
    check_out_time: merged.check_out_time ?? "10:00",
    total_rooms: merged.total_rooms ?? 0,
    total_floors: merged.total_floors ?? 0,
    built_year: merged.built_year ?? "",
    renovated_year: merged.renovated_year ?? "",
    currency_code: merged.currency_code ?? "INR",
    price_display_type: merged.price_display_type ?? "Per Night",
    instant_booking: Boolean(merged.instant_booking ?? true),
  };
}

function BasicDetailsStep({
  initialValues = {},
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyBasicDetailsSchema),
    defaultValues: normalizeBasicDetailsValues(initialValues),
  });

  const selectedType = watch("property_type");
  const config = PROPERTY_TYPE_CONFIG[selectedType] || {};

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(normalizeBasicDetailsValues(initialValues));
    }
  }, [initialValues, reset]);

  // State Resetting & Dynamic Defaults on Property Type Change
  useEffect(() => {
    if (!selectedType) return;
    const typeConfig = PROPERTY_TYPE_CONFIG[selectedType];
    if (!typeConfig) return;

    if (!typeConfig.allowStarRating) {
      setValue("star_rating", 0);
    }
    if (typeConfig.totalFloorsDisabled && typeConfig.forcedTotalFloors !== undefined) {
      setValue("total_floors", typeConfig.forcedTotalFloors);
    }
    if (typeConfig.totalRoomsDisabled && typeConfig.forcedTotalRooms !== undefined) {
      setValue("total_rooms", typeConfig.forcedTotalRooms);
    }
    if (typeConfig.forcedPriceDisplayType) {
      setValue("price_display_type", typeConfig.forcedPriceDisplayType);
    }
    if (typeConfig.showYears === false) {
      setValue("built_year", "");
      setValue("renovated_year", "");
    }
  }, [selectedType, setValue]);

  const handleValidSubmit = (data) => {
    const cleanedData = {
      ...data,
      property_name: data.property_name?.trim(),
      property_type: data.property_type,
      property_category: data.property_category || undefined,
      short_description: data.short_description?.trim() || undefined,
      property_description: data.property_description?.trim() || undefined,
      check_in_time: data.check_in_time || undefined,
      check_out_time: data.check_out_time || undefined,
      price_display_type: data.price_display_type || undefined,
      star_rating: config.allowStarRating ? Number(data.star_rating || 0) : 0,
      total_rooms:
        config.totalRoomsDisabled
          ? (config.forcedTotalRooms ?? 1)
          : (data.total_rooms === "" || data.total_rooms === undefined || data.total_rooms === null
            ? undefined
            : Number(data.total_rooms)),
      total_floors:
        config.totalFloorsDisabled
          ? (config.forcedTotalFloors ?? 0)
          : (data.total_floors === "" || data.total_floors === undefined || data.total_floors === null
            ? undefined
            : Number(data.total_floors)),
      built_year:
        config.showYears === false || data.built_year === "" || data.built_year === undefined || data.built_year === null
          ? undefined
          : Number(data.built_year),
      renovated_year:
        config.showYears === false || data.renovated_year === "" || data.renovated_year === undefined || data.renovated_year === null
          ? undefined
          : Number(data.renovated_year),
    };

    if (typeof onSubmit === "function") {
      onSubmit(cleanedData);
    }
  };

  const priceOptions = config.priceDisplayTypeOptions || PRICE_DISPLAY_TYPES;

  return (
    <form
      onSubmit={handleSubmit(handleValidSubmit)}
      className="space-y-8"
      noValidate
    >
      {/* Admin Protection Badges (Read-Only Status Information) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Moderation & Verification Badges (Read-Only Status)
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              initialValues?.property_status === "Approved"
                ? "bg-emerald-100 text-emerald-800"
                : initialValues?.property_status === "Pending"
                ? "bg-amber-100 text-amber-800"
                : initialValues?.property_status === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            Status: {initialValues?.property_status || "Draft"}
          </span>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              initialValues?.is_verified
                ? "bg-blue-100 text-blue-800"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {initialValues?.is_verified ? "✓ Verified Listing" : "Unverified Listing"}
          </span>

          {initialValues?.is_featured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              ★ Featured Property
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          BASIC INFORMATION
      ====================================================== */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Basic Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tell us the basic information about your property.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Property Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="property_name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Property Name{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="property_name"
              type="text"
              placeholder="Enter your property name"
              {...register("property_name")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3",
                "text-sm text-slate-900 outline-none transition",
                "focus:ring-2 focus:ring-emerald-100",
                errors.property_name
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.property_name && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.property_name.message}
              </p>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label
              htmlFor="property_type"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Property Type{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              id="property_type"
              {...register("property_type")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3",
                "text-sm text-slate-900 outline-none transition",
                "focus:ring-2 focus:ring-emerald-100",
                errors.property_type
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            >
              <option value="">
                Select property type
              </option>

              {PROPERTY_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            {errors.property_type && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.property_type.message}
              </p>
            )}
          </div>

          {/* Property Category */}
          <div>
            <label
              htmlFor="property_category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Property Category
            </label>

            <select
              id="property_category"
              {...register("property_category")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {PROPERTY_CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            {errors.property_category && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.property_category.message}
              </p>
            )}
          </div>

          {/* Star Rating (Dynamic Matrix: Enabled only for Hotel/Resort) */}
          <div className="md:col-span-2">
            <label
              htmlFor="star_rating"
              className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700"
            >
              <span>Star Rating (Commercial Hotels & Resorts)</span>
              {config.starRatingTooltip && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-normal">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  {config.starRatingTooltip}
                </span>
              )}
            </label>

            <select
              id="star_rating"
              disabled={!config.allowStarRating}
              {...register("star_rating")}
              className={[
                "w-full rounded-lg border px-4 py-3 text-sm transition outline-none",
                !config.allowStarRating
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-900 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            >
              <option value={0}>N/A (Not Applicable)</option>
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>

            {!config.allowStarRating && selectedType && (
              <p className="mt-1 text-xs text-slate-500">
                Star rating is disabled for {selectedType}. Verified guest ratings will apply automatically.
              </p>
            )}

            {errors.star_rating && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.star_rating.message}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="short_description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Short Description
            </label>

            <input
              id="short_description"
              type="text"
              placeholder="A short tagline or summary of your property"
              {...register("short_description")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {errors.short_description && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.short_description.message}
              </p>
            )}
          </div>

          {/* Property Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="property_description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Property Description
            </label>

            <textarea
              id="property_description"
              rows={5}
              placeholder="Describe your property, facilities and overall experience..."
              {...register("property_description")}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {errors.property_description && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.property_description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROPERTY CONFIGURATION
      ====================================================== */}
      <section className="border-t border-slate-200 pt-8">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Property Configuration
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add operational details based on your property type.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Rooms */}
          <div>
            <label
              htmlFor="total_rooms"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Total Units / Rooms {config.totalFloorsRequired && <span className="text-red-500">*</span>}
            </label>

            <input
              id="total_rooms"
              type="number"
              min="0"
              step="1"
              disabled={config.totalRoomsDisabled}
              {...register("total_rooms")}
              className={[
                "w-full rounded-lg border px-4 py-3 text-sm outline-none transition",
                config.totalRoomsDisabled
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-900 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
                errors.total_rooms ? "border-red-400" : "",
              ].join(" ")}
            />

            {config.totalRoomsTooltip && (
              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                {config.totalRoomsTooltip}
              </p>
            )}

            {errors.total_rooms && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.total_rooms.message}
              </p>
            )}
          </div>

          {/* Total Floors */}
          <div>
            <label
              htmlFor="total_floors"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Total Floors {config.totalFloorsRequired && <span className="text-red-500">*</span>}
            </label>

            <input
              id="total_floors"
              type="number"
              min="0"
              step="1"
              disabled={config.totalFloorsDisabled}
              {...register("total_floors")}
              className={[
                "w-full rounded-lg border px-4 py-3 text-sm outline-none transition",
                config.totalFloorsDisabled
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-900 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
                errors.total_floors ? "border-red-400" : "",
              ].join(" ")}
            />

            {config.totalFloorsTooltip && (
              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                {config.totalFloorsTooltip}
              </p>
            )}

            {errors.total_floors && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.total_floors.message}
              </p>
            )}
          </div>

          {/* Price Display */}
          <div>
            <label
              htmlFor="price_display_type"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Price Display
            </label>

            <select
              id="price_display_type"
              disabled={Boolean(config.forcedPriceDisplayType)}
              {...register("price_display_type")}
              className={[
                "w-full rounded-lg border px-4 py-3 text-sm outline-none transition",
                config.forcedPriceDisplayType
                  ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-900 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
              ].join(" ")}
            >
              {priceOptions.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            {config.priceDisplayTooltip && (
              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                {config.priceDisplayTooltip}
              </p>
            )}

            {errors.price_display_type && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.price_display_type.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CHECK-IN / CHECK-OUT
      ====================================================== */}
      <section className="border-t border-slate-200 pt-8">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Check-in & Check-out
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set the standard arrival and departure times (Defaults: 12:00 Check-in, 10:00 Check-out).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Check-in */}
          <div>
            <label
              htmlFor="check_in_time"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Check-in Time
            </label>

            <input
              id="check_in_time"
              type="time"
              {...register("check_in_time")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {errors.check_in_time && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.check_in_time.message}
              </p>
            )}
          </div>

          {/* Check-out */}
          <div>
            <label
              htmlFor="check_out_time"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Check-out Time
            </label>

            <input
              id="check_out_time"
              type="time"
              {...register("check_out_time")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {errors.check_out_time && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.check_out_time.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROPERTY HISTORY (Hidden for Tents/Camping)
      ====================================================== */}
      {config.showYears !== false ? (
        <section className="border-t border-slate-200 pt-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Property History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add construction and renovation information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Built Year */}
            <div>
              <label
                htmlFor="built_year"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Built Year
              </label>

              <input
                id="built_year"
                type="number"
                min="1000"
                max="9999"
                placeholder="e.g. 2020"
                {...register("built_year")}
                className={[
                  "w-full rounded-lg border bg-white px-4 py-3",
                  "text-sm text-slate-900 outline-none transition",
                  "focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
                  errors.built_year ? "border-red-400" : "border-slate-300",
                ].join(" ")}
              />

              {errors.built_year && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.built_year.message}
                </p>
              )}
            </div>

            {/* Renovated Year */}
            <div>
              <label
                htmlFor="renovated_year"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Renovated Year
              </label>

              <input
                id="renovated_year"
                type="number"
                min="1000"
                max="9999"
                placeholder="e.g. 2024"
                {...register("renovated_year")}
                className={[
                  "w-full rounded-lg border bg-white px-4 py-3",
                  "text-sm text-slate-900 outline-none transition",
                  "focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
                  errors.renovated_year ? "border-red-400" : "border-slate-300",
                ].join(" ")}
              />

              {errors.renovated_year && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.renovated_year.message}
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-400 shrink-0" />
          <span>Property History (Built & Renovated year) is hidden for {selectedType} listings.</span>
        </div>
      )}

      {/* =====================================================
          BOOKING SETTINGS
      ====================================================== */}
      <section className="border-t border-slate-200 pt-8">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Booking Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure how guests can book your property.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Instant Booking
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Allow guests to book without manual host confirmation.
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              {...register("instant_booking")}
              className="peer sr-only"
            />

            <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 peer-focus:ring-2 peer-focus:ring-emerald-200" />

            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        </div>

        {errors.instant_booking && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.instant_booking.message}
          </p>
        )}
      </section>

      {/* =====================================================
          ACTIONS
      ====================================================== */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <div>
          {typeof onBack === "function" && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditingFromReview
            ? "Save Changes"
            : "Save & Continue"}

          {!isSubmitting && (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}

export default BasicDetailsStep;