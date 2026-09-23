'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue.hook';
import { getUsers } from '../api/users.api';
import type { UsersResponse } from '../types/users.types';

export function useUsersList(initialPage = 1, limit = 20) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [isSuspended, setIsSuspended] = useState<'all' | 'true' | 'false'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
  // Raw `search` drives the input so typing stays instant; the debounced value drives
  // the cache key/fetch so a fast typist doesn't fire one request per keystroke.
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, error, loading, refreshing, reload } = useCachedResource<UsersResponse>(
    `users:${page}:${debouncedSearch}:${role}:${isSuspended}:${sortBy}:${sortDir}`,
    () =>
      getUsers({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        role: role !== 'all' ? role : undefined,
        isSuspended: isSuspended === 'true' ? true : isSuspended === 'false' ? false : undefined,
        sortBy,
        sortDir,
      })
  );

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortDir('ASC');
    }
    setPage(1);
  };

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
    sortBy,
    sortDir,
    handleSort,
    error,
    loading,
    refreshing,
    reload,
  };
}
