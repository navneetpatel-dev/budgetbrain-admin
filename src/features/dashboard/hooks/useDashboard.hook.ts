'use client';

import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { getDashboardSummary, getPlatformStats, getFeatureUsage } from '../api/dashboard.api';
import type { DashboardPageData } from '../types/dashboard.types';

export function useDashboard() {
  return useCachedResource<DashboardPageData>(
    'dashboard',
    async () => {
      const [dashboard, stats, featureUsage] = await Promise.all([
        getDashboardSummary(),
        getPlatformStats(),
        getFeatureUsage(),
      ]);
      return { dashboard, stats, featureUsage };
    }
  );
}
