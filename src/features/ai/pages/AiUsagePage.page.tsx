'use client';

import { useAiUsage } from '../hooks/useAiUsage.hook';
import { AiUsageTable } from '../components/AiUsageTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { aiStyles } from '../styles/ai.styles';

export function AiUsagePage() {
  const {
    conversations,
    total,
    page,
    limit,
    setPage,
    error,
    loading,
    refreshing,
    reload,
  } = useAiUsage();

  return (
    <div className={aiStyles.view}>
      <div className={aiStyles.header}>
        <div className={aiStyles.headerLeft}>
          <div className={aiStyles.statusPill}>
            <span className={aiStyles.liveDot} />
            <span>AI Engine Active</span>
          </div>
          <h2 className={aiStyles.title}>AI Usage</h2>
          <p className={aiStyles.subtitle}>
            {total > 0
              ? `${total.toLocaleString()} total conversations`
              : 'Monitor AI coach interactions'}
          </p>
        </div>
        <button
          type="button"
          className={aiStyles.refreshBtn}
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {loading && <AdminTableSkeleton rows={10} columns={5} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && conversations.length === 0 && (
        <EmptyState message="No AI conversations found." />
      )}
      {!loading && !error && conversations.length > 0 && (
        <AiUsageTable
          conversations={conversations}
          total={total}
          page={page}
          limit={limit}
          refreshing={refreshing}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default AiUsagePage;
