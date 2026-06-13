import { useEffect, useState, useCallback } from 'react';
import { apiGet } from '../../shared/services/api';
import { LoadingState, ErrorState } from '../../shared/components/PageStates';

interface DashboardData {
  totalUsers: number;
  premiumUsers: number;
  activeSubscriptions: number;
  newUsersLast30Days: number;
  estimatedMRR: number;
  aiConversationsLast30Days: number;
  conversionRate: number;
  dau: number;
  mau: number;
  retentionRate: number;
}

interface StatsData {
  totalTransactions: number;
  totalExpenseVolume: number;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardData, statsData] = await Promise.all([
        apiGet<DashboardData>('/admin/dashboard'),
        apiGet<StatsData>('/admin/stats'),
      ]);
      setDashboard(dashboardData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!dashboard || !stats) return <ErrorState message="No dashboard data available" onRetry={load} />;

  const cards = [
    { label: 'Total Users', value: dashboard.totalUsers },
    { label: 'Premium Users', value: dashboard.premiumUsers },
    { label: 'Active Subscriptions', value: dashboard.activeSubscriptions },
    { label: 'New Users (30d)', value: dashboard.newUsersLast30Days },
    { label: 'Est. MRR (₹)', value: dashboard.estimatedMRR.toLocaleString() },
    { label: 'AI Chats (30d)', value: dashboard.aiConversationsLast30Days },
    { label: 'Conversion Rate', value: `${dashboard.conversionRate}%` },
    { label: 'DAU', value: dashboard.dau },
    { label: 'MAU', value: dashboard.mau },
    { label: 'DAU/MAU Retention', value: `${dashboard.retentionRate}%` },
    { label: 'Total Transactions', value: stats.totalTransactions.toLocaleString() },
    { label: 'Expense Volume (₹)', value: stats.totalExpenseVolume.toLocaleString() },
  ];

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <div className="grid">
        {cards.map((s) => (
          <div key={s.label} className="card stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
