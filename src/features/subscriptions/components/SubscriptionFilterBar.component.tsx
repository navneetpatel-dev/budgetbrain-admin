import type { SubscriptionPlan, SubscriptionStatus } from '../types/subscriptions.types';
import { subscriptionStyles } from '../styles/subscriptions.styles';

interface SubscriptionFilterBarProps {
  status: '' | SubscriptionStatus;
  plan: '' | SubscriptionPlan;
  search: string;
  onStatusChange: (status: '' | SubscriptionStatus) => void;
  onPlanChange: (plan: '' | SubscriptionPlan) => void;
  onSearchChange: (search: string) => void;
}

export function SubscriptionFilterBar({
  status,
  plan,
  search,
  onStatusChange,
  onPlanChange,
  onSearchChange,
}: SubscriptionFilterBarProps) {
  return (
    <div className={subscriptionStyles.filterCard}>
      <div className={subscriptionStyles.formRow}>
        <label className={subscriptionStyles.filterLabel}>
          <span>Search</span>
          <input
            type="text"
            className={subscriptionStyles.inputSm}
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <label className={subscriptionStyles.filterLabel}>
          <span>Plan</span>
          <select
            className={subscriptionStyles.selectSm}
            value={plan}
            onChange={(e) => onPlanChange(e.target.value as '' | SubscriptionPlan)}
          >
            <option value="">All plans</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </label>
        <label className={subscriptionStyles.filterLabel}>
          <span>Status</span>
          <select
            className={subscriptionStyles.selectSm}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as '' | SubscriptionStatus)}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="in_grace_period">In Grace Period</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </label>
      </div>
    </div>
  );
}
