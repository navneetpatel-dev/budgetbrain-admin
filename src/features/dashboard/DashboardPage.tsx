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
    <div>
      <h2 className="page-title">Dashboard</h2>
      {loading && <AdminDashboardSkeleton cards={8} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && data && (
        <div className={`grid${refreshing ? ' is-refreshing' : ''}`}>
          {[
            { label: 'Total Users', value: data.dashboard.totalUsers },
            { label: 'New Users (30d)', value: data.dashboard.newUsersLast30Days },
            { label: 'AI Chats (30d)', value: data.dashboard.aiConversationsLast30Days },
            { label: 'DAU', value: data.dashboard.dau },
            { label: 'MAU', value: data.dashboard.mau },
            { label: 'DAU/MAU Retention', value: `${data.dashboard.retentionRate}%` },
            { label: 'Total Transactions', value: data.stats.totalTransactions.toLocaleString() },
            { label: 'Expense Volume (₹)', value: data.stats.totalExpenseVolume.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="card stat">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
