import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, User, Baby, BedDouble, Building, ListOrdered } from "lucide-react";

const capacitySchema = z.object({
  maximum_guests: z.coerce.number().min(1, "Max guests must be at least 1").default(2),
  maximum_adults: z.coerce.number().min(1, "Max adults must be at least 1").default(2),
  maximum_children: z.coerce.number().min(0).default(0),
  base_occupancy: z.coerce.number().min(1).default(2),
  extra_bed_allowed: z.coerce.number().default(1),
  extra_bed_price: z.coerce.number().min(0).default(0),
  extra_bed_count: z.coerce.number().min(0).default(1),
  floor_number: z.string().optional(),
  is_bookable: z.boolean().default(true),
  is_published: z.boolean().default(true),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().min(0).default(1),
  smoking_allowed: z.coerce.number().default(0),
  pets_allowed: z.coerce.number().default(0),
});

function RoomCapacityStep({ defaultValues, onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(capacitySchema),
    defaultValues: {
      maximum_guests: 2,
      maximum_adults: 2,
      maximum_children: 0,
      base_occupancy: 2,
      extra_bed_allowed: 1,
      extra_bed_price: 0,
      extra_bed_count: 1,
      floor_number: "2",
      is_bookable: true,
      is_published: true,
      is_active: true,
      sort_order: 1,
      smoking_allowed: 0,
      pets_allowed: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        maximum_guests: defaultValues.maximum_guests ?? 2,
        maximum_adults: defaultValues.maximum_adults ?? 2,
        maximum_children: defaultValues.maximum_children ?? 0,
        base_occupancy: defaultValues.base_occupancy || defaultValues.maximum_occupancy || 2,
        extra_bed_allowed: defaultValues.extra_bed_allowed ? 1 : 0,
        extra_bed_price: defaultValues.extra_bed_price ?? 0,
        extra_bed_count: defaultValues.extra_bed_count ?? 1,
        floor_number: defaultValues.floor_number ? defaultValues.floor_number.toString() : "2",
        is_bookable: defaultValues.is_bookable !== undefined ? Boolean(defaultValues.is_bookable) : true,
        is_published: defaultValues.is_published !== undefined ? Boolean(defaultValues.is_published) : true,
        is_active: defaultValues.is_active !== undefined ? Boolean(defaultValues.is_active) : true,
        sort_order: defaultValues.sort_order ?? 1,
        smoking_allowed: defaultValues.smoking_allowed ? 1 : 0,
        pets_allowed: defaultValues.pets_allowed ? 1 : 0,
      });
    }
  }, [defaultValues, reset]);

  const isBookable = watch("is_bookable");
  const isPublished = watch("is_published");
  const isActive = watch("is_active");
  const extraBedAllowed = watch("extra_bed_allowed");
  const smokingAllowed = watch("smoking_allowed");
  const petsAllowed = watch("pets_allowed");

  const handleFormSubmit = (data) => {
    // Format numeric booleans for database compatibility
    onSubmit({
      ...data,
      extra_bed_allowed: Number(data.extra_bed_allowed),
      smoking_allowed: Number(data.smoking_allowed),
      pets_allowed: Number(data.pets_allowed),
      is_bookable: Boolean(data.is_bookable),
      is_published: Boolean(data.is_published),
      is_active: Boolean(data.is_active),
    });
  };

  return (
    <form id="room-step-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Capacity & Configuration</h2>
          <p className="text-xs text-slate-500">Set capacity, occupancy and availability preferences</p>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Maximum Guests */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Maximum Guests <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Users className="h-4 w-4" />
            </span>
            <input
              {...register("maximum_guests")}
              type="number"
              min="1"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          {errors.maximum_guests && (
            <p className="text-xs text-red-600 font-medium">{errors.maximum_guests.message}</p>
          )}
        </div>

        {/* Maximum Adults */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Maximum Adults</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User className="h-4 w-4" />
            </span>
            <input
              {...register("maximum_adults")}
              type="number"
              min="1"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Maximum Children */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Maximum Children</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Baby className="h-4 w-4" />
            </span>
            <input
              {...register("maximum_children")}
              type="number"
              min="0"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Maximum Occupancy */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Maximum Occupancy</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Users className="h-4 w-4" />
            </span>
            <input
              {...register("base_occupancy")}
              type="number"
              min="1"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Extra Bed Allowed */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Extra Bed Allowed</label>
          <div className="flex gap-4 pt-1.5">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={1}
                checked={Number(extraBedAllowed) === 1}
                onChange={() => setValue("extra_bed_allowed", 1)}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700">Yes</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={0}
                checked={Number(extraBedAllowed) === 0}
                onChange={() => setValue("extra_bed_allowed", 0)}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700">No</span>
            </label>
          </div>
        </div>

        {/* Extra Bed Charge */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Extra Bed Charge (per night)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-semibold text-xs">
              ₹
            </span>
            <input
              {...register("extra_bed_price")}
              type="number"
              min="0"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Total Rooms */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Total Rooms (of this type)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <BedDouble className="h-4 w-4" />
            </span>
            <input
              {...register("extra_bed_count")}
              type="number"
              min="1"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Floor Number */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Floor Number</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Building className="h-4 w-4" />
            </span>
            <input
              {...register("floor_number")}
              type="text"
              placeholder="e.g. 2"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Toggles Box */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
        {/* Bookable Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Bookable</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Allow this room to be booked</span>
          </div>
          <button
            type="button"
            onClick={() => setValue("is_bookable", !isBookable)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isBookable ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isBookable ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Published Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Published</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Show this room on website/app</span>
          </div>
          <button
            type="button"
            onClick={() => setValue("is_published", !isPublished)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isPublished ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPublished ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Active</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Room is active</span>
          </div>
          <button
            type="button"
            onClick={() => setValue("is_active", !isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bottom Row: Display Order, Smoking, Pet Friendly */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 pt-2">
        {/* Display Order */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Display Order</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <ListOrdered className="h-4 w-4" />
            </span>
            <input
              {...register("sort_order")}
              type="number"
              min="0"
              className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Smoking Allowed */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Smoking Allowed</label>
          <p className="text-[11px] text-slate-500 mb-1">Is smoking allowed in this room?</p>
          <div className="flex gap-4 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={1}
                checked={Number(smokingAllowed) === 1}
                onChange={() => setValue("smoking_allowed", 1)}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700">Yes</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={0}
                checked={Number(smokingAllowed) === 0}
                onChange={() => setValue("smoking_allowed", 0)}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700">No</span>
            </label>
          </div>
        </div>

        {/* Pet Friendly */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Pet Friendly</label>
          <p className="text-[11px] text-slate-500 mb-1">Are pets allowed in this room?</p>
          <div className="flex gap-4 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={1}
                checked={Number(petsAllowed) === 1}
                onChange={() => setValue("pets_allowed", 1)}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700">Yes</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={0}
                checked={Number(petsAllowed) === 0}
                onChange={() => setValue("pets_allowed", 0)}
                className="h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700">No</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RoomCapacityStep;
