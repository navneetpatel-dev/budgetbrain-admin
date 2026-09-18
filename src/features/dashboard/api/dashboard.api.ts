import { apiGet } from '@/shared/services/api';
import type { DashboardData, StatsData } from '../types/dashboard.types';

export async function getDashboardSummary(): Promise<DashboardData> {
  return apiGet<DashboardData>('/admin/dashboard');
}

export async function getPlatformStats(): Promise<StatsData> {
  return apiGet<StatsData>('/admin/stats');
}
