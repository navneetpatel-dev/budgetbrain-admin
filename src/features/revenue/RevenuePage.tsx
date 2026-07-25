import { apiGet } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import { ErrorState } from '../../shared/components/PageStates';
import { AdminDashboardSkeleton } from '../../shared/components/Skeleton';

interface RevenuePlan {
  plan: string;
  count: number;
  revenue: number;
}

interface RevenueData {
  estimatedMRR: number;
  mrrByPlan: RevenuePlan[];
  activeSubscriptions: number;
}

interface DashboardFallback {
  estimatedMRR: number;
  activeSubscriptions: number;
}

interface RevenuePageData {
  data: RevenueData;
  usedFallback: boolean;
}

export default function RevenuePage() {
  const { data: pageData, error, loading, refreshing, reload } = useCachedResource<RevenuePageData>(
    'revenue',
    async () => {
      try {
        const revenue = await apiGet<RevenueData>('/admin/revenue');
        return { data: revenue, usedFallback: false };
      } catch {
        const dashboard = await apiGet<DashboardFallback>('/admin/dashboard');
        return {
          data: {
            estimatedMRR: dashboard.estimatedMRR,
            activeSubscriptions: dashboard.activeSubscriptions,
            mrrByPlan: [],
          },
          usedFallback: true,
        };
      }
    }
  );

  const data = pageData?.data;
  const usedFallback = pageData?.usedFallback ?? false;
  const maxRevenue = Math.max(...(data?.mrrByPlan.map((p) => p.revenue) ?? [1]), 1);

  return (
    <div>
      <h2 className="page-title">Revenue Analytics</h2>
      {loading && <AdminDashboardSkeleton cards={2} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && data && (
        <div className={refreshing ? 'is-refreshing' : undefined}>
          {usedFallback && (
            <div className="notice">
              Revenue endpoint unavailable — showing dashboard MRR estimate.
            </div>
          )}
          <div className="grid">
            <div className="card stat">
              <div className="stat-value">₹{data.estimatedMRR.toLocaleString()}</div>
              <div className="stat-label">Estimated MRR</div>
            </div>
            <div className="card stat">
              <div className="stat-value">{data.activeSubscriptions}</div>
              <div className="stat-label">Active Subscriptions</div>
            </div>
          </div>

          {data.mrrByPlan.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <h3 className="section-title">MRR by Plan</h3>
              <div className="bar-chart">
                {data.mrrByPlan.map((plan) => (
                  <div key={plan.plan} className="bar-row">
                    <span className="bar-label">{plan.plan}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(plan.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="bar-value">
                      ₹{plan.revenue.toLocaleString()} ({plan.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
