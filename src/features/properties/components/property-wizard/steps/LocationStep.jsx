import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";

import {
  defaultLocationValues,
  propertyLocationSchema,
} from "../../../schemas/property.schema.js";

function normalizeLocationValues(initialValues = {}) {
  const merged = { ...defaultLocationValues, ...(initialValues || {}) };
  return {
    ...merged,
    address_line1: merged.address_line1 ?? "",
    address_line2: merged.address_line2 ?? "",
    landmark: merged.landmark ?? "",
    village: merged.village ?? "",
    taluka: merged.taluka ?? "",
    district: merged.district ?? "",
    city: merged.city ?? "",
    state: merged.state ?? "Maharashtra",
    country: merged.country ?? "India",
    postal_code: merged.postal_code ?? "",
    latitude: merged.latitude ?? "",
    longitude: merged.longitude ?? "",
    google_map_url: merged.google_map_url ?? "",
  };
}

function LocationStep({
  initialValues = {},
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
  serverError = "",
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyLocationSchema),
    defaultValues: normalizeLocationValues(initialValues),
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(normalizeLocationValues(initialValues));
    }
  }, [initialValues, reset]);

  const handleValidSubmit = (data) => {
    const cleanedData = {
      ...data,
      address_line1: data.address_line1?.trim(),
      address_line2: data.address_line2?.trim() || undefined,
      landmark: data.landmark?.trim() || undefined,
      village: data.village?.trim() || undefined,
      taluka: data.taluka?.trim() || undefined,
      district: data.district?.trim() || undefined,
      city: data.city?.trim() || undefined,
      state: data.state?.trim() || undefined,
      country: data.country?.trim() || undefined,
      postal_code: data.postal_code?.trim() || undefined,
      google_map_url: data.google_map_url?.trim() || undefined,
      latitude:
        data.latitude === "" || data.latitude === undefined || data.latitude === null
          ? undefined
          : Number(data.latitude),
      longitude:
        data.longitude === "" || data.longitude === undefined || data.longitude === null
          ? undefined
          : Number(data.longitude),
    };

    if (typeof onSubmit === "function") {
      onSubmit(cleanedData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleValidSubmit)}
      className="space-y-8"
      noValidate
    >
      {/* Header */}
      <section>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 2
            </p>

            <h2 className="text-xl font-semibold text-slate-900">
              Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the complete location details of your property.
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

      {/* Section A: Address */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            A. Address
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Street address and landmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Address Line 1 */}
          <div className="md:col-span-2">
            <label
              htmlFor="address_line1"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address Line 1 <span className="text-red-500">*</span>
            </label>

            <input
              id="address_line1"
              type="text"
              placeholder="Building name, house no., street address"
              {...register("address_line1")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.address_line1
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.address_line1 && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.address_line1.message}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="md:col-span-2">
            <label
              htmlFor="address_line2"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address Line 2
            </label>

            <input
              id="address_line2"
              type="text"
              placeholder="Apartment, suite, unit, floor, etc. (optional)"
              {...register("address_line2")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Landmark */}
          <div className="md:col-span-2">
            <label
              htmlFor="landmark"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Landmark
            </label>

            <input
              id="landmark"
              type="text"
              placeholder="Nearby landmark (e.g. Near Beach Road / Behind Temple)"
              {...register("landmark")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </section>

      {/* Section B: Location Details */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            B. Location Details
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Region, city, and administrative zone details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {/* Village */}
          <div>
            <label
              htmlFor="village"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Village
            </label>

            <input
              id="village"
              type="text"
              placeholder="Village"
              {...register("village")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Taluka */}
          <div>
            <label
              htmlFor="taluka"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Taluka
            </label>

            <input
              id="taluka"
              type="text"
              placeholder="Taluka / Tehsil"
              {...register("taluka")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* District */}
          <div>
            <label
              htmlFor="district"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              District
            </label>

            <input
              id="district"
              type="text"
              placeholder="District (e.g. Ratnagiri, Sindhudurg)"
              {...register("district")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              City
            </label>

            <input
              id="city"
              type="text"
              placeholder="City"
              {...register("city")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              State
            </label>

            <input
              id="state"
              type="text"
              placeholder="State"
              {...register("state")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              placeholder="Country"
              {...register("country")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Postal Code */}
          <div className="sm:col-span-2 md:col-span-1">
            <label
              htmlFor="postal_code"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Postal Code
            </label>

            <input
              id="postal_code"
              type="text"
              maxLength={6}
              placeholder="6-digit PIN code (e.g. 415712)"
              {...register("postal_code")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.postal_code
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.postal_code && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.postal_code.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section C: Map Location */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            C. Map Location
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Coordinates and Google Maps links (optional).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Latitude */}
          <div>
            <label
              htmlFor="latitude"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Latitude
            </label>

            <input
              id="latitude"
              type="number"
              step="any"
              placeholder="e.g. 17.8312"
              {...register("latitude")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.latitude
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.latitude && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.latitude.message}
              </p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label
              htmlFor="longitude"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Longitude
            </label>

            <input
              id="longitude"
              type="number"
              step="any"
              placeholder="e.g. 73.1888"
              {...register("longitude")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.longitude
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.longitude && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.longitude.message}
              </p>
            )}
          </div>

          {/* Google Maps URL */}
          <div className="sm:col-span-2">
            <label
              htmlFor="google_map_url"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Google Maps URL
            </label>

            <input
              id="google_map_url"
              type="url"
              placeholder="https://maps.google.com/..."
              {...register("google_map_url")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.google_map_url
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.google_map_url && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.google_map_url.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Validation Summary if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Please fix the highlighted errors before continuing.
          </p>
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

export default LocationStep;