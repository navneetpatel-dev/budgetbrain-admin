import type { DashboardPageData } from '../types/dashboard.types';
import { BentoStat } from './BentoStat.component';
import { dashboardStyles } from '../styles/dashboard.styles';
import { EmptyState } from '@/shared/components/PageStates.component';

interface FeatureUsageSectionProps {
  data: DashboardPageData;
}

const POD_CLASSES = [
  dashboardStyles.podOcean,
  dashboardStyles.podEmerald,
  dashboardStyles.podViolet,
  dashboardStyles.podPrimary,
];

function formatFeatureLabel(feature: string) {
  return feature
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function FeatureUsageSection({ data }: FeatureUsageSectionProps) {
  const { features, autoTracking } = data.featureUsage;

  return (
    <div className={dashboardStyles.sectionBlock}>
      <h3 className={dashboardStyles.sectionTitle}>Feature Usage (Last 30 Days)</h3>
      {autoTracking && (
        <div className={dashboardStyles.bentoGrid}>
          <BentoStat
            icon="⇄"
            iconPodClass={dashboardStyles.podPrimary}
            badge="Last 30 Days"
            badgeClass={dashboardStyles.badgeNeutral}
            label="Auto-Tracking Users"
            value={autoTracking.activeUsers30d.toLocaleString()}
          />
          <BentoStat
            icon="✎"
            iconPodClass={dashboardStyles.podViolet}
            badge="Opted in"
            badgeClass={dashboardStyles.badgeNeutral}
            label="Template Learning"
            value={autoTracking.templateLearningUsers.toLocaleString()}
          />
          <BentoStat
            icon="✓"
            iconPodClass={dashboardStyles.podEmerald}
            badge="Setting"
            badgeClass={dashboardStyles.badgeNeutral}
            label="Review Everything"
            value={autoTracking.reviewAllUsers.toLocaleString()}
          />
        </div>
      )}
      {features.length === 0 ? (
        <EmptyState message="No feature activity recorded in the last 30 days." />
      ) : (
        <div className={dashboardStyles.bentoGrid}>
          {features.map((item, index) => (
            <BentoStat
              key={item.feature}
              icon="▤"
              iconPodClass={POD_CLASSES[index % POD_CLASSES.length]}
              badge="Last 30 Days"
              badgeClass={dashboardStyles.badgeNeutral}
              label={formatFeatureLabel(item.feature)}
              value={item.eventsCount.toLocaleString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
