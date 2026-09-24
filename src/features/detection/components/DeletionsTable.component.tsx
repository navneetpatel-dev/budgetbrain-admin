import Link from 'next/link';
import type { DeletionRequest } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

const LABELS: Record<string, string> = {
  'detection.delete_all': 'Deleted detected data',
  'user.delete': 'Deleted account',
};

export function DeletionsTable({ requests }: { requests: DeletionRequest[] }) {
  return (
    <div className={detectionStyles.tableCard}>
      <div className={detectionStyles.tableWrapper}>
        <table className={detectionStyles.table}>
          <thead>
            <tr>
              <th className={detectionStyles.th}>When</th>
              <th className={detectionStyles.th}>Request</th>
              <th className={detectionStyles.th}>User</th>
              <th className={detectionStyles.th}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className={detectionStyles.tr}>
                <td className={detectionStyles.tdMuted}>{new Date(request.createdAt).toLocaleString()}</td>
                <td className={detectionStyles.td}>{LABELS[request.action] ?? request.action}</td>
                <td className={detectionStyles.td}>
                  {request.userId ? (
                    <Link href={`/users/${request.userId}`} className={detectionStyles.link}>
                      <span className={detectionStyles.mono}>{request.userId.slice(0, 8)}…</span>
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td className={detectionStyles.tdMuted}>
                  <span className={detectionStyles.mono}>{request.detail ? JSON.stringify(request.detail) : '—'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
