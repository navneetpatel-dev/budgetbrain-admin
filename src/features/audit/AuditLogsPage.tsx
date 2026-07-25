import { Fragment, useState } from 'react';
import { apiGet } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import Pagination from '../../shared/components/Pagination';
import { ErrorState, EmptyState } from '../../shared/components/PageStates';
import { AdminTableSkeleton } from '../../shared/components/Skeleton';

type AuditSource = 'mobile' | 'web' | 'admin' | 'system';
type AuditOutcome = 'success' | 'failure';
type AuditSeverity = 'info' | 'warning' | 'critical';

interface AuditLog {
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

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 50;

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState<'' | AuditSource>('');
  const [outcome, setOutcome] = useState<'' | AuditOutcome>('');
  const [severity, setSeverity] = useState<'' | AuditSeverity>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cacheKey = `audit-logs:${page}:${source}:${outcome}:${severity}`;
  const { data, error, loading, refreshing, reload } = useCachedResource<AuditLogsResponse>(
    cacheKey,
    () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (source) params.set('source', source);
      if (outcome) params.set('outcome', outcome);
      if (severity) params.set('severity', severity);
      return apiGet<AuditLogsResponse>(`/admin/audit-logs?${params}`);
    }
  );

  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <h2 className="page-title">Audit Logs</h2>

      <div className="card audit-filters">
        <div className="form-row">
          <label>
            Source
            <select
              className="select select-sm"
              value={source}
              onChange={(e) => {
                setPage(1);
                setSource(e.target.value as '' | AuditSource);
              }}
            >
              <option value="">All platforms</option>
              <option value="mobile">Mobile</option>
              <option value="web">Web</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
            </select>
          </label>
          <label>
            Outcome
            <select
              className="select select-sm"
              value={outcome}
              onChange={(e) => {
                setPage(1);
                setOutcome(e.target.value as '' | AuditOutcome);
              }}
            >
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </label>
          <label>
            Severity
            <select
              className="select select-sm"
              value={severity}
              onChange={(e) => {
                setPage(1);
                setSeverity(e.target.value as '' | AuditSeverity);
              }}
            >
              <option value="">All</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <AdminTableSkeleton rows={8} columns={8} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && logs.length === 0 && <EmptyState message="No audit logs found." />}
      {!loading && !error && logs.length > 0 && (
        <div className={`card${refreshing ? ' is-refreshing' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Outcome</th>
                <th>Severity</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <Fragment key={l.id}>
                  <tr>
                    <td className="audit-time">{new Date(l.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-source-${l.source}`}>{l.source}</span>
                    </td>
                    <td>
                      <div className="audit-actor">
                        <span>{l.user?.email ?? 'System / deleted user'}</span>
                        <small>{l.actorType}</small>
                      </div>
                    </td>
                    <td>
                      <code className="audit-action">{l.action}</code>
                    </td>
                    <td>
                      <div className="audit-actor">
                        <span>{l.resource}</span>
                        {l.resourceId && <small>{l.resourceId.slice(0, 8)}…</small>}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-outcome-${l.outcome}`}>{l.outcome}</span>
                    </td>
                    <td>
                      <span className={`badge badge-severity-${l.severity}`}>{l.severity}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="link"
                        onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                      >
                        {expandedId === l.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === l.id && (
                    <tr className="audit-details-row">
                      <td colSpan={8}>
                        <div className="audit-details">
                          <div>
                            <strong>Request ID</strong>
                            <span>{l.requestId ?? '—'}</span>
                          </div>
                          <div>
                            <strong>IP</strong>
                            <span>{l.ipAddress ?? '—'}</span>
                          </div>
                          <div>
                            <strong>User agent</strong>
                            <span>{l.userAgent ?? '—'}</span>
                          </div>
                          {l.beforeState && (
                            <div className="audit-json">
                              <strong>Before</strong>
                              <pre>{JSON.stringify(l.beforeState, null, 2)}</pre>
                            </div>
                          )}
                          {l.afterState && (
                            <div className="audit-json">
                              <strong>After</strong>
                              <pre>{JSON.stringify(l.afterState, null, 2)}</pre>
                            </div>
                          )}
                          {l.metadata && (
                            <div className="audit-json">
                              <strong>Metadata</strong>
                              <pre>{JSON.stringify(l.metadata, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
