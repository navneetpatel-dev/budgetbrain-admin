'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getUsers } from '../api/users.api';
import type { UsersResponse } from '../types/users.types';

export function useUsersList(initialPage = 1, limit = 20) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [isSuspended, setIsSuspended] = useState<'all' | 'true' | 'false'>('all');

  const { data, error, loading, refreshing, reload } = useCachedResource<UsersResponse>(
    `users:${page}:${search}:${role}:${isSuspended}`,
    () =>
      getUsers({
        page,
        limit,
        search: search.trim() || undefined,
        role: role !== 'all' ? role : undefined,
        isSuspended: isSuspended === 'true' ? true : isSuspended === 'false' ? false : undefined,
      })
  );

  const users = data?.users ?? [];
  const total = data?.total ?? 0;

  return {
    users,
    total,
    page,
    limit,
    setPage,
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    role,
    setRole: (val: string) => {
      setRole(val);
      setPage(1);
    },
    isSuspended,
    setIsSuspended: (val: 'all' | 'true' | 'false') => {
      setIsSuspended(val);
      setPage(1);
    },
    error,
    loading,
    refreshing,
    reload,
  };
}
