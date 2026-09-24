'use client';

import type { AliasCandidate } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface AliasPromoteFormProps {
  candidate: AliasCandidate;
  merchantId: string;
  country: string;
  saving: boolean;
  onChange: (patch: { merchantId?: string; country?: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AliasPromoteForm({ candidate, merchantId, country, saving, onChange, onSubmit, onCancel }: AliasPromoteFormProps) {
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>Promote &quot;{candidate.aliasKey}&quot; to a global alias</h3>
      <p className={detectionStyles.cardHint}>
        Creates a draft alias pointing to an existing merchant. {candidate.users} users chose
        {candidate.suggestedCategory ? ` “${candidate.suggestedCategory}” most often` : ' a category'}.
      </p>
      <div className={detectionStyles.formRow}>
        <label className={detectionStyles.field}>
          <span>Merchant id</span>
          <input
            className={detectionStyles.input}
            value={merchantId}
            placeholder="m.swiggy"
            onChange={(e) => onChange({ merchantId: e.target.value })}
          />
        </label>
        <label className={detectionStyles.field}>
          <span>Country (blank for global)</span>
          <input
            className={detectionStyles.input}
            value={country}
            placeholder="IN"
            onChange={(e) => onChange({ country: e.target.value.toUpperCase() })}
          />
        </label>
        <button type="button" className={detectionStyles.btnPrimary} onClick={onSubmit} disabled={saving}>
          {saving ? 'Creating…' : 'Create draft alias'}
        </button>
        <button type="button" className={detectionStyles.btn} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
