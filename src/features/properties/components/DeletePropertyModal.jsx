import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import { useDeleteProperty } from "../hooks/useProperties.js";

function DeletePropertyModal({ isOpen, onClose, property }) {
  const deleteMutation = useDeleteProperty();
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !property) return null;

  const isDraft = (property.property_status || "").toLowerCase().includes("draft");

  const handleDelete = async () => {
    setErrorMsg("");
    try {
      await deleteMutation.mutateAsync(property.property_id);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete property. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Trash2 className="h-6 w-6" />
          </div>

          <div className="space-y-1 pr-6">
            <h3 className="text-lg font-bold text-slate-900">
              {isDraft ? "Delete Draft Property" : "Delete Property"}
            </h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-800">
                "{property.property_name || `Property #${property.property_id}`}"
              </span>
              ?
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">This action cannot be undone.</p>
            <p className="mt-0.5 text-amber-700 font-medium">
              {isDraft
                ? "All unfinished configuration steps and details for this draft will be permanently removed."
                : "This property, its associated rooms, and draft listings will be deactivated."}
            </p>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-2xs"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete {isDraft ? "Draft" : "Property"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePropertyModal;
