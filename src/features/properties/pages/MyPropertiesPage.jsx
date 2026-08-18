import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Home,
  Hotel,
  Star,
  Search,
  X,
  List,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Plus,
  RotateCcw,
  MoreVertical,
  Edit2,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";

import { useProperties } from "../hooks/useProperties.js";
import { usePropertyCompletion } from "../hooks/usePropertyCompletion.js";
import storageService from "../../../services/storage.service.js";

// Helper for type icons
const getPropertyTypeIcon = (type = "") => {
  const lower = (type || "").toLowerCase();
  if (lower.includes("resort")) return Hotel;
  if (lower.includes("homestay") || lower.includes("cottage")) return Home;
  if (lower.includes("villa") || lower.includes("bungalow") || lower.includes("house")) return Building2;
  return Building2;
};

// Helper for status badge formatting
const getStatusBadgeConfig = (status = "") => {
  const lower = (status || "").toLowerCase();
  if (lower.includes("approved") || lower.includes("published") || lower.includes("active")) {
    return {
      pillClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-500",
      label: status || "Published",
      subtext: "Active",
    };
  }
  if (lower.includes("draft") || lower.includes("incomplete")) {
    return {
      pillClass: "bg-amber-50 text-amber-700 border-amber-200",
      dotClass: "bg-amber-500",
      label: status || "Draft",
      subtext: "Incomplete",
    };
  }
  if (lower.includes("pending") || lower.includes("review")) {
    return {
      pillClass: "bg-blue-50 text-blue-700 border-blue-200",
      dotClass: "bg-blue-500",
      label: status || "Under Review",
      subtext: "Pending",
    };
  }
  return {
    pillClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
    label: status || "Draft",
    subtext: "Pending",
  };
};

// Subcomponent for Listing Completion cell in table
function PropertyCompletionCell({ property }) {
  const { completionData, isLoading } = usePropertyCompletion(property);

  if (isLoading) {
    return (
      <div className="space-y-1.5 animate-pulse">
        <div className="h-3 w-8 rounded bg-slate-200" />
        <div className="h-1.5 w-24 rounded bg-slate-200" />
      </div>
    );
  }

  const percentage = completionData?.percentage ?? 0;
  const nextSection = completionData?.nextIncompleteSection?.name;

  let progressColor = "bg-amber-500";
  let statusText = nextSection ? `Next: ${nextSection}` : "Incomplete";

  if (percentage === 100) {
    progressColor = "bg-emerald-600";
    statusText = "Complete";
  } else if (percentage >= 75) {
    progressColor = "bg-emerald-500";
    statusText = "Almost Complete";
  }

  return (
    <div className="space-y-1">
      <span className="text-xs font-bold text-slate-900 block">{percentage}%</span>
      <div className="h-1.5 w-28 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-400 block truncate max-w-[140px]">
        {statusText}
      </span>
    </div>
  );
}

function MyPropertiesPage() {
  const owner = storageService.getOwner();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCompletion, setSelectedCompletion] = useState("ALL");
  
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [activeMenuId, setActiveMenuId] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProperties({
    page,
    limit: 20,
    search,
    status: status === "ALL" ? "" : status,
    owner_id: owner?.p_owner_id,
  });

  const rawProperties = data?.data || [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || rawProperties.length;

  // Filter properties client-side by property type & completion if selected
  const properties = useMemo(() => {
    return rawProperties.filter((p) => {
      if (selectedType !== "ALL" && selectedType) {
        if ((p.property_type || "").toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [rawProperties, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setSelectedType("ALL");
    setSelectedCompletion("ALL");
    setPage(1);
  };

  const totalActiveFilters = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (status && status !== "ALL") count++;
    if (selectedType !== "ALL") count++;
    if (selectedCompletion !== "ALL") count++;
    return count;
  }, [search, status, selectedType, selectedCompletion]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Properties</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900">All Properties</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Properties
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {total} {total === 1 ? "Property" : "Properties"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View and manage all your registered properties
          </p>
        </div>

        <Link
          to="/owner/properties/add"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-800 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {/* Filter & Search Bar Container */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-4 transition-all">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12 items-end">
          {/* Search Properties (4 Cols) */}
          <div className="lg:col-span-4 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Search Properties
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
                placeholder="Search by property name, code, type or location..."
                className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-8 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Status Dropdown (2.5 Cols) */}
          <div className="lg:col-span-2.5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none font-medium"
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Property Type Dropdown (3 Cols) */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Property Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Homestay">Homestay</option>
              <option value="Villa">Villa</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Apartment">Apartment</option>
              <option value="Hostel">Hostel</option>
              <option value="Cottage">Cottage</option>
              <option value="Farmstay">Farmstay</option>
            </select>
          </div>

          {/* Listing Completion Dropdown (2.5 Cols) */}
          <div className="lg:col-span-2.5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">
              Listing Completion
            </label>
            <select
              value={selectedCompletion}
              onChange={(e) => setSelectedCompletion(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-xs text-slate-800 bg-white focus:border-emerald-500 focus:outline-none font-medium"
            >
              <option value="ALL">All</option>
              <option value="COMPLETE">Complete (100%)</option>
              <option value="INCOMPLETE">Incomplete (&lt;100%)</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: More Filters & Summary */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                showMoreFilters || totalActiveFilters > 0
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-700" />
              <span>More Filters</span>
              {totalActiveFilters > 0 && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white">
                  {totalActiveFilters}
                </span>
              )}
            </button>

            {totalActiveFilters > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline-block">
            Showing {properties.length} of {total} properties
          </span>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 space-y-2">
          <h3 className="text-sm font-semibold">Unable to load properties</h3>
          <p className="text-xs text-red-600">
            {error?.response?.data?.message || "Something went wrong while loading properties."}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Loading properties...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && properties.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-2xs space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No properties found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {totalActiveFilters > 0
                ? "No properties match your selected filters. Try clearing filters or search query."
                : "You have not registered any properties yet."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {totalActiveFilters > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                Reset Filters
              </button>
            )}
            <Link
              to="/owner/properties/add"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-2xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Property
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area: Table / Grid */}
      {!isLoading && !isError && properties.length > 0 && (
        <div className="space-y-4">
          {/* Results Bar & View Mode Switcher */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{properties.length}</span> {properties.length === 1 ? "property" : "properties"}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === "table" ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Property
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Type
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Status
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Listing Completion
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Rating & Reviews
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-xs">
                    {properties.map((property) => {
                      const TypeIcon = getPropertyTypeIcon(property.property_type);
                      const statusCfg = getStatusBadgeConfig(property.property_status);
                      const imageUrl = property.cdn_url || property.storage_path || property.image_url || property.cover_image;

                      return (
                        <tr key={property.property_id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Property Column */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={property.property_name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                    <Building2 className="h-5 w-5" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <span className="text-xs font-bold text-slate-900 block">{property.property_name}</span>
                                <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                                  {property.property_code || property.property_slug || `PRP-${property.property_id}`}
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                                  {property.property_type || "Property"} • {property.property_category || "Standard"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Type Column */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                              <TypeIcon className="h-4 w-4 text-emerald-600 shrink-0" />
                              <span>{property.property_type || "Homestay"}</span>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div>
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusCfg.pillClass}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotClass}`} />
                                {statusCfg.label}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400 block mt-1">
                                {statusCfg.subtext}
                              </span>
                            </div>
                          </td>

                          {/* Listing Completion Column */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <PropertyCompletionCell property={property} />
                          </td>

                          {/* Rating & Reviews Column */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div>
                              <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                <span>{property.average_rating ? Number(property.average_rating).toFixed(1) : "0.0"}</span>
                              </div>
                              <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                                ({property.total_reviews || 0} Reviews)
                              </span>
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <div className="relative inline-flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => setActiveMenuId(activeMenuId === property.property_id ? null : property.property_id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-slate-50 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {activeMenuId === property.property_id && (
                                <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg text-left">
                                  <Link
                                    to={`/owner/properties/${property.property_id}`}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                  >
                                    <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                                    Manage Property
                                  </Link>
                                  <Link
                                    to={`/owner/properties/${property.property_id}/edit`}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                                    Edit Details
                                  </Link>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid View Mode */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const TypeIcon = getPropertyTypeIcon(property.property_type);
                const statusCfg = getStatusBadgeConfig(property.property_status);
                const imageUrl = property.cdn_url || property.storage_path || property.image_url || property.cover_image;

                return (
                  <div
                    key={property.property_id}
                    className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Image Cover */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={property.property_name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                            <Building2 className="h-10 w-10 text-slate-300" />
                          </div>
                        )}

                        {/* Status Floating Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusCfg.pillClass}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotClass}`} />
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {property.property_name}
                            </h4>
                            <span className="text-[11px] font-medium text-slate-500">
                              {property.property_code || property.property_slug || `PRP-${property.property_id}`}
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{property.average_rating ? Number(property.average_rating).toFixed(1) : "0.0"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <TypeIcon className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">{property.property_type || "Homestay"}</span>
                          </div>
                        </div>

                        {/* Completion progress */}
                        <PropertyCompletionCell property={property} />
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                      <span className="text-xs font-semibold text-slate-600">
                        {property.total_rooms ?? 0} Rooms
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/owner/properties/${property.property_id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-all"
                        >
                          Manage Property
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs">
              <span className="text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{(page - 1) * 20 + 1}</span> to{" "}
                <span className="font-bold text-slate-900">{Math.min(page * 20, total)}</span> of{" "}
                <span className="font-bold text-slate-900">{total}</span> properties
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setPage(pNum)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                      pNum === page
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyPropertiesPage;