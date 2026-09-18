import type { AuditSource, AuditOutcome, AuditSeverity } from '../types/audit.types';
import { auditStyles } from '../styles/audit.styles';

interface AuditFilterBarProps {
  source: '' | AuditSource;
  outcome: '' | AuditOutcome;
  severity: '' | AuditSeverity;
  onSourceChange: (source: '' | AuditSource) => void;
  onOutcomeChange: (outcome: '' | AuditOutcome) => void;
  onSeverityChange: (severity: '' | AuditSeverity) => void;
}

export function AuditFilterBar({
  source,
  outcome,
  severity,
  onSourceChange,
  onOutcomeChange,
  onSeverityChange,
}: AuditFilterBarProps) {
  return (
    <div className={auditStyles.filterCard}>
      <div className={auditStyles.formRow}>
        <label className={auditStyles.filterLabel}>
          <span>Source</span>
          <select
            className={auditStyles.selectSm}
            value={source}
            onChange={(e) => onSourceChange(e.target.value as '' | AuditSource)}
          >
            <option value="">All platforms</option>
            <option value="mobile">Mobile</option>
            <option value="web">Web</option>
            <option value="admin">Admin</option>
            <option value="system">System</option>
          </select>
        </label>
        <label className={auditStyles.filterLabel}>
          <span>Outcome</span>
          <select
            className={auditStyles.selectSm}
            value={outcome}
            onChange={(e) => onOutcomeChange(e.target.value as '' | AuditOutcome)}
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </label>
        <label className={auditStyles.filterLabel}>
          <span>Severity</span>
          <select
            className={auditStyles.selectSm}
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value as '' | AuditSeverity)}
          >
            <option value="">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </label>
      </div>
    </div>
  );
}
