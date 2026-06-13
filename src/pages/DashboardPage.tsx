import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

interface DashboardData {
  totalUsers: number;
  premiumUsers: number;
  activeSubscriptions: number;
  newUsersLast30Days: number;
  estimatedMRR: number;
  aiConversationsLast30Days: number;
  conversionRate: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiGet<DashboardData>('/admin/dashboard').then(setData).catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  const stats = [
    { label: 'Total Users', value: data.totalUsers },
    { label: 'Premium Users', value: data.premiumUsers },
    { label: 'Active Subscriptions', value: data.activeSubscriptions },
    { label: 'New Users (30d)', value: data.newUsersLast30Days },
    { label: 'Est. MRR (₹)', value: data.estimatedMRR },
    { label: 'AI Chats (30d)', value: data.aiConversationsLast30Days },
    { label: 'Conversion Rate', value: `${data.conversionRate}%` },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <div className="grid">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
