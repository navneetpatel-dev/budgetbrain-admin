'use client';

import { memo } from 'react';
import { ROLLOUT_STAGES, nextRolloutStage, rolloutStageOf, type RolloutStageId } from '../utils/templateMapping';
import type { RolloutRow } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface RolloutTableProps {
  rows: RolloutRow[];
  saving: boolean;
  onMove: (country: string, stage: RolloutStageId) => void;
  onRemove: (country: string) => void;
}

const RolloutTableRow = memo(function RolloutTableRow({
  row,
  saving,
  onMove,
  onRemove,
}: {
  row: RolloutRow;
  saving: boolean;
  onMove: (country: string, stage: RolloutStageId) => void;
  onRemove: (country: string) => void;
}) {
  const stage = rolloutStageOf(row);
  const next = nextRolloutStage(stage);
  return (
    <tr className={detectionStyles.tr}>
      <td className={detectionStyles.td}>{row.country || 'Default (other countries)'}</td>
      <td className={detectionStyles.td}>
        <select
          className={detectionStyles.select}
          value={stage}
          disabled={saving}
          onChange={(e) => onMove(row.country, e.target.value as RolloutStageId)}
        >
          {stage === 'custom' && <option value="custom">Custom ({row.percent} %)</option>}
          {ROLLOUT_STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </td>
      <td className={detectionStyles.tdMuted}>
        {row.updatedBy ?? 'system'}
        <div>{new Date(row.updatedAt).toLocaleString()}</div>
      </td>
      <td className={detectionStyles.td}>
        <div className={detectionStyles.headerActions}>
          {next && (
            <button type="button" className={detectionStyles.btnSm} disabled={saving} onClick={() => onMove(row.country, next)}>
              Next: {ROLLOUT_STAGES.find((s) => s.id === next)?.label}
            </button>
          )}
          <button type="button" className={detectionStyles.btnSm} disabled={saving} onClick={() => onRemove(row.country)}>
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
});

export function RolloutTable({ rows, saving, onMove, onRemove }: RolloutTableProps) {
  return (
    <div className={detectionStyles.tableCard}>
      <div className={detectionStyles.tableWrapper}>
        <table className={detectionStyles.table}>
          <thead>
            <tr>
              <th className={detectionStyles.th}>Country</th>
              <th className={detectionStyles.th}>Stage</th>
              <th className={detectionStyles.th}>Changed by</th>
              <th className={detectionStyles.th} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <RolloutTableRow key={row.country || 'default'} row={row} saving={saving} onMove={onMove} onRemove={onRemove} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
