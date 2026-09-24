import { detectionStyles } from '../styles/detection.styles';

interface CountTableProps {
  title: string;
  labelHeader: string;
  rows: { label: string; count: number }[];
}

/** A small label → count table (sources, countries, statuses). */
export function CountTable({ title, labelHeader, rows }: CountTableProps) {
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>{title}</h3>
      {rows.length === 0 ? (
        <p className={detectionStyles.cardHint}>No data in this range.</p>
      ) : (
        <div className={detectionStyles.tableWrapper}>
          <table className={detectionStyles.table}>
            <thead>
              <tr>
                <th className={detectionStyles.th}>{labelHeader}</th>
                <th className={detectionStyles.thNum}>Count</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className={detectionStyles.tr}>
                  <td className={detectionStyles.td}>{row.label}</td>
                  <td className={detectionStyles.tdNum}>{row.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
