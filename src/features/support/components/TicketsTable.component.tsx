'use client';

import type { SupportTicket, TicketStatus } from '../types/support.types';
import { TicketRow } from './TicketRow.component';
import Pagination from '@/shared/components/Pagination.component';
import { SortableHeader } from '@/shared/components/SortableHeader.component';
import { supportStyles } from '../styles/support.styles';

interface TicketsTableProps {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  updatingId: string | null;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
  onSort: (column: string) => void;
  onPageChange: (newPage: number) => void;
  onUpdateStatus: (id: string, status: TicketStatus) => void;
}

export function TicketsTable({
  tickets,
  total,
  page,
  limit,
  refreshing,
  updatingId,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
  onUpdateStatus,
}: TicketsTableProps) {
  return (
    <div className={`${supportStyles.tableCard}${refreshing ? ' is-refreshing opacity-75' : ''}`}>
      <div className={supportStyles.tableWrapper}>
        <table className={supportStyles.table}>
          <thead>
            <tr>
              <th className={supportStyles.th}>User</th>
              <th className={supportStyles.th}>Subject</th>
              <SortableHeader label="Priority" column="priority" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={supportStyles.th} />
              <SortableHeader label="Status" column="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={supportStyles.th} />
              <SortableHeader label="Created" column="createdAt" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={supportStyles.th} />
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <TicketRow
                key={t.id}
                ticket={t}
                updatingId={updatingId}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} />
    </div>
  );
}
