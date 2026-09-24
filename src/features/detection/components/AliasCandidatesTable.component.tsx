'use client';

import { memo } from 'react';
import type { AliasCandidate } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface AliasCandidatesTableProps {
  candidates: AliasCandidate[];
  saving: boolean;
  onPromote: (candidate: AliasCandidate) => void;
}

const AliasRow = memo(function AliasRow({
  candidate,
  saving,
  onPromote,
}: {
  candidate: AliasCandidate;
  saving: boolean;
  onPromote: (candidate: AliasCandidate) => void;
}) {
  return (
    <tr className={detectionStyles.tr}>
      <td className={detectionStyles.td}>
        <span className={detectionStyles.mono}>{candidate.aliasKey}</span>
      </td>
      <td className={detectionStyles.tdNum}>{candidate.users}</td>
      <td className={detectionStyles.tdMuted}>{candidate.suggestedCategory ?? '—'}</td>
      <td className={detectionStyles.td}>
        <button type="button" className={detectionStyles.btnSm} onClick={() => onPromote(candidate)} disabled={saving}>
          Promote
        </button>
      </td>
    </tr>
  );
});

/** Merchant names at least k users categorised themselves (T7.5). Personal rules still win. */
export function AliasCandidatesTable({ candidates, saving, onPromote }: AliasCandidatesTableProps) {
  return (
    <div className={detectionStyles.tableCard}>
      <div className={detectionStyles.tableWrapper}>
        <table className={detectionStyles.table}>
          <thead>
            <tr>
              <th className={detectionStyles.th}>Merchant key</th>
              <th className={detectionStyles.thNum}>Users</th>
              <th className={detectionStyles.th}>Most chosen category</th>
              <th className={detectionStyles.th} />
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <AliasRow key={candidate.aliasKey} candidate={candidate} saving={saving} onPromote={onPromote} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
