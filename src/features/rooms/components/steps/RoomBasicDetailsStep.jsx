import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Tag, Eye, IndianRupee } from "lucide-react";
import { useRoomLookups } from "../../hooks/useRooms.js";
import { useProperties } from "../../../properties/hooks/useProperties.js";
import storageService from "../../../../services/storage.service.js";
import {
  roomBasicDetailsSchema,
  defaultRoomBasicDetailsValues,
} from "../../schemas/room.schema.js";

function RoomBasicDetailsStep({ defaultValues, onSubmit, isSubmitting, initialPropertyId }) {
  const owner = storageService.getOwner();
  const { data: propertiesData } = useProperties({
    owner_id: owner?.p_owner_id || undefined,
    limit: 100,
  });
  const { data: roomTypesData } = useRoomLookups("ROOM_TYPES");
  const { data: roomStatusData } = useRoomLookups("ROOM_STATUS");
  const { data: roomViewsData } = useRoomLookups("ROOM_VIEWS");

  const properties = propertiesData?.data || [];
  const roomTypes = roomTypesData?.data || [];
  const roomStatuses = roomStatusData?.data || [];
  const roomViews = roomViewsData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(roomBasicDetailsSchema),
    defaultValues: {
      ...defaultRoomBasicDetailsValues,
      property_id: initialPropertyId ? initialPropertyId.toString() : "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        property_id: defaultValues.property_id ? defaultValues.property_id.toString() : initialPropertyId ? initialPropertyId.toString() : "",
        room_name: defaultValues.room_name || "",
        room_code: defaultValues.room_code || "",
        price: defaultValues.price ?? defaultValues.base_price ?? 0,
        room_type_id: defaultValues.room_type_id ? defaultValues.room_type_id.toString() : "",
        room_status_id: defaultValues.room_status_id ? defaultValues.room_status_id.toString() : "",
        room_view_id: defaultValues.room_view_id ? defaultValues.room_view_id.toString() : "",
        description: defaultValues.description || "",
        sort_order: defaultValues.sort_order ?? 1,
        is_bookable: defaultValues.is_bookable !== undefined ? Boolean(defaultValues.is_bookable) : true,
        is_published: defaultValues.is_published !== undefined ? Boolean(defaultValues.is_published) : true,
      });
    } else if (initialPropertyId && !watch("property_id")) {
      setValue("property_id", initialPropertyId.toString());
    }
  }, [defaultValues, initialPropertyId, reset, setValue, watch]);

  const isBookable = watch("is_bookable");
  const isPublished = watch("is_published");

  return (
    <form id="room-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Basic Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Hotel className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Basic Details</h2>
            <p className="text-xs text-slate-500">Enter basic information about the room</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Property Dropdown */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700">
              Property <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("property_id")}
                className="block w-full rounded-lg border border-slate-300 py-2.5 px-3.5 text-sm text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Select Property</option>
                {properties.map((p) => (
                  <option key={p.property_id} value={p.property_id.toString()}>
                    {p.property_name}
                  </option>
                ))}
              </select>
            </div>
            {errors.property_id && (
              <p className="text-xs text-red-600 font-medium">{errors.property_id.message}</p>
            )}
          </div>

          {/* Room Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("room_name")}
              type="text"
              placeholder="e.g. Deluxe Sea View"
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.room_name && (
              <p className="text-xs text-red-600 font-medium">{errors.room_name.message}</p>
            )}
          </div>

          {/* Room Code */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Room Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register("room_code")}
              type="text"
              placeholder="e.g. DSV-101"
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.room_code && (
              <p className="text-xs text-red-600 font-medium">{errors.room_code.message}</p>
            )}
          </div>

          {/* Room Price (Per Night) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Room Price (₹ / Night)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <IndianRupee className="h-4 w-4 text-slate-400" />
              </span>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 2500"
                className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-600 font-medium">{errors.price.message}</p>
            )}
          </div>

          {/* Room Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("room_type_id")}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Select Room Type</option>
              {roomTypes.map((t) => (
                <option key={t.room_type_id} value={t.room_type_id.toString()}>
                  {t.room_type_name}
                </option>
              ))}
            </select>
            {errors.room_type_id && (
              <p className="text-xs text-red-600 font-medium">{errors.room_type_id.message}</p>
            )}
          </div>

          {/* Room Status */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Room Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("room_status_id")}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Select Status</option>
              {roomStatuses.map((s) => (
                <option key={s.room_status_id} value={s.room_status_id.toString()}>
                  {s.status_name}
                </option>
              ))}
            </select>
            {errors.room_status_id && (
              <p className="text-xs text-red-600 font-medium">{errors.room_status_id.message}</p>
            )}
          </div>

          {/* Room View */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700">
              Room View <span className="text-red-500">*</span>
            </label>
            <select
              {...register("room_view_id")}
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Select Room View</option>
              {roomViews.map((v) => (
                <option key={v.room_view_id} value={v.room_view_id.toString()}>
                  {v.room_view_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Additional Details */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Additional Details</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Room Description */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700">Room Description</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Enter room description..."
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Display Order */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Display Order</label>
            <input
              {...register("sort_order")}
              type="number"
              min="0"
              className="block w-full rounded-lg border border-slate-300 py-2 px-3.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Toggles / Checkboxes */}
          <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_bookable")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700">Bookable Room</span>
            </label>

            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_published")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700">Published</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RoomBasicDetailsStep;
