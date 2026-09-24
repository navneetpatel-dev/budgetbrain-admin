'use client';

import { KILL_SWITCH_ACTIONS, KILL_SWITCH_SCOPES, type KillSwitchInput } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

interface KillSwitchFormProps {
  form: KillSwitchInput;
  saving: boolean;
  onChange: (form: KillSwitchInput) => void;
  onSubmit: () => void;
}

const KEY_HINTS: Record<KillSwitchInput['scope'], string> = {
  institution: 'in.hdfc_bank',
  template: 'in.hdfc_bank.upi_debit_v1',
  country: 'IN',
  pack: 'IN@42',
  app_version: '<2.4.0',
};

export function KillSwitchForm({ form, saving, onChange, onSubmit }: KillSwitchFormProps) {
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>New kill switch</h3>
      <p className={detectionStyles.cardHint}>
        Takes effect on devices with their next config fetch (within minutes) and in the next pack build.
      </p>
      <div className={detectionStyles.formRow}>
        <label className={detectionStyles.field}>
          <span>Scope</span>
          <select
            className={detectionStyles.select}
            value={form.scope}
            onChange={(e) => onChange({ ...form, scope: e.target.value as KillSwitchInput['scope'] })}
          >
            {KILL_SWITCH_SCOPES.map((scope) => (
              <option key={scope} value={scope}>
                {scope}
              </option>
            ))}
          </select>
        </label>
        <label className={detectionStyles.field}>
          <span>Key</span>
          <input
            className={detectionStyles.input}
            value={form.key}
            placeholder={KEY_HINTS[form.scope]}
            onChange={(e) => onChange({ ...form, key: e.target.value })}
          />
        </label>
        <label className={detectionStyles.field}>
          <span>Action</span>
          <select
            className={detectionStyles.select}
            value={form.action}
            onChange={(e) => onChange({ ...form, action: e.target.value as KillSwitchInput['action'] })}
          >
            {KILL_SWITCH_ACTIONS.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>
        <label className={detectionStyles.field}>
          <span>Reason</span>
          <input
            className={detectionStyles.input}
            value={form.reason}
            placeholder="Why, for the audit log"
            onChange={(e) => onChange({ ...form, reason: e.target.value })}
          />
        </label>
        <button type="button" className={detectionStyles.btnPrimary} onClick={onSubmit} disabled={saving}>
          {saving ? 'Saving…' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
