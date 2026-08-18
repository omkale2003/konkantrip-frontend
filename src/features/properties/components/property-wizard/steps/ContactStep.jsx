import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
} from "lucide-react";

import {
  defaultContactValues,
  propertyContactSchema,
} from "../../../schemas/property.schema.js";
import {
  useContactTypes,
  usePropertyContacts,
  useSavePropertyContact,
  useDeletePropertyContact,
} from "../../../hooks/usePropertyContacts.js";

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
  propertyId,
  initialValues = {},
  onSubmit,
  onBack,
  isEditingFromReview = false,
  isSubmitting = false,
  serverError = "",
}) {
  const [editingContactId, setEditingContactId] = useState(null);
  const [localServerError, setLocalServerError] = useState("");

  // Fetch contact types lookup
  const { data: contactTypesRes } = useContactTypes();
  const contactTypes =
    contactTypesRes?.data && contactTypesRes.data.length > 0
      ? contactTypesRes.data
      : DEFAULT_CONTACT_TYPES;

  // Fetch live property contacts from backend
  const contactsQuery = usePropertyContacts(propertyId);
  const propertyContactsRes = contactsQuery?.data;
  const isLoadingContacts = Boolean(contactsQuery?.isLoading);
  const savedContacts = Array.isArray(propertyContactsRes?.data) ? propertyContactsRes.data : [];

  // Mutations for saving and deleting contacts
  const saveContactMutation = useSavePropertyContact(propertyId);
  const deleteContactMutation = useDeletePropertyContact(propertyId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyContactSchema),
    defaultValues: normalizeContactValues(initialValues),
  });

  // Sync initialValues if provided and no contacts loaded yet
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0 && savedContacts.length === 0) {
      reset(normalizeContactValues(initialValues));
    }
  }, [initialValues, reset, savedContacts.length]);

  const handleSaveContactForm = async (data) => {
    setLocalServerError("");
    const cleanedPayload = {
      ...data,
      contact_name: data.contact_name?.trim(),
      designation: data.designation?.trim() || undefined,
      mobile_number: data.mobile_number?.trim() || undefined,
      alternate_number: data.alternate_number?.trim() || undefined,
      whatsapp_number: data.whatsapp_number?.trim() || undefined,
      email: data.email?.trim() || undefined,
      website: data.website?.trim() || undefined,
      contact_type_id: Number(data.contact_type_id || 1),
      is_primary: Boolean(data.is_primary ?? (savedContacts.length === 0)),
    };

    if (propertyId) {
      try {
        await saveContactMutation.mutateAsync({
          propertyId,
          contactId: editingContactId,
          payload: cleanedPayload,
        });

        // Reset form for adding next contact
        setEditingContactId(null);
        reset({
          ...defaultContactValues,
          contact_type_id: 1,
          is_primary: false,
        });
      } catch (err) {
        setLocalServerError(
          err.response?.data?.message || "Failed to save contact to backend."
        );
      }
    } else if (typeof onSubmit === "function") {
      onSubmit(cleanedPayload);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.contact_id);
    reset({
      contact_type_id: contact.contact_type_id || 1,
      contact_name: contact.contact_name || "",
      designation: contact.designation || "",
      mobile_number: contact.mobile_number || "",
      alternate_number: contact.alternate_number || "",
      whatsapp_number: contact.whatsapp_number || "",
      email: contact.email || "",
      website: contact.website || "",
      is_primary: Boolean(contact.is_primary),
    });
  };

  const handleDeleteContact = async (contactId) => {
    if (!propertyId || !contactId) return;
    try {
      setLocalServerError("");
      await deleteContactMutation.mutateAsync({ propertyId, contactId });
      if (editingContactId === contactId) {
        setEditingContactId(null);
        reset(defaultContactValues);
      }
    } catch (err) {
      setLocalServerError("Failed to delete contact.");
    }
  };

  const handleAddNewClick = () => {
    setEditingContactId(null);
    reset({
      ...defaultContactValues,
      contact_type_id: 1,
      is_primary: savedContacts.length === 0,
    });
  };

  const handleProceedNext = () => {
    const currentValues = watch();
    if (currentValues.contact_name) {
      handleSubmit(async (data) => {
        const cleaned = {
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
        if (propertyId) {
          await handleSaveContactForm(data);
        }
        if (typeof onSubmit === "function") {
          onSubmit(cleaned);
        }
      })();
    } else if (savedContacts.length > 0) {
      if (typeof onSubmit === "function") {
        onSubmit(savedContacts[0]);
      }
    } else {
      handleSubmit(async (data) => {
        if (typeof onSubmit === "function") {
          onSubmit(data);
        }
      })();
    }
  };

  const activeError = serverError || localServerError;
  const isSaving = saveContactMutation.isPending || isSubmitting;

  return (
    <div className="space-y-8">
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
              Contact Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the people guests and KonkanTrip&trade; can contact about this property.
            </p>
          </div>
        </div>
      </section>

      {/* Server Error Alert */}
      {activeError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {activeError}
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form to Add/Edit Contact */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingContactId ? "Edit Contact" : savedContacts.length === 0 ? "Primary Contact" : "Add New Contact"}
                </h3>
                <p className="text-xs text-slate-500">
                  This person will be the contact for booking and property communication.
                </p>
              </div>
              {editingContactId && (
                <button
                  type="button"
                  onClick={handleAddNewClick}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(handleSaveContactForm)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Contact Name */}
                <div>
                  <label htmlFor="contact_name" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    placeholder="Full name (e.g. Ramesh Patil)"
                    {...register("contact_name")}
                    className={[
                      "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                      errors.contact_name ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-emerald-600",
                    ].join(" ")}
                  />
                  {errors.contact_name && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.contact_name.message}</p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label htmlFor="designation" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Designation
                  </label>
                  <input
                    id="designation"
                    type="text"
                    placeholder="Manager / Owner / Front Desk"
                    {...register("designation")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Contact Type / Role */}
                <div>
                  <label htmlFor="contact_type_id" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Contact Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contact_type_id"
                    {...register("contact_type_id")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    {contactTypes.map((type) => (
                      <option key={type.contact_type_id} value={type.contact_type_id}>
                        {type.contact_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobile_number" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mobile_number"
                    type="tel"
                    placeholder="+91 9876543210 / 10-digit mobile number"
                    {...register("mobile_number")}
                    className={[
                      "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                      errors.mobile_number ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-emerald-600",
                    ].join(" ")}
                  />
                  {errors.mobile_number && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.mobile_number.message}</p>
                  )}
                </div>

                {/* Alternate Mobile */}
                <div>
                  <label htmlFor="alternate_number" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Alternate Mobile
                  </label>
                  <input
                    id="alternate_number"
                    type="tel"
                    placeholder="+91 9876543211"
                    {...register("alternate_number")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label htmlFor="whatsapp_number" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsapp_number"
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register("whatsapp_number")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="manager@property.com (property@example.com)"
                    {...register("email")}
                    className={[
                      "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-100",
                      errors.email ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-emerald-600",
                    ].join(" ")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Website */}
                <div className="sm:col-span-2">
                  <label htmlFor="website" className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    placeholder="https://myproperty.com"
                    {...register("website")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Set Primary Checkbox */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_primary")}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Set as primary property contact
                  </span>
                </label>
              </div>

              {/* Submit / Save Contact Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      {editingContactId ? "Update Contact" : "Save Contact"}
                    </>
                  )}
                </button>

                {editingContactId && (
                  <button
                    type="button"
                    onClick={handleAddNewClick}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Property Contacts Cards Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Property Contacts</h3>
                <p className="text-xs text-slate-500">
                  You can add multiple contacts for different responsibilities.
                </p>
              </div>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                {savedContacts.length}
              </span>
            </div>

            {/* Contacts Cards List */}
            {isLoadingContacts ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto h-6 w-6 text-emerald-600 animate-spin" />
                <p className="mt-2 text-xs text-slate-500">Loading contacts...</p>
              </div>
            ) : savedContacts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center space-y-2">
                <User className="mx-auto h-8 w-8 text-slate-400" />
                <p className="text-xs font-medium text-slate-600">No contacts saved yet.</p>
                <p className="text-[11px] text-slate-400">
                  Fill out the form on the left to add your first property contact.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedContacts.map((contact) => {
                  const isPrimary = Boolean(contact.is_primary);
                  const typeName = contact.contact_type_name || "Contact";

                  return (
                    <div
                      key={contact.contact_id}
                      className={[
                        "rounded-xl border p-4 transition-all space-y-2.5",
                        isPrimary
                          ? "border-emerald-300 bg-emerald-50/40 shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {contact.contact_name}
                            </h4>
                            {isPrimary && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                <ShieldCheck className="h-3 w-3" />
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {contact.designation || "Contact Person"} • {typeName}
                          </p>
                        </div>
                      </div>

                      {/* Phone & Details */}
                      <div className="space-y-1 pt-1 text-xs text-slate-600">
                        {contact.mobile_number && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-800">{contact.mobile_number}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 text-xs">
                        <button
                          type="button"
                          onClick={() => handleEditContact(contact)}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(contact.contact_id)}
                          disabled={deleteContactMutation.isPending}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Another Contact Button */}
            <button
              type="button"
              onClick={handleAddNewClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-300 bg-emerald-50/50 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/60 transition-all"
            >
              <Plus className="h-4 w-4" />
              + Add Another Contact
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Location
        </button>

        <button
          type="button"
          onClick={handleProceedNext}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-all"
        >
          <span>Save &amp; Continue to Amenities</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ContactStep;
