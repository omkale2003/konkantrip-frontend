import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Shield, CheckSquare, Square, AlertCircle } from "lucide-react";
import SalesforceProfileMatrix from "./SalesforceProfileMatrix.jsx";

const roleSchema = z.object({
  role_name: z.string().min(1, "Role name is required").max(100),
  role_description: z.string().max(255).optional(),
  is_active: z.boolean().default(true),
  permissions: z.array(z.coerce.number()).optional().default([]),
});

function RoleFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialRole = null,
  permissions = [],
  isSubmitting = false,
  serverError = "",
}) {
  const isEditing = Boolean(initialRole?.role_id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role_name: "",
      role_description: "",
      is_active: true,
      permissions: [],
    },
  });

  const selectedPermissions = watch("permissions") || [];

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const mod = perm.module || "General";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  useEffect(() => {
    if (isOpen) {
      if (initialRole) {
        const permIds = (initialRole.permissions || []).map((p) => p.permission_id);
        reset({
          role_name: initialRole.role_name || "",
          role_description: initialRole.role_description || "",
          is_active: initialRole.is_active !== false,
          permissions: permIds,
        });
      } else {
        reset({
          role_name: "",
          role_description: "",
          is_active: true,
          permissions: [],
        });
      }
    }
  }, [isOpen, initialRole, reset]);

  if (!isOpen) return null;

  const handleTogglePermission = (permId) => {
    const numId = Number(permId);
    let next;
    if (selectedPermissions.includes(numId)) {
      next = selectedPermissions.filter((id) => id !== numId);
    } else {
      next = [...selectedPermissions, numId];
    }
    setValue("permissions", next);
  };

  const handleToggleModule = (moduleName) => {
    const modulePerms = groupedPermissions[moduleName] || [];
    const modulePermIds = modulePerms.map((p) => p.permission_id);
    const allSelected = modulePermIds.every((id) =>
      selectedPermissions.includes(id)
    );

    let next;
    if (allSelected) {
      next = selectedPermissions.filter((id) => !modulePermIds.includes(id));
    } else {
      const toAdd = modulePermIds.filter(
        (id) => !selectedPermissions.includes(id)
      );
      next = [...selectedPermissions, ...toAdd];
    }
    setValue("permissions", next);
  };

  const handleSelectAll = () => {
    const allIds = permissions.map((p) => p.permission_id);
    setValue("permissions", allIds);
  };

  const handleDeselectAll = () => {
    setValue("permissions", []);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? "Edit Custom Role" : "Create Custom Role"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure role title and granular RBAC permissions
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

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Basic Details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Shift Manager"
                {...register("role_name")}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.role_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.role_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Role Description
              </label>
              <input
                type="text"
                placeholder="Brief summary of responsibilities..."
                {...register("role_description")}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Permissions ({selectedPermissions.length} selected)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Configure granular object access and operational permissions
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="font-semibold text-slate-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <SalesforceProfileMatrix
              availablePermissions={permissions}
              selectedPermissionIds={selectedPermissions}
              onTogglePermission={handleTogglePermission}
              onToggleModule={handleToggleModule}
              isReadOnly={false}
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Role"
                : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoleFormModal;
