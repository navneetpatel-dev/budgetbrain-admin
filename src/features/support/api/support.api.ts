import { apiGet, apiPatch } from '@/shared/services/api';
import type { TicketsResponse, SupportTicket, TicketStatus } from '../types/support.types';

export async function getSupportTickets(page = 1, limit = 20): Promise<TicketsResponse> {
  return apiGet<TicketsResponse>(`/admin/support-tickets?page=${page}&limit=${limit}`);
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
  return apiPatch<SupportTicket>(`/admin/support-tickets/${id}`, { status });
}
