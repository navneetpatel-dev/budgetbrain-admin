'use client';

import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { listDeletionRequests } from '../api/detection.api';
import type { DeletionRequest } from '../types/detection.types';

/** Account and detected-data deletions of the last 90 days (T7.6). */
export function useDeletionRequests() {
  const { data, error, loading, refreshing, reload } = useCachedResource<DeletionRequest[]>(
    'detection-deletions',
    listDeletionRequests,
    { cache: false }
  );
  return { requests: data ?? [], error, loading, refreshing, reload };
}
