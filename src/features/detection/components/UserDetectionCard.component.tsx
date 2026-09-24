import type { UserDetection } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface UserDetectionCardProps {
  detection: UserDetection;
}

/**
 * A user's Detection tab (T7.3): settings, counts by status and source, learned rules,
 * the last 14 days of diagnostics (counts and reason codes only, never message text) and the
 * latest detected items.
 */
export function UserDetectionCard({ detection }: UserDetectionCardProps) {
  const { settings, counts, rules, diagnostics, recent, skeletonSubmissions } = detection;
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>Detection</h3>
      <dl className={detectionStyles.dl}>
        <dt className={detectionStyles.dt}>Auto-add</dt>
        <dd className={detectionStyles.dd}>{settings.autoAddHighConfidence ? 'High-confidence items' : 'Review everything'}</dd>
        <dt className={detectionStyles.dt}>Template learning</dt>
        <dd className={detectionStyles.dd}>
          {settings.templateLearning ? 'Opted in' : 'Off'} · {skeletonSubmissions} shape(s) submitted
        </dd>
        <dt className={detectionStyles.dt}>Learned rules</dt>
        <dd className={detectionStyles.dd}>{rules.length}</dd>
      </dl>

      <div className={detectionStyles.grid2}>
        <div className={detectionStyles.tableWrapper}>
          <h4 className={detectionStyles.statLabel}>Detected by status</h4>
          {counts.length === 0 ? (
            <p className={detectionStyles.cardHint}>Nothing detected yet.</p>
          ) : (
            <table className={detectionStyles.table}>
              <thead>
                <tr>
                  <th className={detectionStyles.th}>Status</th>
                  <th className={detectionStyles.th}>Source</th>
                  <th className={detectionStyles.thNum}>Count</th>
                </tr>
              </thead>
              <tbody>
                {counts.map((row) => (
                  <tr key={`${row.status}-${row.source}`} className={detectionStyles.tr}>
                    <td className={detectionStyles.td}>{row.status}</td>
                    <td className={detectionStyles.tdMuted}>{row.source}</td>
                    <td className={detectionStyles.tdNum}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={detectionStyles.tableWrapper}>
          <h4 className={detectionStyles.statLabel}>Device diagnostics (14 days)</h4>
          {diagnostics.length === 0 ? (
            <p className={detectionStyles.cardHint}>No diagnostics uploaded.</p>
          ) : (
            <table className={detectionStyles.table}>
              <thead>
                <tr>
                  <th className={detectionStyles.th}>Day</th>
                  <th className={detectionStyles.th}>Stage · reason</th>
                  <th className={detectionStyles.th}>Institution</th>
                  <th className={detectionStyles.thNum}>Count</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.map((row) => (
                  <tr key={`${row.day}-${row.stage}-${row.reasonCode}-${row.institutionId ?? ''}`} className={detectionStyles.tr}>
                    <td className={detectionStyles.tdMuted}>{row.day}</td>
                    <td className={detectionStyles.td}>
                      {row.stage} · <span className={detectionStyles.mono}>{row.reasonCode}</span>
                    </td>
                    <td className={detectionStyles.tdMuted}>{row.institutionName ?? row.institutionId ?? '—'}</td>
                    <td className={detectionStyles.tdNum}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={detectionStyles.tableWrapper}>
        <h4 className={detectionStyles.statLabel}>Latest detected</h4>
        {recent.length === 0 ? (
          <p className={detectionStyles.cardHint}>None.</p>
        ) : (
          <table className={detectionStyles.table}>
            <thead>
              <tr>
                <th className={detectionStyles.th}>When</th>
                <th className={detectionStyles.th}>Merchant</th>
                <th className={detectionStyles.thNum}>Amount</th>
                <th className={detectionStyles.th}>Status</th>
                <th className={detectionStyles.th}>Source</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id} className={detectionStyles.tr}>
                  <td className={detectionStyles.tdMuted}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td className={detectionStyles.td}>{item.merchant ?? '—'}</td>
                  <td className={detectionStyles.tdNum}>
                    {item.currency} {item.amount}
                  </td>
                  <td className={detectionStyles.td}>
                    {item.status}
                    {item.reviewReason && <div className={detectionStyles.cardHint}>{item.reviewReason}</div>}
                  </td>
                  <td className={detectionStyles.tdMuted}>{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {rules.length > 0 && (
        <div className={detectionStyles.tableWrapper}>
          <h4 className={detectionStyles.statLabel}>Learned rules</h4>
          <table className={detectionStyles.table}>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.merchant} className={detectionStyles.tr}>
                  <td className={detectionStyles.td}>
                    <span className={detectionStyles.mono}>{rule.merchant}</span>
                  </td>
                  <td className={detectionStyles.tdMuted}>{rule.categoryName ?? 'deleted category'}</td>
                  <td className={detectionStyles.tdMuted}>{new Date(rule.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
