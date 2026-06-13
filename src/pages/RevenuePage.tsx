import { useEffect, useState, useCallback } from 'react';
import { apiGet } from '../services/api';
import { LoadingState, ErrorState } from '../components/PageStates';

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

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setUsedFallback(false);
    try {
      const revenue = await apiGet<RevenueData>('/admin/revenue');
      setData(revenue);
    } catch {
      try {
        const dashboard = await apiGet<DashboardFallback>('/admin/dashboard');
        setData({
          estimatedMRR: dashboard.estimatedMRR,
          activeSubscriptions: dashboard.activeSubscriptions,
          mrrByPlan: [],
        });
        setUsedFallback(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load revenue data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <ErrorState message="No revenue data available" onRetry={load} />;

  const maxRevenue = Math.max(...data.mrrByPlan.map((p) => p.revenue), 1);

  return (
    <div>
      <h2 className="page-title">Revenue Analytics</h2>
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
  );
}
