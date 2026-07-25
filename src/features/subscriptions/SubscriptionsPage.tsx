import { useState } from 'react';
import { apiGet } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import Pagination from '../../shared/components/Pagination';
import { ErrorState, EmptyState } from '../../shared/components/PageStates';
import { AdminTableSkeleton } from '../../shared/components/Skeleton';

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
  const [page, setPage] = useState(1);
  const { data, error, loading, refreshing, reload } = useCachedResource<SubscriptionsResponse>(
    `subscriptions:${page}`,
    () => apiGet<SubscriptionsResponse>(`/admin/subscriptions?page=${page}&limit=${LIMIT}`)
  );

  const subs = data?.subscriptions ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <h2 className="page-title">Subscriptions</h2>
      {loading && <AdminTableSkeleton rows={8} columns={4} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && subs.length === 0 && <EmptyState message="No subscriptions found." />}
      {!loading && !error && subs.length > 0 && (
        <div className={`card${refreshing ? ' is-refreshing' : ''}`}>
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
