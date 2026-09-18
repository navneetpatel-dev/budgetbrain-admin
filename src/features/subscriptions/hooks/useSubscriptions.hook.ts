'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getSubscriptions, getSubscriptionMetrics } from '../api/subscriptions.api';
import type {
  SubscriptionsResponse,
  SubscriptionMetrics,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../types/subscriptions.types';

interface SubscriptionsData {
  subscriptions: SubscriptionsResponse;
  metrics: SubscriptionMetrics;
}

export function useSubscriptions(initialLimit = 20) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [status, setStatus] = useState<'' | SubscriptionStatus>('');
  const [plan, setPlan] = useState<'' | SubscriptionPlan>('');
  const [search, setSearch] = useState('');

  const cacheKey = `subscriptions:${page}:${limit}:${status}:${plan}:${search}`;
  const { data, error, loading, refreshing, reload } = useCachedResource<SubscriptionsData>(
    cacheKey,
    async () => {
      const [subsResult, metricsResult] = await Promise.all([
        getSubscriptions({
          page,
          limit,
          status: status || undefined,
          plan: plan || undefined,
          search: search || undefined,
        }),
        getSubscriptionMetrics(),
      ]);
      return { subscriptions: subsResult, metrics: metricsResult };
    },
    { cache: false }
  );

  const subscriptions = data?.subscriptions?.subscriptions ?? [];
  const total = data?.subscriptions?.total ?? 0;
  const metrics = data?.metrics ?? null;

  return {
    subscriptions,
    total,
    metrics,
    page,
    limit,
    setPage,
    status,
    setStatus: (s: '' | SubscriptionStatus) => {
      setPage(1);
      setStatus(s);
    },
    plan,
    setPlan: (p: '' | SubscriptionPlan) => {
      setPage(1);
      setPlan(p);
    },
    search,
    setSearch: (val: string) => {
      setPage(1);
      setSearch(val);
    },
    error,
    loading,
    refreshing,
    reload,
  };
}
