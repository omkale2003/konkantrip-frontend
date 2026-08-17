import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../../components/ui/Button/Button.jsx";
import { 
  useRoomBeds, 
  useAddRoomBed, 
  useDeleteRoomBed, 
  useRoomLookups 
} from "../hooks/useRooms.js";

const bedSchema = z.object({
  bed_type_id: z.string().min(1, "Bed type is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
});

function RoomBeds({ roomId }) {
  const { data: bedsData, isLoading: isLoadingBeds } = useRoomBeds(roomId);
  const { data: bedTypesData } = useRoomLookups("BED_TYPES");
  
  const { mutateAsync: addBed, isPending: isAdding } = useAddRoomBed();
  const { mutateAsync: deleteBed, isPending: isDeleting } = useDeleteRoomBed();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const beds = bedsData?.data || [];
  const bedTypes = bedTypesData?.data || [];

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bedSchema),
    defaultValues: {
      bed_type_id: "",
      quantity: 1,
    }
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");
      await addBed({ roomId, data });
      reset();
      setIsFormOpen(false);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add bed.");
    }
  };

  const handleDelete = async (bedId) => {
    try {
      await deleteBed({ roomId, bedId });
    } catch (error) {
      console.error("Failed to delete bed", error);
    }
  };

  if (isLoadingBeds) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Beds</h2>
          <p className="text-sm text-slate-500">Manage the beds available in this room.</p>
        </div>
        {!isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Bed
          </Button>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-slate-700">Bed Type</label>
              <select
                {...register("bed_type_id")}
                className="block w-full rounded-md border-slate-300 py-2 px-3 sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">Select Bed Type</option>
                {bedTypes.map(t => (
                  <option key={t.bed_type_id} value={t.bed_type_id.toString()}>
                    {t.bed_type_name} {t.bed_size ? `(${t.bed_size})` : ''}
                  </option>
                ))}
              </select>
              {errors.bed_type_id && (
                <p className="text-xs text-red-600">{errors.bed_type_id.message}</p>
              )}
            </div>

            <div className="w-32 space-y-1">
              <label className="text-xs font-medium text-slate-700">Quantity</label>
              <input
                {...register("quantity")}
                type="number"
                min="1"
                className="block w-full rounded-md border-slate-300 py-2 px-3 sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.quantity && (
                <p className="text-xs text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div className="flex gap-2 self-end mb-0.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setIsFormOpen(false); reset(); }}
                disabled={isAdding}
                className="bg-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isAdding}
                className="bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {beds.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Bed Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {beds.map((bed) => (
                <tr key={bed.room_bed_id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{bed.bed_type_name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{bed.bed_size || "-"}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{bed.quantity}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(bed.room_bed_id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 border-dashed p-8 text-center text-slate-500">
          No beds configured for this room yet.
        </div>
      )}
    </div>
  );
}

export default RoomBeds;
