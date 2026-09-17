import { apiGet } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import { ErrorState } from '../../shared/components/PageStates';
import { AdminDashboardSkeleton } from '../../shared/components/Skeleton';

interface DashboardData {
  totalUsers: number;
  newUsersLast30Days: number;
  aiConversationsLast30Days: number;
  dau: number;
  mau: number;
  retentionRate: number;
}

interface StatsData {
  totalTransactions: number;
  totalExpenseVolume: number;
}

interface DashboardPageData {
  dashboard: DashboardData;
  stats: StatsData;
}

export default function DashboardPage() {
  const { data, error, loading, refreshing, reload } = useCachedResource<DashboardPageData>(
    'dashboard',
    async () => {
      const [dashboard, stats] = await Promise.all([
        apiGet<DashboardData>('/admin/dashboard'),
        apiGet<StatsData>('/admin/stats'),
      ]);
      return { dashboard, stats };
    }
  );

  return (
    <div className="dashboard-view">
      <div className="page-header">
        <div>
          <div className="status-pill">
            <span className="live-dot" />
            <span>Live Analytics</span>
          </div>
          <h2 className="page-title">Executive Dashboard</h2>
          <p className="page-subtitle">Real-time platform metrics, user engagement, and transaction volume</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-refresh"
          onClick={() => void reload()}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh Data'}
        </button>
      </div>

      {loading && <AdminDashboardSkeleton cards={8} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && (
        <div className={`dashboard-sections${refreshing ? ' is-refreshing' : ''}`}>
          {/* Section 1: Financial & Platform Volume */}
          <div className="section-block">
            <h3 className="section-title">Financial Flow & AI Operations</h3>
            <div className="grid bento-grid">
              <div className="card bento-stat bento-highlight">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-ocean">₹</span>
                  <span className="bento-badge badge-secondary">All Time</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">Expense Volume</span>
                  <span className="bento-amount">₹{data.stats.totalExpenseVolume.toLocaleString()}</span>
                </div>
              </div>

              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-violet">⚡</span>
                  <span className="bento-badge badge-neutral">Settled</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">Total Transactions</span>
                  <span className="bento-amount">{data.stats.totalTransactions.toLocaleString()}</span>
                </div>
              </div>

              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-emerald">✨</span>
                  <span className="bento-badge badge-secondary">Last 30 Days</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">AI Coach Invocations</span>
                  <span className="bento-amount">{data.dashboard.aiConversationsLast30Days.toLocaleString()}</span>
                </div>
              </div>

              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-primary">📈</span>
                  <span className="bento-badge badge-secondary">{data.dashboard.retentionRate}% Stickiness</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">DAU / MAU Ratio</span>
                  <span className="bento-amount">{data.dashboard.retentionRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: User Engagement & Growth */}
          <div className="section-block">
            <h3 className="section-title">User Growth & Engagement</h3>
            <div className="grid bento-grid">
              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-ocean">👥</span>
                  <span className="bento-badge badge-neutral">Total Base</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">Registered Accounts</span>
                  <span className="bento-amount">{data.dashboard.totalUsers.toLocaleString()}</span>
                </div>
              </div>

              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-emerald">🌱</span>
                  <span className="bento-badge badge-secondary">+30 Days</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">New Accounts</span>
                  <span className="bento-amount">{data.dashboard.newUsersLast30Days.toLocaleString()}</span>
                </div>
              </div>

              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-violet">🔥</span>
                  <span className="bento-badge badge-neutral">Active Today</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">Daily Active Users (DAU)</span>
                  <span className="bento-amount">{data.dashboard.dau.toLocaleString()}</span>
                </div>
              </div>

              <div className="card bento-stat">
                <div className="bento-top">
                  <span className="bento-icon-pod pod-primary">🌐</span>
                  <span className="bento-badge badge-neutral">Active Month</span>
                </div>
                <div className="stat-content">
                  <span className="bento-label">Monthly Active Users (MAU)</span>
                  <span className="bento-amount">{data.dashboard.mau.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
