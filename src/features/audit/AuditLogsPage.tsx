import { useEffect, useState, useCallback } from 'react';
import { apiGet } from '../../shared/services/api';
import Pagination from '../../shared/components/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../shared/components/PageStates';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  createdAt: string;
  user?: { email: string };
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 50;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet<AuditLogsResponse>(`/admin/audit-logs?page=${page}&limit=${LIMIT}`);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2 className="page-title">Audit Logs</h2>
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && logs.length === 0 && <EmptyState message="No audit logs found." />}
      {!loading && !error && logs.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.user?.email ?? 'System'}</td>
                  <td>{l.action}</td>
                  <td>{l.resource}</td>
                  <td>{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
