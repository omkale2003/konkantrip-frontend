import { useState, useEffect } from "react";
import { X, Building2, Check, AlertCircle, Plus, Trash2 } from "lucide-react";

function PropertyAssignmentModal({
  isOpen,
  onClose,
  employee,
  properties = [],
  onAssign,
  onUnassign,
  isSubmitting = false,
}) {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedPropertyId("");
      setIsPrimary(false);
      setLocalError("");
    }
  }, [isOpen, employee]);

  if (!isOpen || !employee) return null;

  const assigned = employee.assigned_properties || [];
  const assignedIds = new Set(assigned.map((p) => p.property_id));
  const availableProperties = properties.filter(
    (p) => !assignedIds.has(p.property_id)
  );

  const handleAddAssignment = async () => {
    if (!selectedPropertyId) {
      setLocalError("Please select a property to assign");
      return;
    }
    setLocalError("");
    try {
      await onAssign({
        id: employee.employee_id,
        property_id: Number(selectedPropertyId),
        is_primary: isPrimary,
      });
      setSelectedPropertyId("");
      setIsPrimary(false);
    } catch (err) {
      setLocalError(err?.response?.data?.message || "Failed to assign property");
    }
  };

  const handleRemoveAssignment = async (propertyId) => {
    setLocalError("");
    try {
      await onUnassign({
        id: employee.employee_id,
        propertyId,
      });
    } catch (err) {
      setLocalError(err?.response?.data?.message || "Failed to remove assignment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Property Assignments
              </h2>
              <p className="text-xs text-slate-500">
                Manage property locations for {employee.first_name} {employee.last_name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Add New Assignment Form */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assign New Property
            </h4>

            {availableProperties.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                All available properties are already assigned to this employee.
              </p>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Select Property
                  </label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Choose Property --</option>
                    {availableProperties.map((p) => (
                      <option key={p.property_id} value={p.property_id}>
                        {p.property_name} ({p.property_type || "Hotel"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Set as Primary Location</span>
                  </label>

                  <button
                    type="button"
                    disabled={isSubmitting || !selectedPropertyId}
                    onClick={handleAddAssignment}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Assign
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Assignments List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Assigned Properties ({assigned.length})
            </h4>

            {assigned.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No active property assignments.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {assigned.map((p) => (
                  <div
                    key={p.property_id}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {p.property_name}
                        </p>
                        {p.is_primary && (
                          <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRemoveAssignment(p.property_id)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Unassign Property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyAssignmentModal;
