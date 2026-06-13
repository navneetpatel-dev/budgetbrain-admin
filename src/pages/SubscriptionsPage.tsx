import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  purchasedAt: string;
  user?: { email: string; name: string | null };
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    apiGet<{ subscriptions: Subscription[] }>('/admin/subscriptions')
      .then((d) => setSubs(d.subscriptions))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Subscriptions</h2>
      <div className="card">
        <table>
          <thead>
            <tr><th>User</th><th>Plan</th><th>Status</th><th>Purchased</th></tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id}>
                <td>{s.user?.email ?? '—'}</td>
                <td>{s.plan}</td>
                <td>{s.status}</td>
                <td>{new Date(s.purchasedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
