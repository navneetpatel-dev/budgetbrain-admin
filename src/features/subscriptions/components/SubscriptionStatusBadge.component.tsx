import type { SubscriptionStatus } from '../types/subscriptions.types';
import { subscriptionStyles } from '../styles/subscriptions.styles';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
}

const STATUS_CLASS: Record<SubscriptionStatus, string> = {
  active: subscriptionStyles.statusActive,
  in_grace_period: subscriptionStyles.statusGrace,
  cancelled: subscriptionStyles.statusCancelled,
  expired: subscriptionStyles.statusExpired,
};

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  return (
    <span className={STATUS_CLASS[status] ?? subscriptionStyles.statusExpired}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
