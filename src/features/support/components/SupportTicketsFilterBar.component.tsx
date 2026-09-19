'use client';

import { supportStyles } from '../styles/support.styles';

interface SupportTicketsFilterBarProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export function SupportTicketsFilterBar({
  status,
  onStatusChange,
}: SupportTicketsFilterBarProps) {
  return (
    <div className={supportStyles.filterCard}>
      <div className={supportStyles.formRow}>
        <label className={supportStyles.filterLabel}>
          <span>Status</span>
          <select
            className={supportStyles.selectSm}
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>
    </div>
  );
}
