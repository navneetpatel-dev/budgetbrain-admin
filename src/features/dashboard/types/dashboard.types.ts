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

export interface DashboardPageData {
  dashboard: DashboardData;
  stats: StatsData;
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
