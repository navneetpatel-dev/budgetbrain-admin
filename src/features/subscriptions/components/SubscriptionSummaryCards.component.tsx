import { BentoStat } from '@/features/dashboard/components/BentoStat.component';
import type { SubscriptionMetrics } from '../types/subscriptions.types';
import { subscriptionStyles } from '../styles/subscriptions.styles';
import { dashboardStyles } from '@/features/dashboard/styles/dashboard.styles';

interface SubscriptionSummaryCardsProps {
  metrics: SubscriptionMetrics;
}

export function SubscriptionSummaryCards({ metrics }: SubscriptionSummaryCardsProps) {
  return (
    <div className={subscriptionStyles.summaryGrid}>
      <BentoStat
        icon="★"
        iconPodClass={dashboardStyles.podPrimary}
        badge="Active"
        badgeClass={dashboardStyles.badgeSecondary}
        label="Active Subscribers"
        value={metrics.activeCount.toLocaleString()}
        highlight
      />
      <BentoStat
        icon="₹"
        iconPodClass={dashboardStyles.podEmerald}
        badge="Monthly Run Rate"
        badgeClass={dashboardStyles.badgeNeutral}
        label="MRR"
        value={`₹${metrics.mrr.toLocaleString()}`}
      />
      <BentoStat
        icon="⚡"
        iconPodClass={dashboardStyles.podViolet}
        badge="Annualized"
        badgeClass={dashboardStyles.badgeNeutral}
        label="ARR"
        value={`₹${metrics.arr.toLocaleString()}`}
      />
      <BentoStat
        icon="◎"
        iconPodClass={dashboardStyles.podOcean}
        badge={`${metrics.churnRate}% Churn`}
        badgeClass={dashboardStyles.badgeSecondary}
        label="Conversion Rate"
        value={`${metrics.conversionRate}%`}
      />
    </div>
  );
}
