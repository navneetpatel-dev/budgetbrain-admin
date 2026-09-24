'use client';

import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { getUserDetection } from '../api/detection.api';
import type { UserDetection } from '../types/detection.types';

/** A user's detection tab (T7.3): settings, counts, learned rules, diagnostics, recent items. */
export function useUserDetection(userId: string) {
  const { data, error, loading, refreshing, reload } = useCachedResource<UserDetection>(
    `detection-user:${userId}`,
    () => (userId ? getUserDetection(userId) : Promise.reject(new Error('Invalid user ID'))),
    { cache: false }
  );
  return { detection: data, error, loading, refreshing, reload };
}
