export interface DashboardData {
  totalUsers: number;
  newUsersLast30Days: number;
  aiConversationsLast30Days: number;
  dau: number;
  mau: number;
  retentionRate: number;
}

export interface StatsData {
  totalTransactions: number;
  totalExpenseVolume: number;
}

export interface FeatureUsageItem {
  feature: string;
  eventsCount: number;
}

/** From the hourly detection rollup (plan T7.3). */
export interface AutoTrackingAdoption {
  activeUsers30d: number;
  templateLearningUsers: number;
  reviewAllUsers: number;
  computedAt: string | null;
}

export interface FeatureUsageData {
  period: string;
  autoTracking?: AutoTrackingAdoption;
  features: FeatureUsageItem[];
}

export interface DashboardPageData {
  dashboard: DashboardData;
  stats: StatsData;
  featureUsage: FeatureUsageData;
}

export interface BentoStatProps {
  icon: string;
  iconPodClass: string;
  badge: string;
  badgeClass: string;
  label: string;
  value: string;
  highlight?: boolean;
}
