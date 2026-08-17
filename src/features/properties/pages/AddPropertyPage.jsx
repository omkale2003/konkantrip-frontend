import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import BasicDetailsStep from "../components/property-wizard/steps/BasicDetailsStep.jsx";
import LocationStep from "../components/property-wizard/steps/LocationStep.jsx";
import ContactStep from "../components/property-wizard/steps/ContactStep.jsx";
import AmenitiesStep from "../components/property-wizard/steps/AmenitiesStep.jsx";
import PhotosStep from "../components/property-wizard/steps/PhotosStep.jsx";
import PoliciesStep from "../components/property-wizard/steps/PoliciesStep.jsx";
import DocumentsStep from "../components/property-wizard/steps/DocumentsStep.jsx";
import ReviewStep from "../components/property-wizard/steps/ReviewStep.jsx";
import WizardProgress from "../components/property-wizard/WizardProgress.jsx";

import { useCreateProperty, useProperty, useUpdateProperty } from "../hooks/useProperties.js";
import {
  usePropertyLocation,
  useSavePropertyLocation,
} from "../hooks/usePropertyLocations.js";
import {
  usePropertyContacts,
  useSavePropertyContact,
} from "../hooks/usePropertyContacts.js";
import {
  usePropertyAmenities,
  useSavePropertyAmenities,
} from "../hooks/usePropertyAmenities.js";
import {
  usePropertyPolicies,
  useSavePropertyPolicies,
} from "../hooks/usePropertyPolicies.js";

import { ROUTES } from "../../../constants/routes.js";

function getFriendlyErrorMessage(error, defaultMessage) {
  if (!error) return "";
  const status = error?.response?.status;
  if (status === 401) return "Your session has expired. Please login again.";
  if (status === 403) return "You do not have permission to submit this property.";
  if (status === 404) return "Property not found.";
  if (status === 409) return "Your property cannot be submitted in its current state.";
  if (status === 400 || status === 422) {
    const backendMsg = error?.response?.data?.message;
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const detail = errors.map((e) => (typeof e === "string" ? e : e.message)).join(", ");
      return `${backendMsg || "Validation failed"}: ${detail}`;
    }
    return backendMsg || "Validation failed. Please check your entries.";
  }
  return defaultMessage || "Unable to save property details. Please try again.";
}

function AddPropertyPage() {
  const [searchParams] = useSearchParams();
  const shouldResume = searchParams.get("resume") === "true";

  const [currentStep, setCurrentStep] = useState(() => {
    if (shouldResume) {
      try {
        const saved = localStorage.getItem("konkantrip_property_draft");
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.currentStep || 1;
        }
      } catch {
        // ignore
      }
    }
    return 1;
  });

  const [returnToReview, setReturnToReview] = useState(false);

  const [propertyId, setPropertyId] = useState(() => {
    if (shouldResume) {
      try {
        const saved = localStorage.getItem("konkantrip_property_draft");
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.propertyId || null;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [propertyData, setPropertyData] = useState(null);

  // Clear stale draft if not explicitly resuming
  useEffect(() => {
    if (!shouldResume) {
      try {
        localStorage.removeItem("konkantrip_property_draft");
      } catch {
        // ignore
      }
    }
  }, [shouldResume]);

  // Auto-save active draft progress when propertyId exists or step > 1
  useEffect(() => {
    try {
      if (propertyId || currentStep > 1) {
        localStorage.setItem(
          "konkantrip_property_draft",
          JSON.stringify({ propertyId, currentStep })
        );
      }
    } catch {
      // ignore
    }
  }, [propertyId, currentStep]);

  const [locationServerError, setLocationServerError] = useState("");
  const [contactServerError, setContactServerError] = useState("");
  const [amenitiesServerError, setAmenitiesServerError] = useState("");
  const [policiesServerError, setPoliciesServerError] = useState("");
  const [reviewServerError, setReviewServerError] = useState("");

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const saveLocationMutation = useSavePropertyLocation();
  const saveContactMutation = useSavePropertyContact();
  const saveAmenitiesMutation = useSavePropertyAmenities();
  const savePoliciesMutation = useSavePropertyPolicies();

  // Query existing property basic details
  const propertyQuery = useProperty(propertyId);
  const fetchedProperty = propertyQuery.data?.data || propertyQuery.data || null;
  const activePropertyId = propertyId || fetchedProperty?.property_id;
  const basicDetails = propertyData || fetchedProperty;

  // Queries for existing step data
  const locationQuery = usePropertyLocation(activePropertyId);
  const existingLocation = locationQuery.data?.data || null;

  const contactsQuery = usePropertyContacts(activePropertyId);
  const existingContacts = contactsQuery.data?.data || [];
  const primaryContact =
    Array.isArray(existingContacts) && existingContacts.length > 0
      ? existingContacts.find((c) => c.is_primary) || existingContacts[0]
      : null;

  const propertyAmenitiesQuery = usePropertyAmenities(activePropertyId);
  const existingPropertyAmenities = propertyAmenitiesQuery.data?.data || [];

  const propertyPoliciesQuery = usePropertyPolicies(activePropertyId);
  const existingPolicies = propertyPoliciesQuery.data?.data || null;

  const handleEditFromReview = (stepNumber) => {
    setReturnToReview(true);
    setCurrentStep(stepNumber);
  };

  const handleBackFromStep = (previousStep) => {
    if (returnToReview) {
      setReturnToReview(false);
      setCurrentStep(8);
    } else {
      setCurrentStep(previousStep);
    }
  };

  const handleBasicDetailsSubmit = async (formData) => {
    const targetId = activePropertyId;

    try {
      if (targetId) {
        // Updating existing property when editing Step 1
        const response = await updatePropertyMutation.mutateAsync({
          propertyId: targetId,
          propertyData: formData,
        });

        if (response?.data) {
          setPropertyData(response.data);
        }
      } else {
        // Creating new property on initial Step 1 submission
        const response = await createPropertyMutation.mutateAsync(formData);

        if (!response?.success || !response?.data) {
          return;
        }

        const createdProperty = response.data;
        const newId = createdProperty.property_id || createdProperty.id;
        setPropertyId(newId);
        setPropertyData(createdProperty);
      }

      if (returnToReview) {
        setReturnToReview(false);
        setCurrentStep(8);
      } else {
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Failed to save basic details:", error);
    }
  };

  const handleLocationSubmit = async (locationData) => {
    if (!propertyId) return;

    setLocationServerError("");
    const isUpdate = Boolean(existingLocation?.location_id);

    try {
      await saveLocationMutation.mutateAsync({
        propertyId,
        payload: locationData,
        isUpdate,
      });

      if (returnToReview) {
        setReturnToReview(false);
        setCurrentStep(8);
      } else {
        setCurrentStep(3);
      }
    } catch (error) {
      const msg = getFriendlyErrorMessage(
        error,
        "Unable to save property location. Please try again."
      );
      setLocationServerError(msg);
    }
  };

  const handleContactSubmit = async (contactData) => {
    if (!propertyId) return;

    setContactServerError("");
    const contactId = primaryContact?.contact_id;

    try {
      await saveContactMutation.mutateAsync({
        propertyId,
        contactId,
        payload: contactData,
      });

      if (returnToReview) {
        setReturnToReview(false);
        setCurrentStep(8);
      } else {
        setCurrentStep(4);
      }
    } catch (error) {
      const msg = getFriendlyErrorMessage(
        error,
        "Unable to save contact details. Please try again."
      );
      setContactServerError(msg);
    }
  };

  const handleAmenitiesSubmit = async (amenitiesPayload) => {
    if (!propertyId) return;

    setAmenitiesServerError("");

    try {
      await saveAmenitiesMutation.mutateAsync({
        propertyId,
        amenities: amenitiesPayload,
      });

      if (returnToReview) {
        setReturnToReview(false);
        setCurrentStep(8);
      } else {
        setCurrentStep(5);
      }
    } catch (error) {
      const msg = getFriendlyErrorMessage(
        error,
        "Unable to save amenities. Please try again."
      );
      setAmenitiesServerError(msg);
    }
  };

  const handlePhotosSubmit = () => {
    if (returnToReview) {
      setReturnToReview(false);
      setCurrentStep(8);
    } else {
      setCurrentStep(6);
    }
  };

  const handlePoliciesSubmit = async (policyData) => {
    if (!propertyId) return;

    setPoliciesServerError("");

    try {
      await savePoliciesMutation.mutateAsync({
        propertyId,
        payload: policyData,
      });

      if (returnToReview) {
        setReturnToReview(false);
        setCurrentStep(8);
      } else {
        setCurrentStep(7);
      }
    } catch (error) {
      const msg = getFriendlyErrorMessage(
        error,
        "Unable to save property policies. Please try again."
      );
      setPoliciesServerError(msg);
    }
  };

  const handleDocumentsSubmit = () => {
    if (returnToReview) {
      setReturnToReview(false);
    }
    setCurrentStep(8);
  };

  const handleFinalPropertySubmit = async () => {
    if (!propertyId) return false;

    setReviewServerError("");

    try {
      // Submit property for verification via PUT /api/v1/properties/:id
      const payload = {
        property_status: "Pending",
      };

      if (basicDetails?.property_name) {
        payload.property_name = basicDetails.property_name;
      }

      await updatePropertyMutation.mutateAsync({
        propertyId,
        propertyData: payload,
      });

      // Clear property draft cache on successful submission
      try {
        localStorage.removeItem("konkantrip_property_draft");
      } catch {
        // ignore
      }

      return true;
    } catch (error) {
      const msg = getFriendlyErrorMessage(
        error,
        "Unable to submit the property. Please try again."
      );
      setReviewServerError(msg);
      return false;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div>
        <Link
          to={ROUTES.OWNER_PROPERTIES}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Properties
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Add New Property
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {currentStep === 1 && "Start by providing the basic details of your property."}
            {currentStep === 2 && "Tell us where your property is located."}
            {currentStep === 3 && "Provide contact details for guests and KonkanTrip."}
            {currentStep === 4 && "Select the facilities and services available at your property."}
            {currentStep === 5 && "Upload high-quality photos of your property."}
            {currentStep === 6 && "Define check-in/out times, cancellation rules, guest permissions, and house policies."}
            {currentStep === 7 && "Upload required property documents for verification."}
            {currentStep === 8 && "Review your property information carefully before submitting."}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <section className="rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6">
        <WizardProgress currentStep={currentStep} />
      </section>

      {/* Step 1 - Basic Details */}
      {currentStep === 1 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <BasicDetailsStep
            initialValues={basicDetails}
            onSubmit={handleBasicDetailsSubmit}
            onBack={returnToReview ? () => handleBackFromStep(1) : undefined}
            isEditingFromReview={returnToReview}
            isSubmitting={createPropertyMutation.isPending || updatePropertyMutation.isPending}
          />

          {(createPropertyMutation.isError || updatePropertyMutation.isError) && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getFriendlyErrorMessage(
                createPropertyMutation.error || updatePropertyMutation.error,
                "Unable to save property details. Please try again."
              )}
            </div>
          )}
        </section>
      )}

      {/* Step 2 - Location */}
      {currentStep === 2 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {locationQuery.isLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              <p className="mt-3 text-sm text-slate-500">Loading location details...</p>
            </div>
          ) : (
            <LocationStep
              initialValues={existingLocation || {}}
              onSubmit={handleLocationSubmit}
              onBack={() => handleBackFromStep(1)}
              isEditingFromReview={returnToReview}
              isSubmitting={saveLocationMutation.isPending}
              serverError={locationServerError}
            />
          )}
        </section>
      )}

      {/* Step 3 - Contact */}
      {currentStep === 3 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {contactsQuery.isLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              <p className="mt-3 text-sm text-slate-500">Loading contact details...</p>
            </div>
          ) : (
            <ContactStep
              initialValues={primaryContact || {}}
              onSubmit={handleContactSubmit}
              onBack={() => handleBackFromStep(2)}
              isEditingFromReview={returnToReview}
              isSubmitting={saveContactMutation.isPending}
              serverError={contactServerError}
            />
          )}
        </section>
      )}

      {/* Step 4 - Amenities */}
      {currentStep === 4 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {propertyAmenitiesQuery.isLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              <p className="mt-3 text-sm text-slate-500">Loading assigned amenities...</p>
            </div>
          ) : (
            <AmenitiesStep
              key={existingPropertyAmenities.map((a) => a.amenity_id).join("-")}
              propertyId={propertyId}
              initialValues={existingPropertyAmenities}
              onSubmit={handleAmenitiesSubmit}
              onBack={() => handleBackFromStep(3)}
              isEditingFromReview={returnToReview}
              isSubmitting={saveAmenitiesMutation.isPending}
              serverError={amenitiesServerError}
            />
          )}
        </section>
      )}

      {/* Step 5 - Photos */}
      {currentStep === 5 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <PhotosStep
            propertyId={propertyId}
            onSubmit={handlePhotosSubmit}
            onBack={() => handleBackFromStep(4)}
            isEditingFromReview={returnToReview}
          />
        </section>
      )}

      {/* Step 6 - Policies */}
      {currentStep === 6 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {propertyPoliciesQuery.isLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              <p className="mt-3 text-sm text-slate-500">Loading property policies...</p>
            </div>
          ) : (
            <PoliciesStep
              initialValues={existingPolicies || {}}
              onSubmit={handlePoliciesSubmit}
              onBack={() => handleBackFromStep(5)}
              isEditingFromReview={returnToReview}
              isSubmitting={savePoliciesMutation.isPending}
              serverError={policiesServerError}
            />
          )}
        </section>
      )}

      {/* Step 7 - Documents */}
      {currentStep === 7 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <DocumentsStep
            propertyId={propertyId}
            onSubmit={handleDocumentsSubmit}
            onBack={() => handleBackFromStep(6)}
            isEditingFromReview={returnToReview}
          />
        </section>
      )}

      {/* Step 8 - Review & Submit */}
      {currentStep === 8 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <ReviewStep
            propertyId={propertyId}
            basicDetails={basicDetails || {}}
            onNavigateToStep={handleEditFromReview}
            onSubmitProperty={handleFinalPropertySubmit}
            onBack={() => setCurrentStep(7)}
            isSubmitting={updatePropertyMutation.isPending}
            serverError={reviewServerError}
          />
        </section>
      )}
    </div>
  );
}

export default AddPropertyPage;