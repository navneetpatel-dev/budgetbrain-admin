'use client';

import type { AdminSubscription } from '../types/subscriptions.types';
import { SubscriptionRow } from './SubscriptionRow.component';
import Pagination from '@/shared/components/Pagination.component';
import { subscriptionStyles } from '../styles/subscriptions.styles';

interface SubscriptionsTableProps {
  subscriptions: AdminSubscription[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  onPageChange: (newPage: number) => void;
}

export function SubscriptionsTable({
  subscriptions,
  total,
  page,
  limit,
  refreshing,
  onPageChange,
}: SubscriptionsTableProps) {
  return (
    <div className={`${subscriptionStyles.tableCard}${refreshing ? ' is-refreshing opacity-75' : ''}`}>
      <div className={subscriptionStyles.tableWrapper}>
        <table className={subscriptionStyles.table}>
          <thead>
            <tr>
              <th className={subscriptionStyles.th}>User</th>
              <th className={subscriptionStyles.th}>Plan</th>
              <th className={subscriptionStyles.th}>Status</th>
              <th className={subscriptionStyles.th}>Store</th>
              <th className={subscriptionStyles.th}>Period End</th>
              <th className={subscriptionStyles.th}>Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <SubscriptionRow key={s.id} subscription={s} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} />
    </div>
  );
}
