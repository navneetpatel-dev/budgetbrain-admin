'use client';

import { useSupportTickets } from '../hooks/useSupportTickets.hook';
import { SupportTicketsFilterBar } from '../components/SupportTicketsFilterBar.component';
import { TicketsTable } from '../components/TicketsTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { exportRowsToCsv, type CsvColumn } from '@/shared/utils/exportToCsv';
import { supportStyles } from '../styles/support.styles';
import { STATUS_LABEL, type SupportTicket } from '../types/support.types';

const TICKET_CSV_COLUMNS: CsvColumn<SupportTicket>[] = [
  { key: 'user', label: 'User', format: (t) => t.user?.email ?? t.userId },
  { key: 'subject', label: 'Subject' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status', format: (t) => STATUS_LABEL[t.status] },
  { key: 'createdAt', label: 'Created', format: (t) => new Date(t.createdAt).toISOString().slice(0, 10) },
];

export function SupportTicketsPage() {
  const {
    tickets,
    total,
    page,
    limit,
    setPage,
    status,
    setStatus,
    sortBy,
    sortDir,
    handleSort,
    updatingId,
    actionError,
    updateStatus,
    error,
    loading,
    refreshing,
    reload,
  } = useSupportTickets();

  return (
    <div className={supportStyles.view}>
      <div className={supportStyles.header}>
        <div className={supportStyles.headerLeft}>
          <h2 className={supportStyles.title}>Support Tickets</h2>
          <p className={supportStyles.subtitle}>
            {total > 0
              ? `${total.toLocaleString()} total tickets`
              : 'Manage user support requests'}
          </p>
        </div>
        <div className={supportStyles.headerActions}>
          <button
            type="button"
            className={supportStyles.refreshBtn}
            onClick={() => exportRowsToCsv(tickets, TICKET_CSV_COLUMNS, 'support-tickets')}
            disabled={loading || tickets.length === 0}
          >
            ⬇ Export CSV
          </button>
          <button
            type="button"
            className={supportStyles.refreshBtn}
            onClick={() => void reload()}
            disabled={loading || refreshing}
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <SupportTicketsFilterBar
        status={status}
        onStatusChange={setStatus}
      />

      {actionError && <div className={supportStyles.errorBanner}>{actionError}</div>}
      {loading && <AdminTableSkeleton rows={8} columns={5} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && tickets.length === 0 && (
        <EmptyState message="No support tickets found." />
      )}
      {!loading && !error && tickets.length > 0 && (
        <TicketsTable
          tickets={tickets}
          total={total}
          page={page}
          limit={limit}
          refreshing={refreshing}
          updatingId={updatingId}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onPageChange={setPage}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

export default SupportTicketsPage;
