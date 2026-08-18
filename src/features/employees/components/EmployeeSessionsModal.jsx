import React from "react";
import { Monitor, Smartphone, Tablet, X, ShieldAlert, CheckCircle2, Clock, MapPin, Globe } from "lucide-react";
import { useEmployeeSessions, useRevokeSession, useRevokeAllSessions } from "../hooks/useEmployeeSessions.js";

export function EmployeeSessionsModal({ employee, isOpen, onClose }) {
  const { data: response, isLoading } = useEmployeeSessions(employee?.employee_id);
  const revokeSessionMutation = useRevokeSession();
  const revokeAllMutation = useRevokeAllSessions();

  if (!isOpen || !employee) return null;

  const sessions = response?.data || [];
  const activeCount = sessions.filter((s) => s.is_active).length;

  const getDeviceIcon = (deviceType) => {
    if (deviceType === "Mobile") return <Smartphone className="w-5 h-5 text-indigo-500" />;
    if (deviceType === "Tablet") return <Tablet className="w-5 h-5 text-purple-500" />;
    return <Monitor className="w-5 h-5 text-blue-500" />;
  };

  const handleRevokeSingle = async (sessionId) => {
    if (window.confirm("Are you sure you want to terminate this login session?")) {
      await revokeSessionMutation.mutateAsync(sessionId);
    }
  };

  const handleRevokeAll = async () => {
    if (window.confirm(`Are you sure you want to terminate ALL active sessions for ${employee.first_name}? They will be forced to log in again.`)) {
      await revokeAllMutation.mutateAsync(employee.employee_id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Active Login Sessions</h2>
              <p className="text-xs text-slate-500">
                Manage connected devices for <span className="font-semibold text-slate-700">{employee.first_name} {employee.last_name}</span> ({employee.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {activeCount} Active Session{activeCount !== 1 ? "s" : ""}
            </div>
            {activeCount > 0 && (
              <button
                onClick={handleRevokeAll}
                disabled={revokeAllMutation.isLoading}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-200 flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Terminate All Sessions
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading active sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No recorded login sessions found for this staff member.</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`p-4 rounded-xl border transition-all ${
                    session.is_active
                      ? "border-slate-200 bg-white hover:border-blue-300 shadow-sm"
                      : "border-slate-100 bg-slate-50/60 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                        {getDeviceIcon(session.device_type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-800">
                            {session.browser || "Browser"} on {session.os || "OS"}
                          </span>
                          {session.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded-full">
                              Terminated
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          {session.ip_address && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-slate-400" /> {session.ip_address}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Logged in: {new Date(session.login_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {session.is_active && (
                      <button
                        onClick={() => handleRevokeSingle(session.session_id)}
                        disabled={revokeSessionMutation.isLoading}
                        className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors shrink-0"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSessionsModal;
