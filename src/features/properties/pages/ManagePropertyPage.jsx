import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit,
  IndianRupee,
  Star,
  XCircle,
} from "lucide-react";

import { useProperty } from "../hooks/useProperties.js";
import { PropertyCompletionIndicator } from "../components/PropertyCompletionIndicator.jsx";
import { ROUTES } from "../../../constants/routes.js";

function getStatusClasses(status) {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Pending":
    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Rejected":
    case "Suspended":
    case "Inactive":
      return "bg-red-50 text-red-700 border-red-200";

    case "Draft":
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "Approved":
      return CheckCircle2;

    case "Pending":
    case "Under Review":
      return Clock3;

    case "Rejected":
    case "Suspended":
    case "Inactive":
      return XCircle;

    default:
      return Building2;
  }
}

function ManagePropertyPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const { data: propertyResponse, isLoading, isError, error } = useProperty(propertyId);

  const property = propertyResponse?.data;

  const handleEditProperty = () => {
    try {
      localStorage.setItem(
        "konkantrip_property_draft",
        JSON.stringify({
          propertyId: property.property_id,
          currentStep: 1,
        })
      );
      navigate("/owner/properties/add?resume=true");
    } catch (err) {
      console.error("Failed to set draft in localStorage", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.OWNER_PROPERTIES}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Properties
        </Link>
      </div>

      {isLoading && (
        <section className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="text-sm text-slate-500">Loading property details...</p>
        </section>
      )}

      {isError && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-800">
            Unable to load property
          </h2>
          <p className="m-0 text-sm text-red-700">
            {error?.response?.data?.message || "An unexpected error occurred while fetching property details."}
          </p>
        </section>
      )}

      {!isLoading && !isError && property && (
        <>
          {/* Header & Summary Card */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="col-span-1 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {property.property_name || "Unnamed Property"}
                  </h1>
                  {property.property_status && (() => {
                    const StatusIcon = getStatusIcon(property.property_status);
                    return (
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                          getStatusClasses(property.property_status),
                        ].join(" ")}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {property.property_status}
                      </span>
                    );
                  })()}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span>
                      {property.property_type || "Unknown Type"}
                      {property.property_category ? ` • ${property.property_category}` : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-medium text-slate-400">
                      ID: {property.property_id}
                    </span>
                  </div>
                </div>
              </div>

              {property.property_status === "Draft" && (
                <div className="mt-6 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  This property is currently a draft. Complete all sections below to submit for approval.
                </div>
              )}
            </div>

            {/* Completion Indicator */}
            <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-sm font-semibold text-slate-900">Listing Readiness</h2>
              <p className="mb-4 text-xs text-slate-500">Track your progress toward going live.</p>
              <div className="-mt-4">
                <PropertyCompletionIndicator property={property} />
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Rooms
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {property.total_rooms ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {property.total_bookings ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Average Rating
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-bold text-slate-900">
                  {property.average_rating ?? "0.0"}
                </p>
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Views
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {property.total_views ?? 0}
              </p>
            </div>
          </section>

          {/* Management Tools */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Management Tools
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <button
                type="button"
                onClick={handleEditProperty}
                className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Edit Details</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Update basics, location, amenities, photos, and policies.
                  </p>
                </div>
              </button>

              <Link
                to={ROUTES.OWNER_ROOMS}
                className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Manage Rooms</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add, remove, or edit the rooms/units at this property.
                  </p>
                </div>
              </Link>

              <Link
                to={ROUTES.OWNER_BOOKINGS}
                className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 transition group-hover:bg-amber-500 group-hover:text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">View Bookings</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Check upcoming arrivals and reservation history.
                  </p>
                </div>
              </Link>

              <Link
                to={ROUTES.OWNER_PRICING}
                className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Pricing & Availability</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Set nightly rates and block dates.
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default ManagePropertyPage;