import type { SubscriptionPlan } from '../types/subscriptions.types';
import { subscriptionStyles } from '../styles/subscriptions.styles';

interface SubscriptionTierBadgeProps {
  plan: SubscriptionPlan;
}

const TIER_CLASS: Record<SubscriptionPlan, string> = {
  monthly: subscriptionStyles.tierMonthly,
  yearly: subscriptionStyles.tierYearly,
  lifetime: subscriptionStyles.tierLifetime,
};

export function SubscriptionTierBadge({ plan }: SubscriptionTierBadgeProps) {
  return (
    <span className={TIER_CLASS[plan] ?? subscriptionStyles.tierMonthly}>
      {plan}
    </span>
  );
}
