'use client';

import { useSubscriptions } from '../hooks/useSubscriptions.hook';
import { SubscriptionSummaryCards } from '../components/SubscriptionSummaryCards.component';
import { SubscriptionFilterBar } from '../components/SubscriptionFilterBar.component';
import { SubscriptionsTable } from '../components/SubscriptionsTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
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
    hasData,
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

      {loading && !hasData && <AdminTableSkeleton rows={8} columns={6} />}
      {error && !hasData && <ErrorState message={error} onRetry={reload} />}
      {error && hasData && (
        <div className={subscriptionStyles.errorBanner}>
          Refresh failed: {error}{' '}
          <button type="button" className={subscriptionStyles.retryLink} onClick={() => void reload()}>
            Retry
          </button>
        </div>
      )}
      {hasData && subscriptions.length === 0 && !error && (
        <EmptyState message="No subscriptions found matching the filter criteria." />
      )}
      {hasData && subscriptions.length > 0 && (
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
