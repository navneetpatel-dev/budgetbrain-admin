'use client';

import Link from 'next/link';
import type { AdminSubscription } from '../types/subscriptions.types';
import { SubscriptionTierBadge } from './SubscriptionTierBadge.component';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge.component';
import { subscriptionStyles } from '../styles/subscriptions.styles';

interface SubscriptionRowProps {
  subscription: AdminSubscription;
}

export function SubscriptionRow({ subscription: s }: SubscriptionRowProps) {
  const periodEndFormatted = s.isLifetime
    ? 'Lifetime Access'
    : s.currentPeriodEnd
      ? new Date(s.currentPeriodEnd).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  const createdFormatted = new Date(s.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className={subscriptionStyles.tr}>
      <td className={subscriptionStyles.td}>
        <Link href={`/users/${s.userId}`} className={subscriptionStyles.link}>
          {s.user?.email ?? s.userId.slice(0, 8)}
        </Link>
        {s.user?.name && (
          <div className={subscriptionStyles.userMeta}>{s.user.name}</div>
        )}
      </td>
      <td className={subscriptionStyles.td}>
        <SubscriptionTierBadge plan={s.plan} />
      </td>
      <td className={subscriptionStyles.td}>
        <SubscriptionStatusBadge status={s.status} />
      </td>
      <td className={subscriptionStyles.td}>
        <span className={subscriptionStyles.storeLabel}>
          {s.store.replace('_', ' ')}
        </span>
      </td>
      <td className={subscriptionStyles.tdDate}>{periodEndFormatted}</td>
      <td className={subscriptionStyles.tdDate}>{createdFormatted}</td>
    </tr>
  );
}
