'use client';

import { useAuditLogs } from '../hooks/useAuditLogs.hook';
import { AuditFilterBar } from '../components/AuditFilterBar.component';
import { AuditLogsTable } from '../components/AuditLogsTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates';
import { AdminTableSkeleton } from '@/shared/components/Skeleton';
import { auditStyles } from '../styles/audit.styles';

export function AuditLogsPage() {
  const {
    logs,
    total,
    page,
    limit,
    setPage,
    source,
    outcome,
    severity,
    expandedId,
    setSource,
    setOutcome,
    setSeverity,
    toggleExpanded,
    error,
    loading,
    refreshing,
    reload,
  } = useAuditLogs();

  return (
    <div className={auditStyles.view}>
      <div className={auditStyles.header}>
        <div className={auditStyles.headerLeft}>
          <h2 className={auditStyles.title}>Audit Logs</h2>
          <p className={auditStyles.subtitle}>
            {total > 0
              ? `${total.toLocaleString()} audit events`
              : 'Full platform activity trail'}
          </p>
        </div>
        <button
          type="button"
          className={auditStyles.refreshBtn}
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      <AuditFilterBar
        source={source}
        outcome={outcome}
        severity={severity}
        onSourceChange={setSource}
        onOutcomeChange={setOutcome}
        onSeverityChange={setSeverity}
      />

      {loading && <AdminTableSkeleton rows={8} columns={8} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && logs.length === 0 && (
        <EmptyState message="No audit logs found." />
      )}
      {!loading && !error && logs.length > 0 && (
        <AuditLogsTable
          logs={logs}
          total={total}
          page={page}
          limit={limit}
          refreshing={refreshing}
          expandedId={expandedId}
          onPageChange={setPage}
          onToggleExpanded={toggleExpanded}
        />
      )}
    </div>
  );
}

export default AuditLogsPage;
