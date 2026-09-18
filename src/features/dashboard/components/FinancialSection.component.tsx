import type { DashboardPageData } from '../types/dashboard.types';
import { BentoStat } from './BentoStat.component';
import { dashboardStyles } from '../styles/dashboard.styles';

interface FinancialSectionProps {
  data: DashboardPageData;
}

export function FinancialSection({ data }: FinancialSectionProps) {
  return (
    <div className={dashboardStyles.sectionBlock}>
      <h3 className={dashboardStyles.sectionTitle}>Financial Flow &amp; AI Operations</h3>
      <div className={dashboardStyles.bentoGrid}>
        <BentoStat
          icon="₹"
          iconPodClass={dashboardStyles.podOcean}
          badge="All Time"
          badgeClass={dashboardStyles.badgeNeutral}
          label="Expense Volume"
          value={`₹${data.stats.totalExpenseVolume.toLocaleString()}`}
          highlight
        />
        <BentoStat
          icon="⚡"
          iconPodClass={dashboardStyles.podViolet}
          badge="Settled"
          badgeClass={dashboardStyles.badgeNeutral}
          label="Total Transactions"
          value={data.stats.totalTransactions.toLocaleString()}
        />
        <BentoStat
          icon="✦"
          iconPodClass={dashboardStyles.podEmerald}
          badge="Last 30 Days"
          badgeClass={dashboardStyles.badgeSecondary}
          label="AI Coach Invocations"
          value={data.dashboard.aiConversationsLast30Days.toLocaleString()}
        />
        <BentoStat
          icon="↗"
          iconPodClass={dashboardStyles.podPrimary}
          badge={`${data.dashboard.retentionRate}% Stickiness`}
          badgeClass={dashboardStyles.badgeSecondary}
          label="DAU / MAU Ratio"
          value={`${data.dashboard.retentionRate}%`}
        />
      </div>
    </div>
  );
}
