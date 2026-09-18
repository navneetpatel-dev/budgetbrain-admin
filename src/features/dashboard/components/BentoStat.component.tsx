import type { BentoStatProps } from '../types/dashboard.types';
import { dashboardStyles } from '../styles/dashboard.styles';

export function BentoStat({
  icon,
  iconPodClass,
  badge,
  badgeClass,
  label,
  value,
  highlight,
}: BentoStatProps) {
  return (
    <div
      className={`${dashboardStyles.bentoStat} ${highlight ? dashboardStyles.bentoHighlight : ''}`}
    >
      <div className={dashboardStyles.bentoTop}>
        <span className={`${dashboardStyles.bentoIconPod} ${iconPodClass}`}>{icon}</span>
        <span className={`${dashboardStyles.bentoBadge} ${badgeClass}`}>{badge}</span>
      </div>
      <div className={dashboardStyles.statContent}>
        <span className={dashboardStyles.bentoLabel}>{label}</span>
        <span className={dashboardStyles.bentoAmount}>{value}</span>
      </div>
    </div>
  );
}
