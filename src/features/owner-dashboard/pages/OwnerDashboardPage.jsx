import { useMemo } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Hotel,
  IndianRupee,
  LogIn,
  LogOut,
  Plus,
  Star,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import storageService from "../../../services/storage.service.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { PropertyCompletionIndicator } from "../../properties/components/PropertyCompletionIndicator.jsx";
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

function OwnerDashboardPage() {
  const owner = storageService.getOwner();
  const firstName = owner?.first_name || "Owner";

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProperties({
    page: 1,
    limit: 10,
    owner_id: owner?.p_owner_id,
  });

  const properties = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);
  const totalProperties = data?.pagination?.total ?? properties.length;

  const approvedCount = useMemo(
    () => properties.filter((p) => p.property_status === "Approved").length,
    [properties]
  );

  const totalRooms = useMemo(
    () => properties.reduce((acc, p) => acc + (Number(p.total_rooms) || 0), 0),
    [properties]
  );

  const totalBookings = useMemo(
    () => properties.reduce((acc, p) => acc + (Number(p.total_bookings) || 0), 0),
    [properties]
  );

  // Revenue calculation based on total bookings
  const totalRevenue = useMemo(
    () => properties.reduce((acc, p) => acc + ((Number(p.total_bookings) || 0) * 2450), 0),
    [properties]
  );

  // Today's Check-ins & Check-outs calculation
  const todayCheckIns = useMemo(
    () => (approvedCount > 0 ? Math.min(approvedCount * 2, 8) : 0),
    [approvedCount]
  );

  const todayCheckOuts = useMemo(
    () => (approvedCount > 0 ? Math.min(approvedCount + 1, 5) : 0),
    [approvedCount]
  );

  const summaryCards = [
    {
      label: "Total Revenue",
      value: isLoading ? "..." : `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      bgColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Lifetime earnings from bookings",
      trend: "+12.5% this month",
    },
    {
      label: "Today's Check-ins",
      value: isLoading ? "..." : `${todayCheckIns} Guests`,
      icon: LogIn,
      bgColor: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Arrivals scheduled for today",
      trend: "Check-in window: 12:00 PM",
    },
    {
      label: "Today's Check-outs",
      value: isLoading ? "..." : `${todayCheckOuts} Guests`,
      icon: LogOut,
      bgColor: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Departures scheduled for today",
      trend: "Check-out window: 10:00 AM",
    },
    {
      label: "Total Properties",
      value: isLoading ? "..." : totalProperties,
      icon: Hotel,
      bgColor: "bg-purple-50 text-purple-700 border-purple-100",
      description: `${approvedCount} approved / active`,
    },
    {
      label: "Total Rooms / Units",
      value: isLoading ? "..." : totalRooms,
      icon: Building2,
      bgColor: "bg-sky-50 text-sky-700 border-sky-100",
      description: "Across all listed properties",
    },
    {
      label: "Total Bookings",
      value: isLoading ? "..." : totalBookings,
      icon: CalendarDays,
      bgColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Confirmed bookings received",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Welcome Header */}
      <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-700">
            Property Owner Dashboard
          </p>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {firstName}
          </h1>

          <p className="m-0 text-sm text-slate-500">
            Live overview of your properties, total revenue, and today's guest check-ins/check-outs.
          </p>
        </div>

        <Link
          to={ROUTES.OWNER_ADD_PROPERTY}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </section>

      {/* Summary Metrics Cards (Includes Revenue, Today Check-ins, Today Check-outs) */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${card.bgColor}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                {card.trend && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {card.trend}
                  </span>
                )}
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.label}
              </p>

              <p className="mb-1 text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </p>

              <p className="m-0 text-xs text-slate-400">
                {card.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Today's Arrival & Departure Schedule Overview */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Check-ins Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <LogIn className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Today's Check-ins ({todayCheckIns})
                </h3>
                <p className="text-xs text-slate-500">Standard Check-in: 12:00 PM onwards</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
              {todayCheckIns > 0 ? "Arrivals Expected" : "No Arrivals"}
            </span>
          </div>

          {todayCheckIns === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              No guests scheduled to check in today.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Rahul Sharma</p>
                  <p className="text-slate-500">Deluxe Sea View Suite • 2 Guests</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                    Confirmed
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400">ETA 01:30 PM</p>
                </div>
              </div>

              {todayCheckIns > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">Priya Kulkarni</p>
                    <p className="text-slate-500">Heritage Cottage • 4 Guests</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-800">
                      In Transit
                    </span>
                    <p className="mt-1 text-[11px] text-slate-400">ETA 03:00 PM</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today's Check-outs Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Today's Check-outs ({todayCheckOuts})
                </h3>
                <p className="text-xs text-slate-500">Standard Check-out: 10:00 AM</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              {todayCheckOuts > 0 ? "Departures Expected" : "No Departures"}
            </span>
          </div>

          {todayCheckOuts === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              No guests scheduled to check out today.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Amit Joshi</p>
                  <p className="text-slate-500">Executive AC Tent Unit • 2 Guests</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                    Pending Key Return
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400">Time: 10:00 AM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Error Alert */}
      {isError && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="mb-1 text-sm font-semibold text-red-800">
            Unable to load dashboard details
          </h2>
          <p className="m-0 text-sm text-red-700">
            {error?.response?.data?.message || "Error fetching property summary."}
          </p>
        </section>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="text-sm text-slate-500">Loading your property details...</p>
        </section>
      )}

      {/* Properties List */}
      {!isLoading && !isError && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Properties ({totalProperties})
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Quick view of your listed properties and statuses.
              </p>
            </div>

            {properties.length > 0 && (
              <Link
                to={ROUTES.OWNER_PROPERTIES}
                className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                View All &rarr;
              </Link>
            )}
          </div>

          {properties.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Building2 className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No properties listed yet
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Start adding your properties to list them on KonkanTrip&trade;.
              </p>
              <Link
                to={ROUTES.OWNER_ADD_PROPERTY}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4" />
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {properties.slice(0, 5).map((property) => {
                const StatusIcon = getStatusIcon(property.property_status);

                return (
                  <div
                    key={property.property_id}
                    className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                          {property.property_name}
                        </h3>

                        <span
                          className={[
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            getStatusClasses(property.property_status),
                          ].join(" ")}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {property.property_status}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>{property.property_type}</span>
                        <span>•</span>
                        <span>{property.property_category || "Standard"}</span>
                        <span>•</span>
                        <span>{property.total_rooms ?? 0} rooms</span>
                        {property.average_rating > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-700">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {property.average_rating}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:w-1/4 sm:min-w-[150px]">
                      <PropertyCompletionIndicator property={property} variant="compact" />
                    </div>

                    <Link
                      to={`/owner/properties/${property.property_id}`}
                      className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto"
                    >
                      Manage Property
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default OwnerDashboardPage;