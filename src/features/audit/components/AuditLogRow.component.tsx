import { Fragment, memo } from 'react';
import type { AuditLog } from '../types/audit.types';
import { AuditLogDetail } from './AuditLogDetail.component';
import { auditStyles } from '../styles/audit.styles';

interface AuditLogRowProps {
  log: AuditLog;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
}

const SOURCE_BADGES: Record<string, string> = {
  mobile: auditStyles.sourceMobile,
  web: auditStyles.sourceWeb,
  admin: auditStyles.sourceAdmin,
  system: auditStyles.sourceSystem,
};

const OUTCOME_BADGES: Record<string, string> = {
  success: auditStyles.outcomeSuccess,
  failure: auditStyles.outcomeFailure,
};

const SEVERITY_BADGES: Record<string, string> = {
  info: auditStyles.severityInfo,
  warning: auditStyles.severityWarning,
  critical: auditStyles.severityCritical,
};

export const AuditLogRow = memo(function AuditLogRow({ log: l, isExpanded, onToggleExpanded }: AuditLogRowProps) {
  const timeFormatted = new Date(l.createdAt).toLocaleString();

  return (
    <Fragment>
      <tr className={auditStyles.tr}>
        <td className={auditStyles.tdTime}>{timeFormatted}</td>
        <td className={auditStyles.td}>
          <span className={SOURCE_BADGES[l.source] ?? auditStyles.sourceSystem}>
            {l.source}
          </span>
        </td>
        <td className={auditStyles.td}>
          <div className={auditStyles.actorBlock}>
            <span className={auditStyles.actorPrimary}>{l.user?.email ?? 'System / deleted user'}</span>
            <small className={auditStyles.actorSecondary}>{l.actorType}</small>
          </div>
        </td>
        <td className={auditStyles.td}>
          <code className={auditStyles.codeAction}>{l.action}</code>
        </td>
        <td className={auditStyles.td}>
          <div className={auditStyles.actorBlock}>
            <span className={auditStyles.actorPrimary}>{l.resource}</span>
            {l.resourceId && (
              <small className={auditStyles.actorSecondary}>{l.resourceId.slice(0, 8)}…</small>
            )}
          </div>
        </td>
        <td className={auditStyles.td}>
          <span className={OUTCOME_BADGES[l.outcome] ?? auditStyles.outcomeSuccess}>
            {l.outcome}
          </span>
        </td>
        <td className={auditStyles.td}>
          <span className={SEVERITY_BADGES[l.severity] ?? auditStyles.severityInfo}>
            {l.severity}
          </span>
        </td>
        <td className={auditStyles.td}>
          <button
            type="button"
            className={auditStyles.link}
            onClick={() => onToggleExpanded(l.id)}
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>
        </td>
      </tr>
      {isExpanded && <AuditLogDetail log={l} />}
    </Fragment>
  );
});
