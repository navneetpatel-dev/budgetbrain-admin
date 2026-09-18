export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'active' | 'in_grace_period' | 'cancelled' | 'expired';
export type SubscriptionStore = 'app_store' | 'play_store' | 'stripe' | 'manual';

export interface AdminSubscription {
  id: string;
  userId: string;
  revenuecatAppUserId: string;
  productId: string;
  entitlementId: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  store: SubscriptionStore;
  isLifetime: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  originalPurchaseDate: string | null;
  unsubscribeDetectedAt: string | null;
  billingIssuesDetectedAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl?: string | null;
    role: string;
  };
}

export interface SubscriptionsResponse {
  subscriptions: AdminSubscription[];
  total: number;
  page: number;
  limit: number;
}

export interface SubscriptionQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  search?: string;
}

export interface SubscriptionMetrics {
  activeCount: number;
  monthlyCount: number;
  yearlyCount: number;
  lifetimeCount: number;
  cancelledCount: number;
  expiredCount: number;
  mrr: number;
  arr: number;
  totalRevenue: number;
  churnRate: number;
  conversionRate: number;
}
