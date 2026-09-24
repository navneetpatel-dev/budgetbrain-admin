'use client';

import { useDeletionRequests } from '../hooks/useDeletionRequests.hook';
import { DetectionTabs } from '../components/DetectionTabs.component';
import { DeletionsTable } from '../components/DeletionsTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { detectionStyles } from '../styles/detection.styles';

export function DeletionsPage() {
  const { requests, error, loading, refreshing, reload } = useDeletionRequests();
  return (
    <div className={detectionStyles.view}>
      <div className={detectionStyles.header}>
        <div className={detectionStyles.headerLeft}>
          <h2 className={detectionStyles.title}>Deletion Requests</h2>
          <p className={detectionStyles.subtitle}>
            Last 90 days. Rejected detections are kept 90 days, diagnostics 180; the retention job runs nightly.
          </p>
        </div>
        <button type="button" className={detectionStyles.btn} onClick={() => void reload()} disabled={loading || refreshing}>
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>
      <DetectionTabs />
      {loading && <AdminTableSkeleton rows={5} columns={4} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && requests.length === 0 && <EmptyState message="No deletion requests in the last 90 days." />}
      {!loading && !error && requests.length > 0 && <DeletionsTable requests={requests} />}
    </div>
  );
}

export default DeletionsPage;
