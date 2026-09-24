'use client';

import { memo } from 'react';
import type { SkeletonGroup } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface SkeletonQueueTableProps {
  groups: SkeletonGroup[];
  saving: boolean;
  onMap: (group: SkeletonGroup) => void;
  onDismiss: (group: SkeletonGroup) => void;
}

const SkeletonRow = memo(function SkeletonRow({
  group,
  saving,
  onMap,
  onDismiss,
}: {
  group: SkeletonGroup;
  saving: boolean;
  onMap: (group: SkeletonGroup) => void;
  onDismiss: (group: SkeletonGroup) => void;
}) {
  return (
    <tr className={detectionStyles.tr}>
      <td className={detectionStyles.td}>
        <div className={detectionStyles.skeleton}>{group.skeleton}</div>
      </td>
      <td className={detectionStyles.td}>
        {group.institutionName ?? group.institutionId ?? 'Unknown'}
        <div className={detectionStyles.cardHint}>{group.country}</div>
      </td>
      <td className={detectionStyles.tdNum}>{group.users}</td>
      <td className={detectionStyles.tdMuted}>{new Date(group.lastSeenAt).toLocaleDateString()}</td>
      <td className={detectionStyles.td}>
        <div className={detectionStyles.headerActions}>
          <button type="button" className={detectionStyles.btnSm} onClick={() => onMap(group)} disabled={saving}>
            Map to template
          </button>
          <button type="button" className={detectionStyles.btnSm} onClick={() => onDismiss(group)} disabled={saving}>
            Dismiss
          </button>
        </div>
      </td>
    </tr>
  );
});

/** Shapes submitted by at least k users; smaller groups never reach this list (T7.4). */
export function SkeletonQueueTable({ groups, saving, onMap, onDismiss }: SkeletonQueueTableProps) {
  return (
    <div className={detectionStyles.tableCard}>
      <div className={detectionStyles.tableWrapper}>
        <table className={detectionStyles.table}>
          <thead>
            <tr>
              <th className={detectionStyles.th}>Shape</th>
              <th className={detectionStyles.th}>Institution</th>
              <th className={detectionStyles.thNum}>Users</th>
              <th className={detectionStyles.th}>Last seen</th>
              <th className={detectionStyles.th} />
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <SkeletonRow key={group.skeletonHash} group={group} saving={saving} onMap={onMap} onDismiss={onDismiss} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
