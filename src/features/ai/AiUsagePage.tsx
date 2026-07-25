import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import Pagination from '../../shared/components/Pagination';
import { ErrorState, EmptyState } from '../../shared/components/PageStates';
import { AdminTableSkeleton } from '../../shared/components/Skeleton';

interface AiConversation {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  user?: { email: string; name: string | null };
}

interface AiUsageResponse {
  conversations: AiConversation[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

export default function AiUsagePage() {
  const [page, setPage] = useState(1);
  const { data, error, loading, refreshing, reload } = useCachedResource<AiUsageResponse>(
    `ai-usage:${page}`,
    () => apiGet<AiUsageResponse>(`/admin/ai-usage?page=${page}&limit=${LIMIT}`)
  );

  const conversations = data?.conversations ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <h2 className="page-title">AI Usage</h2>
      {loading && <AdminTableSkeleton rows={10} columns={5} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && conversations.length === 0 && (
        <EmptyState message="No AI conversations found." />
      )}
      {!loading && !error && conversations.length > 0 && (
        <div className={`card${refreshing ? ' is-refreshing' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Messages</th>
                <th>Created</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/users/${c.userId}`} className="link">
                      {c.user?.email ?? c.userId.slice(0, 8)}
                    </Link>
                  </td>
                  <td>{c.title}</td>
                  <td>{c.messageCount}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
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
