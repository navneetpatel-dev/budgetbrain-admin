import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPatch } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import Pagination from '../../shared/components/Pagination';
import { ErrorState, EmptyState } from '../../shared/components/PageStates';
import { AdminTableSkeleton } from '../../shared/components/Skeleton';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: string;
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
  user?: { email: string; name: string | null };
}

interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;
const STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

export default function SupportTicketsPage() {
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const { data, error, loading, refreshing, reload, setData } = useCachedResource<TicketsResponse>(
    `support-tickets:${page}`,
    () => apiGet<TicketsResponse>(`/admin/support-tickets?page=${page}&limit=${LIMIT}`)
  );

  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;

  const updateStatus = async (id: string, status: TicketStatus) => {
    setUpdatingId(id);
    setActionError('');
    try {
      const updated = await apiPatch<SupportTicket>(`/admin/support-tickets/${id}`, { status });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tickets: prev.tickets.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        };
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2 className="page-title">Support Tickets</h2>
      {actionError && <div className="error">{actionError}</div>}
      {loading && <AdminTableSkeleton rows={8} columns={5} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && tickets.length === 0 && (
        <EmptyState message="No support tickets found." />
      )}
      {!loading && !error && tickets.length > 0 && (
        <div className={`card${refreshing ? ' is-refreshing' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/users/${t.userId}`} className="link">
                      {t.user?.email ?? t.userId.slice(0, 8)}
                    </Link>
                  </td>
                  <td>
                    <div className="ticket-subject">{t.subject}</div>
                    <div className="ticket-message">{t.message.slice(0, 80)}…</div>
                  </td>
                  <td>
                    <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                  </td>
                  <td>
                    <select
                      className="select-sm"
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) => updateStatus(t.id, e.target.value as TicketStatus)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
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
