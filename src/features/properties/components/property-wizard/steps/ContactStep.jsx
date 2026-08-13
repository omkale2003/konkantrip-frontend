import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronRight, PhoneCall } from "lucide-react";

import {
  defaultContactValues,
  propertyContactSchema,
} from "../../../schemas/property.schema.js";
import { useContactTypes } from "../../../hooks/usePropertyContacts.js";

const DEFAULT_CONTACT_TYPES = [
  { contact_type_id: 1, contact_type_name: "Manager" },
  { contact_type_id: 2, contact_type_name: "Front Desk" },
  { contact_type_id: 3, contact_type_name: "Reservations" },
  { contact_type_id: 4, contact_type_name: "Owner" },
  { contact_type_id: 5, contact_type_name: "Billing" },
  { contact_type_id: 6, contact_type_name: "Emergency" },
];

function normalizeContactValues(initialValues = {}) {
  const merged = { ...defaultContactValues, ...(initialValues || {}) };
  return {
    ...merged,
    contact_type_id: merged.contact_type_id ?? 1,
    contact_name: merged.contact_name ?? "",
    designation: merged.designation ?? "",
    mobile_number: merged.mobile_number ?? "",
    alternate_number: merged.alternate_number ?? "",
    whatsapp_number: merged.whatsapp_number ?? "",
    email: merged.email ?? "",
    website: merged.website ?? merged.website_url ?? "",
    is_primary: Boolean(merged.is_primary ?? true),
  };
}

function ContactStep({
  initialValues = {},
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
  serverError = "",
}) {
  const { data: contactTypesRes } = useContactTypes();
  const contactTypes =
    contactTypesRes?.data && contactTypesRes.data.length > 0
      ? contactTypesRes.data
      : DEFAULT_CONTACT_TYPES;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyContactSchema),
    defaultValues: normalizeContactValues(initialValues),
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(normalizeContactValues(initialValues));
    }
  }, [initialValues, reset]);

  const handleValidSubmit = (data) => {
    const cleanedData = {
      ...data,
      contact_name: data.contact_name?.trim(),
      designation: data.designation?.trim() || undefined,
      mobile_number: data.mobile_number?.trim() || undefined,
      alternate_number: data.alternate_number?.trim() || undefined,
      whatsapp_number: data.whatsapp_number?.trim() || undefined,
      email: data.email?.trim() || undefined,
      website: data.website?.trim() || undefined,
      contact_type_id: Number(data.contact_type_id || 1),
      is_primary: Boolean(data.is_primary ?? true),
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
            <PhoneCall className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 3
            </p>

            <h2 className="text-xl font-semibold text-slate-900">
              Contact
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide the contact details guests and KonkanTrip&trade; can use to reach your property.
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

      {/* Section A: Primary Contact */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            A. Contact Person Details
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Name and designation of the property manager or primary contact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Contact Name */}
          <div>
            <label
              htmlFor="contact_name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Contact Name <span className="text-red-500">*</span>
            </label>

            <input
              id="contact_name"
              type="text"
              placeholder="e.g. Ramesh Patil / Front Desk Team"
              {...register("contact_name")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.contact_name
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.contact_name && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.contact_name.message}
              </p>
            )}
          </div>

          {/* Contact Type */}
          <div>
            <label
              htmlFor="contact_type_id"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Contact Role / Type
            </label>

            <select
              id="contact_type_id"
              {...register("contact_type_id")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {contactTypes.map((type) => (
                <option
                  key={type.contact_type_id}
                  value={type.contact_type_id}
                >
                  {type.contact_type_name}
                </option>
              ))}
            </select>

            {errors.contact_type_id && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.contact_type_id.message}
              </p>
            )}
          </div>

          {/* Designation */}
          <div className="md:col-span-2">
            <label
              htmlFor="designation"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Designation / Role Title
            </label>

            <input
              id="designation"
              type="text"
              placeholder="e.g. Property Manager, Resort Supervisor, Owner"
              {...register("designation")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </section>

      {/* Section B: Phone & Communication */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            B. Phone Numbers
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Direct phone numbers for guest enquiries and booking updates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile_number"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Primary Mobile
            </label>

            <input
              id="mobile_number"
              type="tel"
              placeholder="10-digit mobile number"
              {...register("mobile_number")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.mobile_number
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.mobile_number && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.mobile_number.message}
              </p>
            )}
          </div>

          {/* Alternate Number */}
          <div>
            <label
              htmlFor="alternate_number"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Alternate Number
            </label>

            <input
              id="alternate_number"
              type="tel"
              placeholder="Secondary / Landline"
              {...register("alternate_number")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.alternate_number
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.alternate_number && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.alternate_number.message}
              </p>
            )}
          </div>

          {/* WhatsApp Number */}
          <div>
            <label
              htmlFor="whatsapp_number"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              WhatsApp Number
            </label>

            <input
              id="whatsapp_number"
              type="tel"
              placeholder="WhatsApp number"
              {...register("whatsapp_number")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.whatsapp_number
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.whatsapp_number && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.whatsapp_number.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section C: Email & Online */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            C. Email & Website
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Digital contact methods for your property.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="property@example.com"
              {...register("email")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Website URL
            </label>

            <input
              id="website"
              type="url"
              placeholder="https://www.yourproperty.com"
              {...register("website")}
              className={[
                "w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                errors.website
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-emerald-600",
              ].join(" ")}
            />

            {errors.website && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.website.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Validation Summary if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Please fix the highlighted fields before continuing.
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

export default ContactStep;
