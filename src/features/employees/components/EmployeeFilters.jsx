import { Search, Filter, LayoutGrid, List, X } from "lucide-react";

function EmployeeFilters({
  searchTerm = "",
  onSearchChange,
  selectedProperty = "",
  onPropertyChange,
  selectedRole = "",
  onRoleChange,
  selectedStatus = "",
  onStatusChange,
  properties = [],
  roles = [],
  viewMode = "table",
  onViewModeChange,
  onResetFilters,
}) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedProperty) ||
    Boolean(selectedRole) ||
    Boolean(selectedStatus);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, designation..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Selects & View Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Property Filter */}
        <select
          value={selectedProperty}
          onChange={(e) => onPropertyChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:border-emerald-600 focus:outline-none"
        >
          <option value="">All Properties</option>
          {properties.map((prop) => (
            <option key={prop.property_id} value={prop.property_id.toString()}>
              {prop.property_name}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:border-emerald-600 focus:outline-none"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.role_id} value={role.role_id.toString()}>
              {role.role_name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:border-emerald-600 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
          <option value="On Leave">On Leave</option>
        </select>

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`rounded-md p-1.5 transition ${
              viewMode === "table"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-md p-1.5 transition ${
              viewMode === "grid"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeFilters;
