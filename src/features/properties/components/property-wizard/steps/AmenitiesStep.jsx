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

  // Initialize selected IDs from initialValues
  const [selectedIds, setSelectedIds] = useState(() => {
    if (Array.isArray(initialValues) && initialValues.length > 0) {
      return new Set(initialValues.map((item) => Number(item.amenity_id)));
    }
    return new Set();
  });

  // Master amenities catalog query
  const masterQuery = useMasterAmenities();
  const masterData = masterQuery.data?.data;
  const masterAmenities = useMemo(
    () => (Array.isArray(masterData) ? masterData : []),
    [masterData]
  );

  // Filter amenities by search term
  const filteredAmenities = useMemo(() => {
    if (!searchTerm.trim()) return masterAmenities;
    const term = searchTerm.toLowerCase().trim();
    return masterAmenities.filter(
      (a) =>
        a.amenity_name?.toLowerCase().includes(term) ||
        a.category_name?.toLowerCase().includes(term) ||
        a.amenity_description?.toLowerCase().includes(term)
    );
  }, [masterAmenities, searchTerm]);

  // Group filtered amenities by category
  const groupedAmenities = useMemo(() => {
    const groups = {};
    for (const item of filteredAmenities) {
      const cat = item.category_name || "General Amenities";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    }
    return groups;
  }, [filteredAmenities]);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const payload = Array.from(selectedIds).map((id) => ({
      amenity_id: id,
      is_available: true,
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

            <h2 className="text-xl font-semibold text-slate-900">
              Amenities
            </h2>

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

        <div className="text-sm font-medium text-slate-600">
          Selected: <span className="font-semibold text-emerald-700">{selectedIds.size}</span> amenities
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="mt-3 text-sm text-slate-500">Loading amenities catalog...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && masterAmenities.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
          <Sparkles className="mx-auto mb-2 h-8 w-8 text-slate-400" />
          <h3 className="text-base font-semibold text-slate-800">No amenities available</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Please contact the administrator to configure property amenities.
          </p>
        </div>
      )}

      {/* No Filter Results State */}
      {!isLoading && masterAmenities.length > 0 && filteredAmenities.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">
            No amenities match your search query "{searchTerm}".
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Amenities Grid Grouped by Category */}
      {!isLoading && Object.keys(groupedAmenities).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedAmenities).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {category} ({items.length})
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((amenity) => {
                  const isSelected = selectedIds.has(Number(amenity.amenity_id));
                  const Icon = getAmenityIcon(amenity.amenity_icon, amenity.amenity_name);

                  return (
                    <button
                      key={amenity.amenity_id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.amenity_id)}
                      className={[
                        "group relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150",
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isSelected
                            ? "bg-emerald-700 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "truncate text-sm font-medium leading-snug",
                            isSelected ? "font-semibold text-emerald-950" : "text-slate-800",
                          ].join(" ")}
                        >
                          {amenity.amenity_name}
                        </p>

                        {amenity.amenity_description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                            {amenity.amenity_description}
                          </p>
                        )}
                      </div>

                      {/* Selection Check Indicator */}
                      <div
                        className={[
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                          isSelected
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-slate-300 bg-white group-hover:border-slate-400",
                        ].join(" ")}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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
