import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../services/api';
import Pagination from '../components/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../components/PageStates';

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
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet<AiUsageResponse>(`/admin/ai-usage?page=${page}&limit=${LIMIT}`);
      setConversations(data.conversations);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI usage');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2 className="page-title">AI Usage</h2>
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && conversations.length === 0 && (
        <EmptyState message="No AI conversations found." />
      )}
      {!loading && !error && conversations.length > 0 && (
        <div className="card">
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
