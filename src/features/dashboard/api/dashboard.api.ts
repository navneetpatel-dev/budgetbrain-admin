import { apiGet } from '@/shared/api/admin.api';
import type { DashboardData, StatsData, FeatureUsageData } from '../types/dashboard.types';

export async function getDashboardSummary(): Promise<DashboardData> {
  return apiGet<DashboardData>('/admin/dashboard');
}

export async function getPlatformStats(): Promise<StatsData> {
  return apiGet<StatsData>('/admin/stats');
}

export async function getFeatureUsage(): Promise<FeatureUsageData> {
  return apiGet<FeatureUsageData>('/admin/feature-usage');
}
