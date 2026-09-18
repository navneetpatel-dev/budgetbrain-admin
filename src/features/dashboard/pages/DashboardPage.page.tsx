'use client';

import { useDashboard } from '../hooks/useDashboard.hook';
import { FinancialSection } from '../components/FinancialSection.component';
import { EngagementSection } from '../components/EngagementSection.component';
import { ErrorState } from '@/shared/components/PageStates';
import { AdminDashboardSkeleton } from '@/shared/components/Skeleton';
import { dashboardStyles } from '../styles/dashboard.styles';

export function DashboardPage() {
  const { data, error, loading, refreshing, reload } = useDashboard();

  return (
    <div className={dashboardStyles.view}>
      <div className={dashboardStyles.header}>
        <div className={dashboardStyles.headerLeft}>
          <div className={dashboardStyles.statusPill}>
            <span className={dashboardStyles.liveDot} />
            <span>Live Analytics</span>
          </div>
          <h2 className={dashboardStyles.title}>Executive Dashboard</h2>
          <p className={dashboardStyles.subtitle}>
            Real-time platform metrics, user engagement, and transaction volume
          </p>
        </div>
        <button
          type="button"
          className={dashboardStyles.refreshBtn}
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh Data'}
        </button>
      </div>

      {loading && <AdminDashboardSkeleton cards={8} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && (
        <div className={`${dashboardStyles.sections} ${refreshing ? dashboardStyles.refreshing : ''}`}>
          <FinancialSection data={data} />
          <EngagementSection data={data} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
