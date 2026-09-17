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

const PRIORITY_BADGE: Record<string, string> = {
  low: 'badge-neutral',
  medium: 'badge-secondary',
  high: 'badge-warning',
  critical: 'badge-danger',
};

const STATUS_BADGE: Record<string, string> = {
  open: 'badge-danger',
  in_progress: 'badge-secondary',
  resolved: 'badge-active',
  closed: 'badge-neutral',
};

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

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
      <div className="page-header">
        <div>
          <h2 className="page-title">Support Tickets</h2>
          <p className="page-subtitle">
            {total > 0 ? `${total.toLocaleString()} total tickets` : 'Manage user support requests'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-refresh"
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>
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
                    {t.user?.name && (
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{t.user.name}</div>
                    )}
                  </td>
                  <td>
                    <div className="ticket-subject">{t.subject}</div>
                    <div className="ticket-message">{t.message.slice(0, 80)}{t.message.length > 80 ? '…' : ''}</div>
                  </td>
                  <td>
                    <span className={`badge ${PRIORITY_BADGE[t.priority] ?? 'badge-neutral'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge ${STATUS_BADGE[t.status] ?? 'badge-neutral'}`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                      <select
                        className="select-sm"
                        value={t.status}
                        disabled={updatingId === t.id}
                        onChange={(e) => updateStatus(t.id, e.target.value as TicketStatus)}
                        style={{ fontSize: 11 }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
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
