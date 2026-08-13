import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";

import {
  defaultPolicyValues,
  propertyPolicySchema,
} from "../../../schemas/property.schema.js";

function normalizePolicyValues(initialValues = {}) {
  const merged = { ...defaultPolicyValues, ...(initialValues || {}) };
  return {
    ...merged,
    check_in_from: merged.check_in_from ?? "12:00",
    check_in_to: merged.check_in_to ?? "23:59",
    check_out_from: merged.check_out_from ?? "00:00",
    check_out_to: merged.check_out_to ?? "10:00",
    early_checkin_allowed: Boolean(merged.early_checkin_allowed ?? false),
    late_checkout_allowed: Boolean(merged.late_checkout_allowed ?? false),
    early_checkin_fee: merged.early_checkin_fee ?? 0,
    late_checkout_fee: merged.late_checkout_fee ?? 0,

    cancellation_policy: merged.cancellation_policy ?? "",
    free_cancellation_hours: merged.free_cancellation_hours ?? 48,
    refund_policy: merged.refund_policy ?? "",
    no_show_policy: merged.no_show_policy ?? "",

    id_proof_required: Boolean(merged.id_proof_required ?? true),
    unmarried_couples_allowed: Boolean(merged.unmarried_couples_allowed ?? true),
    local_ids_allowed: Boolean(merged.local_ids_allowed ?? true),
    foreign_guests_allowed: Boolean(merged.foreign_guests_allowed ?? true),

    children_allowed: Boolean(merged.children_allowed ?? true),
    child_age_limit: merged.child_age_limit ?? 6,
    child_policy: merged.child_policy ?? "",
    extra_bed_available: Boolean(merged.extra_bed_available ?? false),
    extra_bed_charge: merged.extra_bed_charge ?? 0,

    pets_allowed: Boolean(merged.pets_allowed ?? false),
    pet_policy: merged.pet_policy ?? "",
    pet_charges: merged.pet_charges ?? 0,

    smoking_allowed: Boolean(merged.smoking_allowed ?? false),
    smoking_policy: merged.smoking_policy ?? "",
    alcohol_allowed: Boolean(merged.alcohol_allowed ?? true),
    alcohol_policy: merged.alcohol_policy ?? "",
    outside_food_allowed: Boolean(merged.outside_food_allowed ?? true),
    outside_food_policy: merged.outside_food_policy ?? "",
    visitors_allowed: Boolean(merged.visitors_allowed ?? true),
    visitor_policy: merged.visitor_policy ?? "",
    parties_allowed: Boolean(merged.parties_allowed ?? false),
    party_policy: merged.party_policy ?? "",
    quiet_hours_start: merged.quiet_hours_start ?? "22:00",
    quiet_hours_end: merged.quiet_hours_end ?? "06:00",

    parking_available: Boolean(merged.parking_available ?? true),
    parking_charges: merged.parking_charges ?? 0,
    security_deposit_required: Boolean(merged.security_deposit_required ?? false),
    security_deposit_amount: merged.security_deposit_amount ?? 0,
  };
}

function PoliciesStep({
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
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(propertyPolicySchema),
    defaultValues: normalizePolicyValues(initialValues),
  });

  const watchEarlyCheckin = watch("early_checkin_allowed");
  const watchLateCheckout = watch("late_checkout_allowed");
  const watchExtraBed = watch("extra_bed_available");
  const watchPetsAllowed = watch("pets_allowed");
  const watchParkingAvailable = watch("parking_available");
  const watchSecurityDeposit = watch("security_deposit_required");

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(normalizePolicyValues(initialValues));
    }
  }, [initialValues, reset]);

  const handleValidSubmit = (data) => {
    const cleanedData = {
      ...data,
      early_checkin_fee: Number(data.early_checkin_fee || 0),
      late_checkout_fee: Number(data.late_checkout_fee || 0),
      free_cancellation_hours: Number(data.free_cancellation_hours || 0),
      child_age_limit: Number(data.child_age_limit || 0),
      extra_bed_charge: Number(data.extra_bed_charge || 0),
      pet_charges: Number(data.pet_charges || 0),
      parking_charges: Number(data.parking_charges || 0),
      security_deposit_amount: Number(data.security_deposit_amount || 0),
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
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 6
            </p>

            <h2 className="text-xl font-semibold text-slate-900">
              Policies
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define check-in/out times, cancellation rules, guest permissions, and house policies.
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

      {/* Section A: Check-In / Check-Out */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            A. Check-In & Check-Out Timings
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Set standard timings and fees for early check-in or late check-out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div>
            <label htmlFor="check_in_from" className="mb-2 block text-sm font-medium text-slate-700">
              Check-In From
            </label>
            <input
              id="check_in_from"
              type="time"
              {...register("check_in_from")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="check_in_to" className="mb-2 block text-sm font-medium text-slate-700">
              Check-In Until
            </label>
            <input
              id="check_in_to"
              type="time"
              {...register("check_in_to")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="check_out_from" className="mb-2 block text-sm font-medium text-slate-700">
              Check-Out From
            </label>
            <input
              id="check_out_from"
              type="time"
              {...register("check_out_from")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="check_out_to" className="mb-2 block text-sm font-medium text-slate-700">
              Check-Out Until
            </label>
            <input
              id="check_out_to"
              type="time"
              {...register("check_out_to")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("early_checkin_allowed")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Allow Early Check-In
            </label>

            {watchEarlyCheckin && (
              <div>
                <label htmlFor="early_checkin_fee" className="mb-1 block text-xs text-slate-600">
                  Early Check-In Fee (₹)
                </label>
                <input
                  id="early_checkin_fee"
                  type="number"
                  placeholder="0.00"
                  {...register("early_checkin_fee")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("late_checkout_allowed")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Allow Late Check-Out
            </label>

            {watchLateCheckout && (
              <div>
                <label htmlFor="late_checkout_fee" className="mb-1 block text-xs text-slate-600">
                  Late Check-Out Fee (₹)
                </label>
                <input
                  id="late_checkout_fee"
                  type="number"
                  placeholder="0.00"
                  {...register("late_checkout_fee")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section B: Cancellation & Refunds */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            B. Cancellation & Refund Rules
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Specify cancellation terms and free cancellation duration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="free_cancellation_hours" className="mb-2 block text-sm font-medium text-slate-700">
              Free Cancellation Window (Hours)
            </label>
            <input
              id="free_cancellation_hours"
              type="number"
              placeholder="e.g. 24, 48"
              {...register("free_cancellation_hours")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="cancellation_policy" className="mb-2 block text-sm font-medium text-slate-700">
              Cancellation Policy Description
            </label>
            <textarea
              id="cancellation_policy"
              rows={2}
              placeholder="Detail cancellation terms..."
              {...register("cancellation_policy")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="refund_policy" className="mb-2 block text-sm font-medium text-slate-700">
                Refund Policy
              </label>
              <textarea
                id="refund_policy"
                rows={2}
                placeholder="Explain refund terms and timelines..."
                {...register("refund_policy")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="no_show_policy" className="mb-2 block text-sm font-medium text-slate-700">
                No-Show Policy
              </label>
              <textarea
                id="no_show_policy"
                rows={2}
                placeholder="Charges for no-show guests..."
                {...register("no_show_policy")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Guest Rules & Identification */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            C. Guest Permissions & ID Requirements
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Guest eligibility rules and acceptable ID requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("id_proof_required")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            ID Proof Required
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("unmarried_couples_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Couples Allowed
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("local_ids_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Local IDs Allowed
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("foreign_guests_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Foreign Guests Allowed
          </label>
        </div>
      </section>

      {/* Section D: Children, Extra Beds & Pets */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            D. Children, Extra Beds & Pets
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Policies regarding extra occupants and domestic animals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Children Policy */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("children_allowed")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Children Allowed
            </label>

            <div>
              <label htmlFor="child_age_limit" className="mb-1 block text-xs text-slate-600">
                Free Stay Age Limit (Years)
              </label>
              <input
                id="child_age_limit"
                type="number"
                placeholder="6"
                {...register("child_age_limit")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Extra Bed Policy */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("extra_bed_available")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Extra Bed Available
            </label>

            {watchExtraBed && (
              <div>
                <label htmlFor="extra_bed_charge" className="mb-1 block text-xs text-slate-600">
                  Extra Bed Charge (₹)
                </label>
                <input
                  id="extra_bed_charge"
                  type="number"
                  placeholder="0.00"
                  {...register("extra_bed_charge")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Pet Policy */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("pets_allowed")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Pets Allowed
            </label>

            {watchPetsAllowed && (
              <div>
                <label htmlFor="pet_charges" className="mb-1 block text-xs text-slate-600">
                  Pet Charges (₹)
                </label>
                <input
                  id="pet_charges"
                  type="number"
                  placeholder="0.00"
                  {...register("pet_charges")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section E: House Rules */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            E. House Rules
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Specific property conduct guidelines and quiet hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("smoking_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Smoking Allowed
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("alcohol_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Alcohol Allowed
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("outside_food_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Outside Food Allowed
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("visitors_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Visitors Allowed
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50">
            <input
              type="checkbox"
              {...register("parties_allowed")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
            />
            Parties / Events Allowed
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="quiet_hours_start" className="mb-2 block text-sm font-medium text-slate-700">
              Quiet Hours Start
            </label>
            <input
              id="quiet_hours_start"
              type="time"
              {...register("quiet_hours_start")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="quiet_hours_end" className="mb-2 block text-sm font-medium text-slate-700">
              Quiet Hours End
            </label>
            <input
              id="quiet_hours_end"
              type="time"
              {...register("quiet_hours_end")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Section F: Parking & Security Deposit */}
      <section className="space-y-5 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            F. Parking & Security Deposit
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Vehicle parking options and damage security deposit terms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("parking_available")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Parking Available
            </label>

            {watchParkingAvailable && (
              <div>
                <label htmlFor="parking_charges" className="mb-1 block text-xs text-slate-600">
                  Parking Charges (₹)
                </label>
                <input
                  id="parking_charges"
                  type="number"
                  placeholder="0.00"
                  {...register("parking_charges")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                {...register("security_deposit_required")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Security Deposit Required
            </label>

            {watchSecurityDeposit && (
              <div>
                <label htmlFor="security_deposit_amount" className="mb-1 block text-xs text-slate-600">
                  Security Deposit Amount (₹)
                </label>
                <input
                  id="security_deposit_amount"
                  type="number"
                  placeholder="0.00"
                  {...register("security_deposit_amount")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            )}
          </div>
        </div>
      </section>

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

export default PoliciesStep;
