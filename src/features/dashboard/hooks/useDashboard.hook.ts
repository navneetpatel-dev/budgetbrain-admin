'use client';

import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getDashboardSummary, getPlatformStats } from '../api/dashboard.api';
import type { DashboardPageData } from '../types/dashboard.types';

export function useDashboard() {
  return useCachedResource<DashboardPageData>(
    'dashboard',
    async () => {
      const [dashboard, stats] = await Promise.all([
        getDashboardSummary(),
        getPlatformStats(),
      ]);
      return { dashboard, stats };
    }
  );
}
