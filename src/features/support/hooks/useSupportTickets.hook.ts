'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getSupportTickets, updateTicketStatus } from '../api/support.api';
import type { TicketsResponse, TicketStatus } from '../types/support.types';

export function useSupportTickets(initialPage = 1, limit = 20) {
  const [page, setPage] = useState(initialPage);
  const [status, setStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

  const { data, error, loading, refreshing, reload, setData } = useCachedResource<TicketsResponse>(
    `support-tickets:${page}:${status}:${sortBy}:${sortDir}`,
    () => getSupportTickets(page, limit, status !== 'all' ? status : undefined, sortBy, sortDir)
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

  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;

  const updateStatus = async (id: string, status: TicketStatus) => {
    setUpdatingId(id);
    setActionError('');
    try {
      const updated = await updateTicketStatus(id, status);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tickets: prev.tickets.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        };
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    tickets,
    total,
    page,
    limit,
    setPage,
    status,
    setStatus: (newStatus: string) => {
      setStatus(newStatus);
      setPage(1);
    },
    sortBy,
    sortDir,
    handleSort,
    updatingId,
    actionError,
    updateStatus,
    error,
    loading,
    refreshing,
    reload,
  };
}
