import { useEffect, useState, useCallback } from 'react';
import { apiGet } from '../../shared/services/api';
import Pagination from '../../shared/components/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../shared/components/PageStates';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  purchasedAt: string;
  user?: { email: string; name: string | null };
}

interface SubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet<SubscriptionsResponse>(
        `/admin/subscriptions?page=${page}&limit=${LIMIT}`
      );
      setSubs(data.subscriptions);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2 className="page-title">Subscriptions</h2>
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && subs.length === 0 && <EmptyState message="No subscriptions found." />}
      {!loading && !error && subs.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Purchased</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>{s.user?.email ?? '—'}</td>
                  <td>
                    <span className={`badge badge-${s.plan}`}>{s.plan}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${s.status}`}>{s.status}</span>
                  </td>
                  <td>{new Date(s.purchasedAt).toLocaleDateString()}</td>
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
