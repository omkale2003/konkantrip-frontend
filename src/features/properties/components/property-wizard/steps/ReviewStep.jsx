import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck,
  FileText,
  Home,
  ImageIcon,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { usePropertyLocation } from "../../../hooks/usePropertyLocations.js";
import { usePropertyContacts } from "../../../hooks/usePropertyContacts.js";
import { usePropertyAmenities } from "../../../hooks/usePropertyAmenities.js";
import { usePropertyImages } from "../../../hooks/usePropertyImages.js";
import { usePropertyPolicies } from "../../../hooks/usePropertyPolicies.js";
import { usePropertyDocuments } from "../../../hooks/usePropertyDocuments.js";

import { ROUTES } from "../../../../../constants/routes.js";

function StatusBadge({ status }) {
  const s = (status || "Pending").toLowerCase();
  if (s === "verified" || s === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        <AlertCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
      <Clock className="h-3.5 w-3.5" />
      {status || "Pending Review"}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, stepNumber, onEdit }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>

      {typeof onEdit === "function" && (
        <button
          type="button"
          onClick={() => onEdit(stepNumber)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>
      )}
    </div>
  );
}

function ReviewStep({
  propertyId,
  basicDetails = {},
  onNavigateToStep,
  onSubmitProperty,
  onBack,
  isSubmitting = false,
  serverError = "",
  isAdminView = false,
  onApprove,
  onReject
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Sub-resource Queries for existing saved data
  const locationQuery = usePropertyLocation(propertyId);
  const location = locationQuery.data?.data || null;

  const contactsQuery = usePropertyContacts(propertyId);
  const contacts = contactsQuery.data?.data || [];
  const primaryContact = Array.isArray(contacts) && contacts.length > 0 ? contacts[0] : null;

  const amenitiesQuery = usePropertyAmenities(propertyId);
  const amenities = amenitiesQuery.data?.data || [];

  const imagesQuery = usePropertyImages(propertyId);
  const images = imagesQuery.data?.data || [];

  const policiesQuery = usePropertyPolicies(propertyId);
  const policies = policiesQuery.data?.data || null;

  const documentsQuery = usePropertyDocuments(propertyId);
  const documents = documentsQuery.data?.data || [];

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    if (typeof onSubmitProperty === "function") {
      const res = await onSubmitProperty();
      if (res !== false) {
        setIsSubmittedSuccess(true);
      }
    } else {
      setIsSubmittedSuccess(true);
    }
  };

  // Success State View after final submission
  if (isSubmittedSuccess) {
    return (
      <div className="space-y-6 rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Property Submitted Successfully!
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Your property details have been submitted for verification. Our administrative team will review your property documentation.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 max-w-md mx-auto text-left space-y-1 text-xs text-slate-600">
          <p><span className="font-semibold text-slate-800">Property Name:</span> {basicDetails.property_name || "N/A"}</p>
          <p><span className="font-semibold text-slate-800">Property ID:</span> #{propertyId}</p>
          <p><span className="font-semibold text-slate-800">Status:</span> <span className="font-medium text-amber-700">Pending Verification</span></p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={ROUTES.OWNER_PROPERTIES}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Home className="h-4 w-4" />
            View My Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Step 8
            </p>

            <h2 className="text-xl font-semibold text-slate-900">
              Review Your Property
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your property information carefully before submitting it for verification.
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

      {/* 1. Basic Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={Home}
          title="1. Basic Details"
          stepNumber={1}
          onEdit={onNavigateToStep}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Property Name</p>
            <p className="font-semibold text-slate-800">{basicDetails.property_name || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Property Type</p>
            <p className="font-semibold text-slate-800">{basicDetails.property_type || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Category</p>
            <p className="font-semibold text-slate-800">{basicDetails.property_category || "Standard"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Total Rooms</p>
            <p className="font-semibold text-slate-800">{basicDetails.total_rooms ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Price Display</p>
            <p className="font-semibold text-slate-800">{basicDetails.price_display_type || "Per Night"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Instant Booking</p>
            <p className="font-semibold text-slate-800">{basicDetails.instant_booking ? "Enabled" : "Disabled"}</p>
          </div>

          {basicDetails.short_description && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-slate-400">Short Description</p>
              <p className="text-slate-700">{basicDetails.short_description}</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Location */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={MapPin}
          title="2. Location"
          stepNumber={2}
          onEdit={onNavigateToStep}
        />

        {location ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-slate-400">Address</p>
              <p className="font-semibold text-slate-800">
                {[location.address_line1, location.address_line2].filter(Boolean).join(", ")}
              </p>
            </div>

            {location.landmark && (
              <div>
                <p className="text-xs font-medium text-slate-400">Landmark</p>
                <p className="text-slate-800">{location.landmark}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-slate-400">City / District</p>
              <p className="text-slate-800">{location.city || location.district || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">State / Country</p>
              <p className="text-slate-800">{location.state || "Maharashtra"}, {location.country || "India"}</p>
            </div>

            {location.postal_code && (
              <div>
                <p className="text-xs font-medium text-slate-400">Postal Code</p>
                <p className="text-slate-800">{location.postal_code}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">No location details provided yet.</p>
        )}
      </section>

      {/* 3. Contact */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={PhoneCall}
          title="3. Contact"
          stepNumber={3}
          onEdit={onNavigateToStep}
        />

        {primaryContact ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Contact Person</p>
              <p className="font-semibold text-slate-800">{primaryContact.contact_name}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Designation</p>
              <p className="text-slate-800">{primaryContact.designation || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Mobile Number</p>
              <p className="text-slate-800">{primaryContact.mobile_number || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">WhatsApp Number</p>
              <p className="text-slate-800">{primaryContact.whatsapp_number || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Email Address</p>
              <p className="text-slate-800">{primaryContact.email || "N/A"}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">No contact details provided yet.</p>
        )}
      </section>

      {/* 4. Amenities */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={Sparkles}
          title="4. Amenities"
          stepNumber={4}
          onEdit={onNavigateToStep}
        />

        {amenities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {amenities.map((item, index) => (
              <span
                key={item.amenity_id || item.property_amenity_id || index}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-1 text-xs font-semibold text-emerald-800"
              >
                <Sparkles className="h-3 w-3 text-emerald-600" />
                {item.amenity_name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">No amenities selected.</p>
        )}
      </section>

      {/* 5. Photos */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={ImageIcon}
          title="5. Photos"
          stepNumber={5}
          onEdit={onNavigateToStep}
        />

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {images.map((img, index) => (
              <div
                key={img.image_id || img.property_image_id || index}
                className="group relative aspect-4/3 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
              >
                <img
                  src={img.cdn_url}
                  alt={img.image_title || "Photo"}
                  className="h-full w-full object-cover"
                />
                {img.is_cover_image && (
                  <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    <Star className="h-2.5 w-2.5 fill-white" />
                    COVER
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">No photos uploaded yet.</p>
        )}
      </section>

      {/* 6. Policies */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={ShieldCheck}
          title="6. Policies"
          stepNumber={6}
          onEdit={onNavigateToStep}
        />

        {policies ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Check-In / Check-Out</p>
              <p className="font-semibold text-slate-800">
                {policies.check_in_from || "12:00"} - {policies.check_out_to || "10:00"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Free Cancellation</p>
              <p className="font-semibold text-slate-800">
                {policies.free_cancellation_hours ? `${policies.free_cancellation_hours} Hours` : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Guest Permissions</p>
              <p className="text-slate-800">
                Couples: {policies.unmarried_couples_allowed ? "Yes" : "No"} • Local IDs: {policies.local_ids_allowed ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">House Rules</p>
              <p className="text-slate-800">
                Smoking: {policies.smoking_allowed ? "Allowed" : "No"} • Pets: {policies.pets_allowed ? "Allowed" : "No"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">Default property policies apply.</p>
        )}
      </section>

      {/* 7. Documents */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <SectionHeader
          icon={FileCheck}
          title="7. Documents"
          stepNumber={7}
          onEdit={onNavigateToStep}
        />

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div
                key={doc.document_id || doc.property_document_id || index}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate font-semibold text-slate-800">
                    {doc.document_name || doc.original_file_name}
                  </span>
                </div>
                <StatusBadge status={doc.verification_status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">No documents uploaded yet.</p>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <div>
          {typeof onBack === "function" && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        {!isAdminView ? (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            Submit Property
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReject}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-red-200 text-red-600 px-6 py-2.5 text-sm font-semibold transition hover:bg-red-50 disabled:opacity-60"
            >
              Reject Listing
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              Approve Listing
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Submit Property for Verification?
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Once submitted, your property will be sent for verification. Please make sure all details are correct.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewStep;
