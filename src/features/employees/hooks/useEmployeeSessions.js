import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import sessionsApi from "../api/sessions.api.js";

export function useEmployeeSessions(employeeId) {
  return useQuery({
    queryKey: ["employeeSessions", employeeId],
    queryFn: () => sessionsApi.getEmployeeSessions(employeeId),
    enabled: Boolean(employeeId),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) => sessionsApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    },
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId) => sessionsApi.revokeAllSessions(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    },
  });
}
