import type { DetectionDashboard } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

const STATUSES = ['auto_approved', 'pending_review', 'user_confirmed', 'rejected', 'undone', 'duplicate'] as const;
const LABELS: Record<(typeof STATUSES)[number], string> = {
  auto_approved: 'Auto',
  pending_review: 'Review',
  user_confirmed: 'Confirmed',
  rejected: 'Rejected',
  undone: 'Undone',
  duplicate: 'Duplicate',
};

interface DailySeriesTableProps {
  series: DetectionDashboard['series'];
}

export function DailySeriesTable({ series }: DailySeriesTableProps) {
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>By day</h3>
      {series.length === 0 ? (
        <p className={detectionStyles.cardHint}>No data in this range.</p>
      ) : (
        <div className={detectionStyles.tableWrapper}>
          <table className={detectionStyles.table}>
            <thead>
              <tr>
                <th className={detectionStyles.th}>Day</th>
                {STATUSES.map((status) => (
                  <th key={status} className={detectionStyles.thNum}>
                    {LABELS[status]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.map((row) => (
                <tr key={row.day} className={detectionStyles.tr}>
                  <td className={detectionStyles.td}>{row.day}</td>
                  {STATUSES.map((status) => (
                    <td key={status} className={detectionStyles.tdNum}>
                      {Number(row[status] ?? 0).toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
