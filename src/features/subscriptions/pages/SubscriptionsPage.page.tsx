'use client';

import { useSubscriptions } from '../hooks/useSubscriptions.hook';
import { SubscriptionSummaryCards } from '../components/SubscriptionSummaryCards.component';
import { SubscriptionFilterBar } from '../components/SubscriptionFilterBar.component';
import { SubscriptionsTable } from '../components/SubscriptionsTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates';
import { AdminTableSkeleton } from '@/shared/components/Skeleton';
import { subscriptionStyles } from '../styles/subscriptions.styles';

export function SubscriptionsPage() {
  const {
    subscriptions,
    total,
    metrics,
    page,
    limit,
    setPage,
    status,
    setStatus,
    plan,
    setPlan,
    search,
    setSearch,
    error,
    loading,
    refreshing,
    reload,
  } = useSubscriptions();

  return (
    <div className={subscriptionStyles.view}>
      <div className={subscriptionStyles.header}>
        <div className={subscriptionStyles.headerLeft}>
          <h2 className={subscriptionStyles.title}>Subscription Monitoring</h2>
          <p className={subscriptionStyles.subtitle}>
            {total > 0
              ? `${total.toLocaleString()} total subscriptions tracked`
              : 'Track subscriber lifecycle and entitlements'}
          </p>
        </div>
        <button
          type="button"
          className={subscriptionStyles.refreshBtn}
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {metrics && <SubscriptionSummaryCards metrics={metrics} />}

      <SubscriptionFilterBar
        status={status}
        plan={plan}
        search={search}
        onStatusChange={setStatus}
        onPlanChange={setPlan}
        onSearchChange={setSearch}
      />

      {loading && <AdminTableSkeleton rows={8} columns={6} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && subscriptions.length === 0 && (
        <EmptyState message="No subscriptions found matching the filter criteria." />
      )}
      {!loading && !error && subscriptions.length > 0 && (
        <SubscriptionsTable
          subscriptions={subscriptions}
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

export default SubscriptionsPage;
