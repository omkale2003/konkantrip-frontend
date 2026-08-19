import { Link } from "react-router-dom";
import { Building2, ChevronRight, Plus, Star } from "lucide-react";
import { ROUTES } from "../../../constants/routes.js";
import { getImageUrl, handleImageError, DEFAULT_PROPERTY_IMAGE } from "../../../utils/imageUrl.js";

export function PropertyPerformanceTable({
  properties = [],
  isLoading = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-6 shadow-xs transition hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Property Performance
          </h2>
        </div>

        <Link
          to={ROUTES.OWNER_PROPERTIES}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
        >
          <span>View All</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="mt-4 overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between py-2.5 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-100" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-slate-100 rounded" />
                    <div className="h-2.5 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-3.5 w-16 bg-slate-100 rounded" />
                <div className="h-3.5 w-16 bg-slate-100 rounded" />
                <div className="h-6 w-12 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-2">
              <Building2 className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              No properties found.
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 max-w-xs">
              Add your properties to begin viewing performance analytics and revenue metrics.
            </p>
            <Link
              to={ROUTES.OWNER_ADD_PROPERTY}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Property</span>
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="pb-3 font-semibold">Property</th>
                <th className="pb-3 font-semibold">Occupancy</th>
                <th className="pb-3 font-semibold">Revenue</th>
                <th className="pb-3 font-semibold text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {properties.slice(0, 5).map((property, idx) => {
                const coverImage = getImageUrl(property);
                const location =
                  property.city ||
                  property.taluka ||
                  property.district ||
                  property.property_type ||
                  "Konkan";

                const occupancy =
                  property.occupancy_rate !== undefined &&
                  property.occupancy_rate !== null
                    ? Number(property.occupancy_rate)
                    : null;

                const propertyRevenue =
                  property.total_revenue !== undefined
                    ? Number(property.total_revenue)
                    : (Number(property.total_bookings) || 0) * (Number(property.base_price) || 2450);

                const rating =
                  Number(property.average_rating || property.star_rating) || 0;

                return (
                  <tr
                    key={property.property_id || idx}
                    className="hover:bg-slate-50/70 transition"
                  >
                    {/* Property Thumbnail & Name */}
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={property.property_name}
                            onError={(e) => handleImageError(e, DEFAULT_PROPERTY_IMAGE)}
                            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200/80 shrink-0"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                            <Building2 className="h-4 w-4" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[130px]">
                            {property.property_name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                            {location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Occupancy Rate */}
                    <td className="py-3.5 px-2">
                      {occupancy !== null ? (
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800">
                            {occupancy}%
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(occupancy, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-2 font-semibold text-slate-900 whitespace-nowrap">
                      {propertyRevenue > 0
                        ? `₹${propertyRevenue.toLocaleString("en-IN")}`
                        : "₹0"}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 pl-2 text-right">
                      {rating > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                          <span>{rating.toFixed(1)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">New</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PropertyPerformanceTable;
