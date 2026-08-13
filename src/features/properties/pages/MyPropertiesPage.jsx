import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  Star,
  XCircle,
} from "lucide-react";

import { useProperties } from "../hooks/useProperties.js";
import { PropertyCompletionIndicator } from "../components/PropertyCompletionIndicator.jsx";
import storageService from "../../../services/storage.service.js";

const PROPERTY_STATUSES = [
  "All",
  "Draft",
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
  "Suspended",
  "Inactive",
];

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

function MyPropertiesPage() {
  const owner = storageService.getOwner();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useProperties({
    page,
    limit: 20,
    search,
    status,
    owner_id: owner?.p_owner_id,
  });

  const properties = data?.data || [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (event) => {
    setPage(1);
    setStatus(event.target.value);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-700">
            Property Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            My Properties
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your registered properties.
          </p>
        </div>

        <Link
          to="/owner/properties/add"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          + Add Property
        </Link>
      </section>

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex min-w-0 flex-1"
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search properties..."
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </form>

          {/* Status */}
          <select
            value={status || "All"}
            onChange={handleStatusChange}
            className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 lg:w-52"
          >
            {PROPERTY_STATUSES.map((propertyStatus) => (
              <option
                key={propertyStatus}
                value={
                  propertyStatus === "All"
                    ? ""
                    : propertyStatus
                }
              >
                {propertyStatus === "All"
                  ? "All statuses"
                  : propertyStatus}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {isError && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="mb-1 text-sm font-semibold text-red-800">
            Unable to load properties
          </h2>

          <p className="m-0 text-sm text-red-700">
            {error?.response?.data?.message ||
              "Something went wrong while loading your properties."}
          </p>
        </section>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}
      {isLoading && (
        <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="m-0 text-sm text-slate-500">
            Loading properties...
          </p>
        </section>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}
      {!isLoading &&
        !isError &&
        properties.length === 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Building2 className="h-6 w-6 text-slate-400" />
            </div>

            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              No properties found
            </h2>

            <p className="mx-auto max-w-md text-sm text-slate-500">
              {search || status
                ? "Try changing your search or status filter."
                : "You don't have any properties yet."}
            </p>

            {!search && !status && (
              <Link
                to="/owner/properties/add"
                className="mt-5 inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Add Your First Property
              </Link>
            )}
          </section>
        )}

      {/* =====================================================
          PROPERTY LIST
      ====================================================== */}
      {!isLoading &&
        !isError &&
        properties.length > 0 && (
          <section className="space-y-4">

            {/* Result Count */}
            <div className="flex items-center justify-between">
              <p className="m-0 text-sm text-slate-500">
                {total}{" "}
                {total === 1
                  ? "property"
                  : "properties"}{" "}
                found
              </p>

              {isFetching && (
                <p className="m-0 text-xs text-emerald-600">
                  Updating...
                </p>
              )}
            </div>

            {/* Properties */}
            <div className="space-y-4">
              {properties.map((property) => {
                const StatusIcon = getStatusIcon(
                  property.property_status
                );

                return (
                  <article
                    key={property.property_id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >

                    {/* =================================================
                        PROPERTY HEADER
                    ================================================== */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="m-0 text-lg font-semibold text-slate-900">
                            {property.property_name}
                          </h2>

                          <span
                            className={[
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                              getStatusClasses(
                                property.property_status
                              ),
                            ].join(" ")}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />

                            {property.property_status}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">

                          <span>
                            {property.property_type}
                          </span>

                          <span className="text-slate-300">
                            •
                          </span>

                          <span>
                            {property.property_category}
                          </span>

                          {property.property_slug && (
                            <>
                              <span className="text-slate-300">
                                •
                              </span>

                              <span className="truncate">
                                {property.property_slug}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2">

                        {property.is_verified && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Verified
                          </span>
                        )}

                        {property.is_featured && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        PROPERTY STATISTICS
                    ================================================== */}
                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">

                      {/* Rooms */}
                      <div>
                        <p className="mb-1 text-xs text-slate-400">
                          Rooms
                        </p>

                        <p className="m-0 text-sm font-semibold text-slate-800">
                          {property.total_rooms ?? 0}
                        </p>
                      </div>

                      {/* Average Rating */}
                      <div>
                        <p className="mb-1 text-xs text-slate-400">
                          Average Rating
                        </p>

                        <p className="m-0 flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                          {property.average_rating ?? 0}
                        </p>
                      </div>

                      {/* Reviews */}
                      <div>
                        <p className="mb-1 text-xs text-slate-400">
                          Reviews
                        </p>

                        <p className="m-0 text-sm font-semibold text-slate-800">
                          {property.total_reviews ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        COMPLETION INDICATOR
                    ================================================== */}
                    <PropertyCompletionIndicator property={property} />

                    {/* =================================================
                        FOOTER / MANAGE
                    ================================================== */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

                      <div className="text-xs text-slate-400">
                        {property.total_bookings ?? 0} bookings
                        {" • "}
                        {property.total_views ?? 0} views
                      </div>

                      {/* IMPORTANT:
                          Manage Property is now a Link */}
                      <Link
                        to={`/owner/properties/${property.property_id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                      >
                        Manage Property
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                <p className="m-0 text-sm text-slate-500">
                  Page {page} of {totalPages}
                </p>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>
              </div>
            )}
          </section>
        )}
    </div>
  );
}

export default MyPropertiesPage;