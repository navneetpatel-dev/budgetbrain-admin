export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: string;
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
  user?: { email: string; name: string | null };
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
}

export const STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};
