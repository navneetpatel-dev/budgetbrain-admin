'use client';

import { useSupportTickets } from '../hooks/useSupportTickets.hook';
import { TicketsTable } from '../components/TicketsTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates';
import { AdminTableSkeleton } from '@/shared/components/Skeleton';
import { supportStyles } from '../styles/support.styles';

export function SupportTicketsPage() {
  const {
    tickets,
    total,
    page,
    limit,
    setPage,
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
        <button
          type="button"
          className={supportStyles.refreshBtn}
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

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
          onPageChange={setPage}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

export default SupportTicketsPage;
