import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Coffee,
  Search,
  Sparkles,
  Tv,
  Wifi,
  Wind,
} from "lucide-react";

import { useMasterAmenities } from "../../../hooks/usePropertyAmenities.js";

// Helper function to pick a Lucide icon based on amenity name/icon string
function getAmenityIcon(iconName, amenityName = "") {
  const name = (amenityName || iconName || "").toLowerCase();
  if (name.includes("wifi") || name.includes("internet")) return Wifi;
  if (name.includes("tv") || name.includes("television")) return Tv;
  if (name.includes("ac") || name.includes("air") || name.includes("cooler")) return Wind;
  if (name.includes("coffee") || name.includes("tea") || name.includes("breakfast")) return Coffee;
  return Sparkles;
}

function AmenitiesStep({
  initialValues = [],
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
  serverError = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Amenities");

  // Initialize selected IDs from initialValues
  const [selectedIds, setSelectedIds] = useState(() => {
    if (Array.isArray(initialValues) && initialValues.length > 0) {
      return new Set(initialValues.map((item) => Number(item.amenity_id)));
    }
    return new Set();
  });

  // Initialize remarks mapping from initialValues
  const [remarks, setRemarks] = useState(() => {
    const init = {};
    if (Array.isArray(initialValues) && initialValues.length > 0) {
      initialValues.forEach((item) => {
        if (item.remarks) init[Number(item.amenity_id)] = item.remarks;
      });
    }
    return init;
  });

  // Master amenities catalog query
  const masterQuery = useMasterAmenities();
  const masterData = masterQuery.data?.data;
  const masterAmenities = useMemo(
    () => (Array.isArray(masterData) ? masterData : []),
    [masterData]
  );

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set();
    masterAmenities.forEach((a) => {
      cats.add(a.category_name || "General Amenities");
    });
    return ["All Amenities", ...Array.from(cats).sort()];
  }, [masterAmenities]);

  // Filter amenities by search term and selected category
  const filteredAmenities = useMemo(() => {
    let result = masterAmenities;

    if (selectedCategory !== "All Amenities") {
      result = result.filter(
        (a) => (a.category_name || "General Amenities") === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.amenity_name?.toLowerCase().includes(term) ||
          a.category_name?.toLowerCase().includes(term) ||
          a.amenity_description?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [masterAmenities, searchTerm, selectedCategory]);

  const toggleAmenity = (amenityId) => {
    const id = Number(amenityId);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectPopular = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      masterAmenities.forEach((a) => {
        if (a.is_popular) next.add(Number(a.amenity_id));
      });
      return next;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const payload = Array.from(selectedIds).map((id) => ({
      amenity_id: id,
      is_available: true,
      remarks: remarks[id] || "",
    }));

    if (typeof onSubmit === "function") {
      onSubmit(payload);
    }
  };

  const isLoading = masterQuery.isLoading;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8" noValidate>
      {/* Header */}
      <section>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 4
            </p>

            <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the facilities and services available at your property.
            </p>
          </div>
        </div>
      </section>

      {/* Server Error Alert */}
      {serverError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* Search & Selected Count Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search amenities..."
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 items-center justify-center rounded-lg bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 border border-emerald-100">
            {selectedIds.size} amenities selected
          </div>
          <button
            type="button"
            onClick={handleSelectPopular}
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Select popular
          </button>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading amenities catalog...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && masterAmenities.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
          <Sparkles className="mx-auto mb-2 h-8 w-8 text-slate-400" />
          <h3 className="text-base font-semibold text-slate-800">
            No amenities available
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Please contact the administrator to configure property amenities.
          </p>
        </div>
      )}

      {/* Layout Grid */}
      {!isLoading && masterAmenities.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-56 xl:w-64 shrink-0">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              Categories
            </h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={[
                      "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors",
                      selectedCategory === cat
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main List */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Available Amenities
              </h3>
              <p className="text-xs text-slate-400">
                Availability + optional remarks
              </p>
            </div>

            <div className="space-y-3">
              {filteredAmenities.map((amenity) => {
                const isSelected = selectedIds.has(Number(amenity.amenity_id));
                const Icon = getAmenityIcon(
                  amenity.amenity_icon,
                  amenity.amenity_name
                );

                return (
                  <div
                    key={amenity.amenity_id}
                    className={[
                      "flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-4 transition-all duration-150",
                      isSelected
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-slate-200 bg-white",
                    ].join(" ")}
                  >
                    {/* Left: Checkbox & Info */}
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleAmenity(amenity.amenity_id)}
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all",
                          isSelected
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-slate-300 bg-white hover:border-slate-400",
                        ].join(" ")}
                        aria-label={`Toggle ${amenity.amenity_name}`}
                      >
                        {isSelected && (
                          <Check className="h-4 w-4 stroke-[3]" />
                        )}
                      </button>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hidden sm:flex">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {amenity.amenity_name}
                        </p>
                        {amenity.is_popular ? (
                          <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Popular amenity
                          </p>
                        ) : amenity.amenity_description ? (
                          <p className="truncate text-xs text-slate-500 mt-0.5">
                            {amenity.amenity_description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: Remarks Input */}
                    <div className="w-full sm:w-64 shrink-0">
                      <input
                        type="text"
                        value={remarks[amenity.amenity_id] || ""}
                        onChange={(e) =>
                          handleRemarkChange(
                            amenity.amenity_id,
                            e.target.value
                          )
                        }
                        placeholder="Add remarks (optional)"
                        className={[
                          "w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1",
                          isSelected
                            ? "border-emerald-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                            : "border-slate-100 bg-slate-50 text-slate-400 placeholder:text-slate-300 cursor-not-allowed",
                        ].join(" ")}
                        disabled={!isSelected}
                      />
                    </div>
                  </div>
                );
              })}

              {filteredAmenities.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No amenities found for the selected criteria.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-500">
                Selected amenities can store availability and property-specific
                remarks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
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
          {!isSubmitting && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}

export default AmenitiesStep;
