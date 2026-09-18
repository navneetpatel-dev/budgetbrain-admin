import type { DashboardPageData } from '../types/dashboard.types';
import { BentoStat } from './BentoStat.component';
import { dashboardStyles } from '../styles/dashboard.styles';

interface EngagementSectionProps {
  data: DashboardPageData;
}

export function EngagementSection({ data }: EngagementSectionProps) {
  return (
    <div className={dashboardStyles.sectionBlock}>
      <h3 className={dashboardStyles.sectionTitle}>User Growth &amp; Engagement</h3>
      <div className={dashboardStyles.bentoGrid}>
        <BentoStat
          icon="◎"
          iconPodClass={dashboardStyles.podOcean}
          badge="Total Base"
          badgeClass={dashboardStyles.badgeNeutral}
          label="Registered Accounts"
          value={data.dashboard.totalUsers.toLocaleString()}
        />
        <BentoStat
          icon="◈"
          iconPodClass={dashboardStyles.podEmerald}
          badge="+30 Days"
          badgeClass={dashboardStyles.badgeSecondary}
          label="New Accounts"
          value={data.dashboard.newUsersLast30Days.toLocaleString()}
        />
        <BentoStat
          icon="◆"
          iconPodClass={dashboardStyles.podViolet}
          badge="Active Today"
          badgeClass={dashboardStyles.badgeNeutral}
          label="Daily Active Users (DAU)"
          value={data.dashboard.dau.toLocaleString()}
        />
        <BentoStat
          icon="◉"
          iconPodClass={dashboardStyles.podPrimary}
          badge="Active Month"
          badgeClass={dashboardStyles.badgeNeutral}
          label="Monthly Active Users (MAU)"
          value={data.dashboard.mau.toLocaleString()}
        />
      </div>
    </div>
  );
}
