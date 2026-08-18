import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, IndianRupee } from "lucide-react";

import Button from "../../../components/ui/Button/Button.jsx";
import { useRoomLookups } from "../hooks/useRooms.js";
import {
  roomQuickFormSchema,
  defaultRoomQuickFormValues,
} from "../schemas/room.schema.js";

function RoomForm({ defaultValues, onSubmit, isSubmitting, onCancel }) {
  const { data: roomTypesData } = useRoomLookups("ROOM_TYPES");
  const { data: roomStatusData } = useRoomLookups("ROOM_STATUS");

  const roomTypes = roomTypesData?.data || [];
  const roomStatuses = roomStatusData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(roomQuickFormSchema),
    defaultValues: defaultValues || defaultRoomQuickFormValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        price: defaultValues.price ?? defaultValues.base_price ?? 0,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Room Name</label>
          <input
            {...register("room_name")}
            type="text"
            placeholder="e.g. Deluxe Ocean View"
            className="block w-full rounded-md border-slate-300 py-2 px-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          {errors.room_name && (
            <p className="text-xs text-red-600">{errors.room_name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Room Code</label>
          <input
            {...register("room_code")}
            type="text"
            placeholder="e.g. DLX-OCEAN"
            className="block w-full rounded-md border-slate-300 py-2 px-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          {errors.room_code && (
            <p className="text-xs text-red-600">{errors.room_code.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Room Price (₹ / Night)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <IndianRupee className="h-4 w-4" />
            </span>
            <input
              {...register("price")}
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 2500"
              className="block w-full rounded-md border-slate-300 py-2 pl-9 pr-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
          </div>
          {errors.price && (
            <p className="text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Room Type</label>
          <select
            {...register("room_type_id")}
            className="block w-full rounded-md border-slate-300 py-2 px-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            {roomTypes.map(t => (
              <option key={t.room_type_id} value={t.room_type_id.toString()}>
                {t.room_type_name}
              </option>
            ))}
          </select>
          {errors.room_type_id && (
            <p className="text-xs text-red-600">{errors.room_type_id.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Room Status</label>
          <select
            {...register("room_status_id")}
            className="block w-full rounded-md border-slate-300 py-2 px-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          >
            <option value="">Select Status</option>
            {roomStatuses.map(s => (
              <option key={s.room_status_id} value={s.room_status_id.toString()}>
                {s.status_name}
              </option>
            ))}
          </select>
          {errors.room_status_id && (
            <p className="text-xs text-red-600">{errors.room_status_id.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Base Guests</label>
          <input
            {...register("base_occupancy")}
            type="number"
            min="1"
            className="block w-full rounded-md border-slate-300 py-2 px-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          {errors.base_occupancy && (
            <p className="text-xs text-red-600">{errors.base_occupancy.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Maximum Guests</label>
          <input
            {...register("maximum_guests")}
            type="number"
            min="1"
            className="block w-full rounded-md border-slate-300 py-2 px-3 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          {errors.maximum_guests && (
            <p className="text-xs text-red-600">{errors.maximum_guests.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("is_bookable")} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-sm text-slate-700">Is Bookable</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("is_published")} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-sm text-slate-700">Is Published</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-700 text-white hover:bg-emerald-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Room"
          )}
        </Button>
      </div>
    </form>
  );
}

export default RoomForm;
