'use client';

import type { AuditLog } from '../types/audit.types';
import { AuditLogRow } from './AuditLogRow.component';
import Pagination from '@/shared/components/Pagination.component';
import { auditStyles } from '../styles/audit.styles';

interface AuditLogsTableProps {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  expandedId: string | null;
  onPageChange: (newPage: number) => void;
  onToggleExpanded: (id: string) => void;
}

export function AuditLogsTable({
  logs,
  total,
  page,
  limit,
  refreshing,
  expandedId,
  onPageChange,
  onToggleExpanded,
}: AuditLogsTableProps) {
  return (
    <div className={`${auditStyles.tableCard}${refreshing ? ' is-refreshing opacity-75' : ''}`}>
      <div className={auditStyles.tableWrapper}>
        <table className={auditStyles.table}>
          <thead>
            <tr>
              <th className={auditStyles.th}>Time</th>
              <th className={auditStyles.th}>Source</th>
              <th className={auditStyles.th}>Actor</th>
              <th className={auditStyles.th}>Action</th>
              <th className={auditStyles.th}>Resource</th>
              <th className={auditStyles.th}>Outcome</th>
              <th className={auditStyles.th}>Severity</th>
              <th className={auditStyles.th} />
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <AuditLogRow
                key={log.id}
                log={log}
                isExpanded={expandedId === log.id}
                onToggleExpanded={onToggleExpanded}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} />
    </div>
  );
}
