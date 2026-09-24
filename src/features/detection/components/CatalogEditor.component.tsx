'use client';

import { NEXT_STATUSES } from '../utils/templateMapping';
import { CatalogStatusBadge } from './CatalogStatusBadge.component';
import { detectionStyles } from '../styles/detection.styles';
import type { CatalogHistoryEntry, CatalogRow, CatalogStatus } from '../types/detection.types';

interface CatalogEditorProps {
  row: CatalogRow | null;
  creating: boolean;
  hasProvidedId: boolean;
  draftId: string;
  draftJson: string;
  history: CatalogHistoryEntry[];
  saving: boolean;
  error: string;
  onDraftIdChange: (id: string) => void;
  onDraftJsonChange: (json: string) => void;
  onSave: () => void;
  onMove: (status: CatalogStatus) => void;
  onClose: () => void;
}

const MOVE_LABELS: Record<CatalogStatus, string> = {
  draft: 'Back to draft',
  review: 'Send to review',
  published: 'Publish',
};

/**
 * Edits one catalog row as JSON. Saving an edit returns the row to draft with a new version;
 * publishing puts it in the next pack build.
 */
export function CatalogEditor({
  row,
  creating,
  hasProvidedId,
  draftId,
  draftJson,
  history,
  saving,
  error,
  onDraftIdChange,
  onDraftJsonChange,
  onSave,
  onMove,
  onClose,
}: CatalogEditorProps) {
  return (
    <div className={detectionStyles.card}>
      <div className={detectionStyles.header}>
        <div className={detectionStyles.headerLeft}>
          <h3 className={detectionStyles.cardTitle}>{creating ? 'New row' : row?.id}</h3>
          {row && (
            <span className={detectionStyles.cardHint}>
              <CatalogStatusBadge status={row.status} /> v{row.version} · updated {new Date(row.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
        <button type="button" className={detectionStyles.btnSm} onClick={onClose}>
          Close
        </button>
      </div>

      {error && <div className={detectionStyles.errorBanner}>{error}</div>}

      {creating && hasProvidedId && (
        <label className={detectionStyles.field}>
          <span>Id</span>
          <input className={detectionStyles.input} value={draftId} onChange={(e) => onDraftIdChange(e.target.value)} />
        </label>
      )}

      <label className={detectionStyles.field}>
        <span>Data (JSON)</span>
        <textarea
          className={detectionStyles.textarea}
          value={draftJson}
          spellCheck={false}
          onChange={(e) => onDraftJsonChange(e.target.value)}
        />
      </label>

      <div className={detectionStyles.headerActions}>
        <button type="button" className={detectionStyles.btnPrimary} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : creating ? 'Create draft' : 'Save as new draft version'}
        </button>
        {row &&
          NEXT_STATUSES[row.status].map((next) => (
            <button key={next} type="button" className={detectionStyles.btn} onClick={() => onMove(next)} disabled={saving}>
              {MOVE_LABELS[next]}
            </button>
          ))}
      </div>

      {row && (
        <div className={detectionStyles.list}>
          <h4 className={detectionStyles.statLabel}>History</h4>
          {history.length === 0 && <p className={detectionStyles.cardHint}>No history yet.</p>}
          {history.map((entry) => (
            <div key={entry.id} className={detectionStyles.historyItem}>
              <span>
                <strong>v{entry.version}</strong> · {entry.action} · <CatalogStatusBadge status={entry.status} />
              </span>
              <span className={detectionStyles.cardHint}>
                {new Date(entry.createdAt).toLocaleString()} · {entry.changedBy ?? 'system'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
