import { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Loader2,
  AlertCircle,
  Building2,
  RefreshCw,
  Sparkles,
  History,
} from "lucide-react";

import EmployeeStatsCards from "../components/EmployeeStatsCards.jsx";
import EmployeeFilters from "../components/EmployeeFilters.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import EmployeeCardGrid from "../components/EmployeeCardGrid.jsx";
import EmployeeFormModal from "../components/EmployeeFormModal.jsx";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal.jsx";
import PropertyAssignmentModal from "../components/PropertyAssignmentModal.jsx";
import RolesTab from "../components/RolesTab.jsx";
import RoleFormModal from "../components/RoleFormModal.jsx";
import AuditTrailTab from "../components/AuditTrailTab.jsx";
import EmployeeSessionsModal from "../components/EmployeeSessionsModal.jsx";

import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useAssignProperty,
  useUnassignProperty,
} from "../hooks/useEmployees.js";
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../hooks/useRoles.js";
import { useProperties } from "../../properties/hooks/useProperties.js";
import storageService from "../../../services/storage.service.js";
import PermissionGate from "../../../components/common/PermissionGate.jsx";
import useAuth from "../../auth/hooks/useAuth.js";

function EmployeesPage() {
  const [activeTab, setActiveTab] = useState("staff"); // "staff" | "roles" | "audit"
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningEmployee, setAssigningEmployee] = useState(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [sessionEmployee, setSessionEmployee] = useState(null);

  const [formServerError, setFormServerError] = useState("");

  // Queries
  const owner = storageService.getOwner();
  const { data: propertiesData } = useProperties({
    owner_id: owner?.p_owner_id,
    limit: 100,
  });
  const properties = propertiesData?.data || [];

  const {
    data: employeesData,
    isLoading: isLoadingEmployees,
    isError: isEmployeesError,
    error: employeesError,
    refetch: refetchEmployees,
  } = useEmployees({
    search: searchTerm || undefined,
    property_id: selectedProperty || undefined,
    role_id: selectedRole || undefined,
    status: selectedStatus || undefined,
  });
  const employees = employeesData?.data || [];

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
  const roles = rolesData?.data || [];

  const { data: permissionsData } = usePermissions();
  const permissions = permissionsData?.data || [];

  // Mutations
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const assignPropertyMutation = useAssignProperty();
  const unassignPropertyMutation = useUnassignProperty();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  // Handlers - Employees
  const handleOpenAddEmployee = () => {
    setFormServerError("");
    setEditingEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setFormServerError("");
    setEditingEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = async (formData) => {
    setFormServerError("");
    try {
      if (editingEmployee) {
        await updateEmployeeMutation.mutateAsync({
          id: editingEmployee.employee_id,
          payload: formData,
        });
      } else {
        await createEmployeeMutation.mutateAsync(formData);
      }
      setIsEmployeeModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      setFormServerError(
        err?.response?.data?.message || "Failed to save employee profile."
      );
    }
  };

  const handleDeleteEmployee = async (emp) => {
    const fullName = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
    if (
      window.confirm(
        `Are you sure you want to deactivate / remove ${fullName}?`
      )
    ) {
      try {
        await deleteEmployeeMutation.mutateAsync(emp.employee_id);
      } catch (err) {
        alert(
          err?.response?.data?.message || "Failed to delete employee profile."
        );
      }
    }
  };

  const handleViewEmployee = (emp) => {
    setViewingEmployee(emp);
    setIsDetailsModalOpen(true);
  };

  const handleOpenAssignProperty = (emp) => {
    setAssigningEmployee(emp);
    setIsAssignModalOpen(true);
  };

  const handleOpenSessions = (emp) => {
    setSessionEmployee(emp);
    setIsSessionsModalOpen(true);
  };

  // Handlers - Roles
  const handleOpenCreateRole = () => {
    setFormServerError("");
    setEditingRole(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role) => {
    setFormServerError("");
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async (formData) => {
    setFormServerError("");
    try {
      if (editingRole) {
        await updateRoleMutation.mutateAsync({
          id: editingRole.role_id,
          payload: formData,
        });
      } else {
        await createRoleMutation.mutateAsync(formData);
      }
      setIsRoleModalOpen(false);
      setEditingRole(null);
    } catch (err) {
      setFormServerError(
        err?.response?.data?.message || "Failed to save role definition."
      );
    }
  };

  const handleDeleteRole = async (role) => {
    if (
      window.confirm(
        `Are you sure you want to delete the custom role "${role.role_name}"?`
      )
    ) {
      try {
        await deleteRoleMutation.mutateAsync(role.role_id);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete custom role.");
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedProperty("");
    setSelectedRole("");
    setSelectedStatus("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Staff & CRM Management
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Workforce & Governance
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Oversee on-site property staff, Salesforce-style profile permissions, active sessions, and change audit trails.
          </p>
        </div>

        {activeTab === "staff" && (
          <PermissionGate permission="employees:create">
            <button
              type="button"
              onClick={handleOpenAddEmployee}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <UserPlus className="h-4 w-4" />
              Add Employee
            </button>
          </PermissionGate>
        )}
      </div>

      {/* Stats Summary Cards */}
      <EmployeeStatsCards
        employees={employees}
        roles={roles}
        properties={properties}
      />

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-bold transition ${
              activeTab === "staff"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <Users className="h-4 w-4" />
            Staff Directory ({employees.length})
          </button>

          <PermissionGate permission="roles:read">
            <button
              type="button"
              onClick={() => setActiveTab("roles")}
              className={`flex items-center gap-2 border-b-2 py-3 text-sm font-bold transition ${
                activeTab === "roles"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <Shield className="h-4 w-4" />
              Roles & Permissions ({roles.length})
            </button>
          </PermissionGate>

          <PermissionGate permission="audit:read">
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-2 border-b-2 py-3 text-sm font-bold transition ${
                activeTab === "audit"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <History className="h-4 w-4" />
              Audit Trail & Governance
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Tab 1: Staff Directory */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <EmployeeFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedProperty={selectedProperty}
            onPropertyChange={setSelectedProperty}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            properties={properties}
            roles={roles}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
          />

          {/* Loading State */}
          {isLoadingEmployees && (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          )}

          {/* Error State */}
          {!isLoadingEmployees && isEmployeesError && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-12 text-center text-red-700">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Failed to load employees list</p>
              <p className="mt-1 text-xs text-red-600">
                {employeesError?.message || "Please check your network and try again."}
              </p>
              <button
                type="button"
                onClick={() => refetchEmployees()}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Table or Grid View */}
          {!isLoadingEmployees && !isEmployeesError && (
            <>
              {viewMode === "table" ? (
                <EmployeeTable
                  employees={employees}
                  onViewEmployee={handleViewEmployee}
                  onEditEmployee={handleOpenEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onAssignProperty={handleOpenAssignProperty}
                  onManageSessions={handleOpenSessions}
                />
              ) : (
                <EmployeeCardGrid
                  employees={employees}
                  onViewEmployee={handleViewEmployee}
                  onEditEmployee={handleOpenEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onAssignProperty={handleOpenAssignProperty}
                  onManageSessions={handleOpenSessions}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Tab 2: Roles & Permissions Matrix */}
      {activeTab === "roles" && (
        <RolesTab
          roles={roles}
          permissions={permissions}
          onCreateRole={handleOpenCreateRole}
          onEditRole={handleOpenEditRole}
          onDeleteRole={handleDeleteRole}
        />
      )}

      {/* Tab 3: Audit Trail & Governance */}
      {activeTab === "audit" && (
        <AuditTrailTab
          properties={properties}
          employees={employees}
        />
      )}

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleSaveEmployee}
        initialData={editingEmployee}
        roles={roles}
        properties={properties}
        isSubmitting={
          createEmployeeMutation.isPending || updateEmployeeMutation.isPending
        }
        serverError={formServerError}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingEmployee(null);
        }}
        employee={viewingEmployee}
        onEdit={(emp) => handleOpenEditEmployee(emp)}
        onManageProperties={(emp) => handleOpenAssignProperty(emp)}
        onManageSessions={(emp) => handleOpenSessions(emp)}
      />

      <PropertyAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssigningEmployee(null);
        }}
        employee={assigningEmployee}
        properties={properties}
        onAssign={(payload) => assignPropertyMutation.mutateAsync(payload)}
        onUnassign={(payload) => unassignPropertyMutation.mutateAsync(payload)}
        isSubmitting={
          assignPropertyMutation.isPending || unassignPropertyMutation.isPending
        }
      />

      <RoleFormModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSaveRole}
        initialRole={editingRole}
        permissions={permissions}
        isSubmitting={
          createRoleMutation.isPending || updateRoleMutation.isPending
        }
        serverError={formServerError}
      />

      <EmployeeSessionsModal
        isOpen={isSessionsModalOpen}
        onClose={() => {
          setIsSessionsModalOpen(false);
          setSessionEmployee(null);
        }}
        employee={sessionEmployee}
      />
    </div>
  );
}

export default EmployeesPage;
