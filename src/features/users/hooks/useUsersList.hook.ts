'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getUsers } from '../api/users.api';
import type { UsersResponse } from '../types/users.types';

export function useUsersList(initialPage = 1, limit = 20) {
  const [page, setPage] = useState(initialPage);
  const { data, error, loading, refreshing, reload } = useCachedResource<UsersResponse>(
    `users:${page}`,
    () => getUsers(page, limit)
  );

  const users = data?.users ?? [];
  const total = data?.total ?? 0;

  return {
    users,
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
