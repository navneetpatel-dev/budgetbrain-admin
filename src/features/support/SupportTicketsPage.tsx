import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPatch } from '../../shared/services/api';
import Pagination from '../../shared/components/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../shared/components/PageStates';

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
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet<TicketsResponse>(
        `/admin/support-tickets?page=${page}&limit=${LIMIT}`
      );
      setTickets(data.tickets);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: TicketStatus) => {
    setUpdatingId(id);
    try {
      const updated = await apiPatch<SupportTicket>(`/admin/support-tickets/${id}`, { status });
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2 className="page-title">Support Tickets</h2>
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && tickets.length === 0 && (
        <EmptyState message="No support tickets found." />
      )}
      {!loading && !error && tickets.length > 0 && (
        <div className="card">
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
