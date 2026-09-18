export type AuditSource = 'mobile' | 'web' | 'admin' | 'system';
export type AuditOutcome = 'success' | 'failure';
export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  actorType: string;
  source: AuditSource;
  outcome: AuditOutcome;
  severity: AuditSeverity;
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user?: { id: string; email: string; name: string | null };
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditLogsQueryParams {
  page: number;
  limit: number;
  source?: '' | AuditSource;
  outcome?: '' | AuditOutcome;
  severity?: '' | AuditSeverity;
}
