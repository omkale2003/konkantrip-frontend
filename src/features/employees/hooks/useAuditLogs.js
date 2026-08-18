import { useQuery } from "@tanstack/react-query";
import auditApi from "../api/audit.api.js";

export function useAuditLogs(filters = {}) {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => auditApi.getAuditLogs(filters),
    keepPreviousData: true,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAuditLogDetail(id) {
  return useQuery({
    queryKey: ["auditLogDetail", id],
    queryFn: () => auditApi.getAuditLogById(id),
    enabled: Boolean(id),
  });
}
