'use client';

import { memo } from 'react';
import type { KillSwitch } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface KillSwitchTableProps {
  switches: KillSwitch[];
  saving: boolean;
  onToggle: (ks: KillSwitch) => void;
}

const KillSwitchRow = memo(function KillSwitchRow({
  ks,
  saving,
  onToggle,
}: {
  ks: KillSwitch;
  saving: boolean;
  onToggle: (ks: KillSwitch) => void;
}) {
  return (
    <tr className={detectionStyles.tr}>
      <td className={detectionStyles.td}>
        <span className={ks.active ? detectionStyles.badgeActive : detectionStyles.badgeInactive}>
          {ks.active ? 'Active' : 'Off'}
        </span>
      </td>
      <td className={detectionStyles.td}>{ks.scope}</td>
      <td className={detectionStyles.td}>
        <span className={detectionStyles.mono}>{ks.key}</span>
      </td>
      <td className={detectionStyles.tdMuted}>{ks.action}</td>
      <td className={detectionStyles.tdMuted}>{ks.reason ?? '—'}</td>
      <td className={detectionStyles.tdMuted}>
        {ks.createdBy ?? 'system'}
        <div>{new Date(ks.updatedAt).toLocaleString()}</div>
      </td>
      <td className={detectionStyles.td}>
        <button
          type="button"
          className={ks.active ? detectionStyles.btnSm : detectionStyles.btnDanger}
          onClick={() => onToggle(ks)}
          disabled={saving}
        >
          {ks.active ? 'Deactivate' : 'Reactivate'}
        </button>
      </td>
    </tr>
  );
});

export function KillSwitchTable({ switches, saving, onToggle }: KillSwitchTableProps) {
  return (
    <div className={detectionStyles.tableCard}>
      <div className={detectionStyles.tableWrapper}>
        <table className={detectionStyles.table}>
          <thead>
            <tr>
              <th className={detectionStyles.th}>State</th>
              <th className={detectionStyles.th}>Scope</th>
              <th className={detectionStyles.th}>Key</th>
              <th className={detectionStyles.th}>Action</th>
              <th className={detectionStyles.th}>Reason</th>
              <th className={detectionStyles.th}>Changed by</th>
              <th className={detectionStyles.th} />
            </tr>
          </thead>
          <tbody>
            {switches.map((ks) => (
              <KillSwitchRow key={ks.id} ks={ks} saving={saving} onToggle={onToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
