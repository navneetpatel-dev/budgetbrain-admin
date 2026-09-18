import type { AuditLog } from '../types/audit.types';
import { auditStyles } from '../styles/audit.styles';

interface AuditLogDetailProps {
  log: AuditLog;
}

export function AuditLogDetail({ log: l }: AuditLogDetailProps) {
  return (
    <tr className={auditStyles.detailsRow}>
      <td colSpan={8}>
        <div className={auditStyles.detailsContainer}>
          <div className={auditStyles.detailsMetaRow}>
            <div className={auditStyles.detailsMetaItem}>
              <span className={auditStyles.detailsMetaLabel}>Request ID:</span>
              <span>{l.requestId ?? '—'}</span>
            </div>
            <div className={auditStyles.detailsMetaItem}>
              <span className={auditStyles.detailsMetaLabel}>IP:</span>
              <span>{l.ipAddress ?? '—'}</span>
            </div>
            <div className={auditStyles.detailsMetaItem}>
              <span className={auditStyles.detailsMetaLabel}>User Agent:</span>
              <span>{l.userAgent ?? '—'}</span>
            </div>
          </div>
          {l.beforeState && (
            <div className={auditStyles.jsonBlock}>
              <span className={auditStyles.jsonLabel}>Before State</span>
              <pre className={auditStyles.jsonPre}>{JSON.stringify(l.beforeState, null, 2)}</pre>
            </div>
          )}
          {l.afterState && (
            <div className={auditStyles.jsonBlock}>
              <span className={auditStyles.jsonLabel}>After State</span>
              <pre className={auditStyles.jsonPre}>{JSON.stringify(l.afterState, null, 2)}</pre>
            </div>
          )}
          {l.metadata && (
            <div className={auditStyles.jsonBlock}>
              <span className={auditStyles.jsonLabel}>Metadata</span>
              <pre className={auditStyles.jsonPre}>{JSON.stringify(l.metadata, null, 2)}</pre>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
