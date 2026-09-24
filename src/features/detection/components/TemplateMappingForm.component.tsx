'use client';

import { skeletonPlaceholders } from '../utils/templateMapping';
import { TEMPLATE_FIELDS, type SkeletonGroup, type TemplateField } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

const TRANSACTION_TYPES = ['expense', 'income', 'refund', 'transfer'];
const PAYMENT_METHODS = ['', 'card', 'upi', 'bank_transfer', 'wallet', 'cash', 'other'];

export interface TemplateMappingValues {
  id: string;
  institutionId: string;
  language: string;
  fields: TemplateField[];
  direction: 'DEBIT' | 'CREDIT';
  transactionType: string;
  paymentMethod: string;
  dateOrder: '' | 'DMY' | 'MDY' | 'YMD';
  sample: string;
}

interface TemplateMappingFormProps {
  group: SkeletonGroup;
  form: TemplateMappingValues;
  errors: string[];
  saving: boolean;
  onChange: (patch: Partial<TemplateMappingValues>) => void;
  onFieldChange: (index: number, field: TemplateField) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Maps each placeholder of a shape to a field and creates a draft template. The server compiles
 * it and refuses it unless it matches the sample message.
 */
export function TemplateMappingForm({
  group,
  form,
  errors,
  saving,
  onChange,
  onFieldChange,
  onSubmit,
  onCancel,
}: TemplateMappingFormProps) {
  const placeholders = skeletonPlaceholders(group.skeleton);
  return (
    <div className={detectionStyles.card}>
      <h3 className={detectionStyles.cardTitle}>Map shape to a template</h3>
      <div className={detectionStyles.skeleton}>{group.skeleton}</div>

      <div className={detectionStyles.formRow}>
        <label className={detectionStyles.field}>
          <span>Template id</span>
          <input className={detectionStyles.input} value={form.id} onChange={(e) => onChange({ id: e.target.value })} />
        </label>
        <label className={detectionStyles.field}>
          <span>Institution</span>
          <input
            className={detectionStyles.input}
            value={form.institutionId}
            onChange={(e) => onChange({ institutionId: e.target.value })}
          />
        </label>
        <label className={detectionStyles.field}>
          <span>Language</span>
          <input className={detectionStyles.input} value={form.language} onChange={(e) => onChange({ language: e.target.value })} />
        </label>
      </div>

      <div className={detectionStyles.formRow}>
        <label className={detectionStyles.field}>
          <span>Direction</span>
          <select
            className={detectionStyles.select}
            value={form.direction}
            onChange={(e) => onChange({ direction: e.target.value as 'DEBIT' | 'CREDIT' })}
          >
            <option value="DEBIT">DEBIT</option>
            <option value="CREDIT">CREDIT</option>
          </select>
        </label>
        <label className={detectionStyles.field}>
          <span>Type</span>
          <select
            className={detectionStyles.select}
            value={form.transactionType}
            onChange={(e) => onChange({ transactionType: e.target.value })}
          >
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className={detectionStyles.field}>
          <span>Payment method</span>
          <select
            className={detectionStyles.select}
            value={form.paymentMethod}
            onChange={(e) => onChange({ paymentMethod: e.target.value })}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method || 'none'} value={method}>
                {method || '—'}
              </option>
            ))}
          </select>
        </label>
        <label className={detectionStyles.field}>
          <span>Date order</span>
          <select
            className={detectionStyles.select}
            value={form.dateOrder}
            onChange={(e) => onChange({ dateOrder: e.target.value as TemplateMappingValues['dateOrder'] })}
          >
            <option value="">Pack default</option>
            <option value="DMY">DMY</option>
            <option value="MDY">MDY</option>
            <option value="YMD">YMD</option>
          </select>
        </label>
      </div>

      <div className={detectionStyles.list}>
        <span className={detectionStyles.statLabel}>Fields</span>
        {/* One select per placeholder; a skeleton has a handful, fixed by its text. */}
        {placeholders.map((placeholder, index) => (
          <div key={`${placeholder}-${index}`} className={detectionStyles.mappingRow}>
            <span className={detectionStyles.placeholder}>
              {index + 1}. &lt;{placeholder}&gt;
            </span>
            <select
              className={detectionStyles.select}
              value={form.fields[index] ?? 'ignore'}
              onChange={(e) => onFieldChange(index, e.target.value as TemplateField)}
            >
              {TEMPLATE_FIELDS.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <label className={detectionStyles.field}>
        <span>Sample message (from the bank&apos;s public examples or a test account; stored with the template)</span>
        <textarea className={detectionStyles.textareaSm} value={form.sample} onChange={(e) => onChange({ sample: e.target.value })} />
      </label>

      {errors.length > 0 && (
        <ul className={detectionStyles.cardHint}>
          {errors.map((error) => (
            <li key={error}>• {error}</li>
          ))}
        </ul>
      )}

      <div className={detectionStyles.headerActions}>
        <button type="button" className={detectionStyles.btnPrimary} onClick={onSubmit} disabled={saving || errors.length > 0}>
          {saving ? 'Creating…' : 'Create draft template'}
        </button>
        <button type="button" className={detectionStyles.btn} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}
