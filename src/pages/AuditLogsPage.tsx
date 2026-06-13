import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  createdAt: string;
  user?: { email: string };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    apiGet<{ logs: AuditLog[] }>('/admin/audit-logs').then((d) => setLogs(d.logs)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Audit Logs</h2>
      <div className="card">
        <table>
          <thead>
            <tr><th>User</th><th>Action</th><th>Resource</th><th>Time</th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{l.user?.email ?? 'System'}</td>
                <td>{l.action}</td>
                <td>{l.resource}</td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
