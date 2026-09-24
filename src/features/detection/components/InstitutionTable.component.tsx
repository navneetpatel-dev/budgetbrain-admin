import type { DetectionDashboard } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface InstitutionTableProps {
  rows: DetectionDashboard['byInstitution'];
}

export function InstitutionTable({ rows }: InstitutionTableProps) {
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>Top institutions</h3>
      {rows.length === 0 ? (
        <p className={detectionStyles.cardHint}>No data in this range.</p>
      ) : (
        <div className={detectionStyles.tableWrapper}>
          <table className={detectionStyles.table}>
            <thead>
              <tr>
                <th className={detectionStyles.th}>Institution</th>
                <th className={detectionStyles.thNum}>Detected</th>
                <th className={detectionStyles.thNum}>Auto</th>
                <th className={detectionStyles.thNum}>Review</th>
                <th className={detectionStyles.thNum}>Rejected / undone</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.institutionId ?? 'none'} className={detectionStyles.tr}>
                  <td className={detectionStyles.td}>
                    {row.name ?? row.institutionId ?? 'Unknown'}
                    {row.institutionId && <div className={detectionStyles.mono}>{row.institutionId}</div>}
                  </td>
                  <td className={detectionStyles.tdNum}>{row.count.toLocaleString()}</td>
                  <td className={detectionStyles.tdNum}>{row.autoApproved.toLocaleString()}</td>
                  <td className={detectionStyles.tdNum}>{row.review.toLocaleString()}</td>
                  <td className={detectionStyles.tdNum}>{row.rejected.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
