'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { getAiUsage } from '../api/ai.api';
import type { AiUsageResponse } from '../types/ai.types';

export function useAiUsage(initialPage = 1, limit = 20) {
  const [page, setPage] = useState(initialPage);
  const { data, error, loading, refreshing, reload } = useCachedResource<AiUsageResponse>(
    `ai-usage:${page}`,
    () => getAiUsage(page, limit)
  );

  const conversations = data?.conversations ?? [];
  const total = data?.total ?? 0;

  return {
    conversations,
    total,
    page,
    limit,
    setPage,
    error,
    loading,
    refreshing,
    reload,
  };
}
