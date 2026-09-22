import { apiGet } from '@/shared/api/admin.api';
import type {
  SubscriptionsResponse,
  SubscriptionQueryParams,
  SubscriptionMetrics,
} from '../types/subscriptions.types';

export async function getSubscriptions(params: SubscriptionQueryParams = {}): Promise<SubscriptionsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  if (params.plan) query.set('plan', params.plan);
  if (params.search) query.set('search', params.search);

  return apiGet<SubscriptionsResponse>(`/admin/subscriptions?${query.toString()}`);
}

export async function getSubscriptionMetrics(): Promise<SubscriptionMetrics> {
  return apiGet<SubscriptionMetrics>('/admin/revenue');
}
