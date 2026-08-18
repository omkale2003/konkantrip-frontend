import React, { useState } from "react";
import { History, Search, Filter, Calendar, User, Building, Eye, Download, ShieldCheck, ArrowRight, X } from "lucide-react";
import { useAuditLogs } from "../hooks/useAuditLogs.js";

const MODULE_OPTIONS = ["All", "Rooms", "Properties", "Inventory", "Bookings", "Pricing", "Employees", "Roles", "Auth"];
const ACTION_OPTIONS = ["All", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"];

export function AuditTrailTab({ properties = [], employees = [] }) {
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedAction, setSelectedAction] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [inspectLog, setInspectLog] = useState(null);

  const queryParams = {
    page,
    limit: 25,
    ...(search && { search }),
    ...(selectedModule !== "All" && { module: selectedModule }),
    ...(selectedAction !== "All" && { action: selectedAction }),
    ...(selectedEmployee !== "All" && { employee_id: selectedEmployee }),
    ...(selectedProperty !== "All" && { property_id: selectedProperty }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: response, isLoading } = useAuditLogs(queryParams);
  const logs = response?.data || [];
  const total = response?.total || 0;
  const totalPages = response?.totalPages || 1;

  const getActionBadge = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UPDATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "LOGIN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "LOGOUT":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ["Audit ID", "Timestamp", "User Name", "Role", "Module", "Action", "Record Name", "Description", "IP Address"];
    const csvRows = logs.map((log) => [
      log.audit_id,
      `"${new Date(log.created_at).toLocaleString()}"`,
      `"${log.user_name || ""}"`,
      `"${log.user_role || ""}"`,
      `"${log.module || ""}"`,
      `"${log.action || ""}"`,
      `"${log.record_name || ""}"`,
      `"${(log.description || "").replace(/"/g, '""')}"`,
      `"${log.ip_address || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_trail_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Enterprise Audit Trail & Change Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all employee operational activities, configuration updates, and session logins.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={logs.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, record or change..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Module Filter */}
          <div>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {MODULE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  Module: {m}
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  Action: {a}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Filter */}
          <div>
            <select
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Staff Members</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.first_name} {emp.last_name} ({emp.designation || emp.role_name || "Staff"})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Trail Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 min-w-[140px]">Date & Time</th>
                <th className="py-3.5 px-4 min-w-[160px]">Staff Member</th>
                <th className="py-3.5 px-3">Module</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-4 min-w-[240px]">Change Description</th>
                <th className="py-3.5 px-3 min-w-[120px]">IP & Device</th>
                <th className="py-3.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading audit trail history...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.audit_id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    {/* Staff */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{log.user_name || "System"}</div>
                      <div className="text-[11px] text-slate-400">{log.user_role || log.user_type}</div>
                    </td>

                    {/* Module */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                        {log.module}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium truncate max-w-md" title={log.description}>
                        {log.description}
                      </div>
                      {log.property_name && (
                        <span className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" /> {log.property_name}
                        </span>
                      )}
                    </td>

                    {/* IP & Device */}
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {log.ip_address || "—"}
                    </td>

                    {/* View Diff */}
                    <td className="py-3.5 px-3 text-right">
                      {log.changes_diff ? (
                        <button
                          onClick={() => setInspectLog(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Diff
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[11px]">No Diff</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {logs.length} of {total} total logs
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Diff Inspector Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Audit Change Diff Inspector #{inspectLog.audit_id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {inspectLog.action} on {inspectLog.module} "{inspectLog.record_name || 'Record'}" by {inspectLog.user_name}
                </p>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Field-Level Alterations:
              </div>

              <div className="space-y-3">
                {inspectLog.changes_diff &&
                  Object.entries(inspectLog.changes_diff).map(([field, delta]) => (
                    <div key={field} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wider bg-slate-200/60 px-2 py-0.5 rounded">
                        {field}
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-800">
                          <span className="font-semibold block text-[10px] uppercase text-rose-500 mb-0.5">Previous Value</span>
                          <code>{delta?.from !== null && delta?.from !== undefined ? JSON.stringify(delta.from) : "null"}</code>
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800">
                          <span className="font-semibold block text-[10px] uppercase text-emerald-500 mb-0.5">New Value</span>
                          <code>{delta?.to !== null && delta?.to !== undefined ? JSON.stringify(delta.to) : "null"}</code>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditTrailTab;
