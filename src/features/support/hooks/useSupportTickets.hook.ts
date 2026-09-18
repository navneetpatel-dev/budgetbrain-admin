'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getSupportTickets, updateTicketStatus } from '../api/support.api';
import type { TicketsResponse, TicketStatus } from '../types/support.types';

export function useSupportTickets(initialPage = 1, limit = 20) {
  const [page, setPage] = useState(initialPage);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const { data, error, loading, refreshing, reload, setData } = useCachedResource<TicketsResponse>(
    `support-tickets:${page}`,
    () => getSupportTickets(page, limit)
  );

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
    updatingId,
    actionError,
    updateStatus,
    error,
    loading,
    refreshing,
    reload,
  };
}
