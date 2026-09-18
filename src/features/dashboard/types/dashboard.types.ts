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

export interface FeatureUsageData {
  period: string;
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
