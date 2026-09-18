import { supportStyles } from '../styles/support.styles';

interface TicketPriorityBadgeProps {
  priority: string;
}

const PRIORITY_CLASS: Record<string, string> = {
  low: supportStyles.priorityLow,
  medium: supportStyles.priorityMedium,
  high: supportStyles.priorityHigh,
  critical: supportStyles.priorityCritical,
};

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  return (
    <span className={PRIORITY_CLASS[priority] ?? supportStyles.priorityLow}>
      {priority}
    </span>
  );
}
