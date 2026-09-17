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

interface BentoStatProps {
  icon: string;
  iconPodClass: string;
  badge: string;
  badgeClass: string;
  label: string;
  value: string;
  highlight?: boolean;
}

function BentoStat({ icon, iconPodClass, badge, badgeClass, label, value, highlight }: BentoStatProps) {
  return (
    <div className={`bento-stat${highlight ? ' bento-highlight' : ''}`}>
      <div className="bento-top">
        <span className={`bento-icon-pod ${iconPodClass}`}>{icon}</span>
        <span className={`bento-badge ${badgeClass}`}>{badge}</span>
      </div>
      <div className="stat-content">
        <span className="bento-label">{label}</span>
        <span className="bento-amount">{value}</span>
      </div>
    </div>
  );
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
            <h3 className="section-title">Financial Flow &amp; AI Operations</h3>
            <div className="grid bento-grid">
              <BentoStat
                icon="₹"
                iconPodClass="pod-ocean"
                badge="All Time"
                badgeClass="badge-neutral"
                label="Expense Volume"
                value={`₹${data.stats.totalExpenseVolume.toLocaleString()}`}
                highlight
              />
              <BentoStat
                icon="⚡"
                iconPodClass="pod-violet"
                badge="Settled"
                badgeClass="badge-neutral"
                label="Total Transactions"
                value={data.stats.totalTransactions.toLocaleString()}
              />
              <BentoStat
                icon="✦"
                iconPodClass="pod-emerald"
                badge="Last 30 Days"
                badgeClass="badge-secondary"
                label="AI Coach Invocations"
                value={data.dashboard.aiConversationsLast30Days.toLocaleString()}
              />
              <BentoStat
                icon="↗"
                iconPodClass="pod-primary"
                badge={`${data.dashboard.retentionRate}% Stickiness`}
                badgeClass="badge-secondary"
                label="DAU / MAU Ratio"
                value={`${data.dashboard.retentionRate}%`}
              />
            </div>
          </div>

          {/* Section 2: User Engagement & Growth */}
          <div className="section-block">
            <h3 className="section-title">User Growth &amp; Engagement</h3>
            <div className="grid bento-grid">
              <BentoStat
                icon="◎"
                iconPodClass="pod-ocean"
                badge="Total Base"
                badgeClass="badge-neutral"
                label="Registered Accounts"
                value={data.dashboard.totalUsers.toLocaleString()}
              />
              <BentoStat
                icon="◈"
                iconPodClass="pod-emerald"
                badge="+30 Days"
                badgeClass="badge-secondary"
                label="New Accounts"
                value={data.dashboard.newUsersLast30Days.toLocaleString()}
              />
              <BentoStat
                icon="◆"
                iconPodClass="pod-violet"
                badge="Active Today"
                badgeClass="badge-neutral"
                label="Daily Active Users (DAU)"
                value={data.dashboard.dau.toLocaleString()}
              />
              <BentoStat
                icon="◉"
                iconPodClass="pod-primary"
                badge="Active Month"
                badgeClass="badge-neutral"
                label="Monthly Active Users (MAU)"
                value={data.dashboard.mau.toLocaleString()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
