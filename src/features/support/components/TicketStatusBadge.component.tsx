import type { TicketStatus } from '../types/support.types';
import { STATUS_LABEL } from '../types/support.types';
import { supportStyles } from '../styles/support.styles';

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const STATUS_CLASS: Record<TicketStatus, string> = {
  open: supportStyles.statusOpen,
  in_progress: supportStyles.statusInProgress,
  resolved: supportStyles.statusResolved,
  closed: supportStyles.statusClosed,
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  return (
    <span className={STATUS_CLASS[status] ?? supportStyles.statusClosed}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
