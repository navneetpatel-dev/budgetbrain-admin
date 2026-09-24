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

/** Detection and knowledge-base actions (plan T7.7), filterable on the audit page. */
export const DETECTION_AUDIT_ACTIONS = [
  'detection.auto_create',
  'detection.confirm',
  'detection.reject',
  'detection.undo',
  'detection.delete_all',
  'detection.statement_import',
  'detection.export',
  'kb.change',
  'kb.publish',
  'kb.pack_build',
  'kb.kill_switch_change',
] as const;

export interface AuditLogsQueryParams {
  page: number;
  limit: number;
  action?: string;
  source?: '' | AuditSource;
  outcome?: '' | AuditOutcome;
  severity?: '' | AuditSeverity;
}
