import { apiGet } from '@/shared/api/admin.api';
import type { AuditLogsQueryParams, AuditLogsResponse } from '../types/audit.types';

export async function getAuditLogs(params: AuditLogsQueryParams): Promise<AuditLogsResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.action) query.set('action', params.action);
  if (params.source) query.set('source', params.source);
  if (params.outcome) query.set('outcome', params.outcome);
  if (params.severity) query.set('severity', params.severity);

  return apiGet<AuditLogsResponse>(`/admin/audit-logs?${query}`);
}
