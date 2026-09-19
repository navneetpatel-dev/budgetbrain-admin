import { apiGet, apiPatch } from '@/shared/services/api';
import type { TicketsResponse, SupportTicket, TicketStatus } from '../types/support.types';

export async function getSupportTickets(page = 1, limit = 20, status?: string): Promise<TicketsResponse> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status && status !== 'all') {
    query.set('status', status);
  }
  return apiGet<TicketsResponse>(`/admin/support-tickets?${query.toString()}`);
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
  return apiPatch<SupportTicket>(`/admin/support-tickets/${id}`, { status });
}
