import type { CatalogEntity, CatalogStatus, TemplateField } from '../types/detection.types';

/**
 * Pure helpers for the detection admin pages (T7.3, T7.4). The server checks everything again;
 * these only give the form a sensible starting point and early feedback.
 */

const PLACEHOLDER = /<([A-Z]+)>/g;

/** What each skeleton placeholder most likely maps to; `ignore` for the rest. */
const DEFAULT_FIELD: Record<string, TemplateField> = {
  AMT: 'amount',
  ACCT: 'account',
  DATE: 'date',
  TIME: 'time',
  REF: 'reference',
  VPA: 'counterparty',
  NAME: 'merchant',
  NUM: 'ignore',
  TEXT: 'ignore',
};

/** The placeholders of a skeleton, in order (`<AMT>`, `<ACCT>` …). */
export function skeletonPlaceholders(skeleton: string): string[] {
  return [...skeleton.matchAll(PLACEHOLDER)].map((m) => m[1]);
}

/**
 * A first field map for a skeleton: one field per placeholder. The first `<AMT>` is the amount
 * and a later one after "bal" is the balance, which is how bank messages are written.
 */
export function defaultTemplateFields(skeleton: string): TemplateField[] {
  const fields: TemplateField[] = [];
  let seenAmount = false;
  let at = 0;
  for (const match of skeleton.matchAll(PLACEHOLDER)) {
    const before = skeleton.slice(at, match.index).toLowerCase();
    at = (match.index ?? 0) + match[0].length;
    const name = match[1];
    if (name === 'AMT') {
      if (!seenAmount) {
        fields.push('amount');
        seenAmount = true;
      } else if (/\b(?:bal|balance)\b/.test(before)) {
        fields.push('balance');
      } else if (/\blimit\b/.test(before)) {
        fields.push('limit');
      } else {
        fields.push('ignore');
      }
      continue;
    }
    fields.push(DEFAULT_FIELD[name] ?? 'ignore');
  }
  return fields;
}

/** Problems the server would reject, found before the request. Empty when the mapping is usable. */
export function templateMappingErrors(skeleton: string, fields: TemplateField[], sample: string): string[] {
  const errors: string[] = [];
  const count = skeletonPlaceholders(skeleton).length;
  if (fields.length !== count) errors.push(`The skeleton has ${count} placeholders but ${fields.length} fields are mapped.`);
  if (!fields.includes('amount')) errors.push('Map one placeholder to the amount.');
  if (fields.filter((f) => f === 'amount').length > 1) errors.push('Only one placeholder can be the amount.');
  if (sample.trim().length < 5) errors.push('Paste a sample message the template must match.');
  return errors;
}

/** A template id suggestion: `<institution>.learned_<first 8 of the hash>`. */
export function suggestTemplateId(institutionId: string | null, hash: string): string {
  return `${institutionId ?? 'unknown'}.learned_${hash.slice(0, 8)}`;
}

/** Status moves the server allows (catalog.service NEXT). */
export const NEXT_STATUSES: Record<CatalogStatus, CatalogStatus[]> = {
  draft: ['review', 'published'],
  review: ['draft', 'published'],
  published: ['draft'],
};

/** Columns shown in the catalog table per entity, after the id. */
export const CATALOG_COLUMNS: Record<CatalogEntity, string[]> = {
  institutions: ['displayName', 'country', 'type'],
  senders: ['key', 'institutionId', 'channel', 'country'],
  lexicons: ['language', 'class'],
  templates: ['institutionId', 'skeleton'],
  merchants: ['name', 'taxonomyCode', 'country'],
  aliases: ['alias', 'merchantId', 'country'],
  mcc: ['taxonomyCode', 'description'],
  taxonomy: ['name', 'parent'],
};

/** An empty `data` object to start a new row from, per entity. */
export const CATALOG_NEW_ROW: Record<CatalogEntity, { id?: string; data: Record<string, unknown> }> = {
  institutions: { id: '', data: { name: '', displayName: '', country: '', type: 'bank' } },
  senders: { data: { institutionId: '', country: '', channel: 'sms', match: 'header', key: '' } },
  lexicons: { data: { language: 'en', class: 'debit_verbs', phrases: [] } },
  templates: {
    id: '',
    data: {
      institutionId: '',
      language: 'en',
      skeleton: '',
      fields: [],
      direction: 'DEBIT',
      transactionType: 'expense',
      sample: '',
    },
  },
  merchants: { id: '', data: { name: '', taxonomyCode: '' } },
  aliases: { data: { merchantId: '', alias: '', country: '' } },
  mcc: { id: '', data: { taxonomyCode: '', description: '' } },
  taxonomy: { id: '', data: { name: '', parent: null } },
};

const ROW_META = new Set(['id', 'status', 'version', 'source', 'createdAt', 'updatedAt']);

/** The editable part of a row: everything but id, status, version, source and timestamps. */
export function editableData(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row).filter(([key]) => !ROW_META.has(key)));
}

/** Parses the JSON editor's text into a data object, or returns why it can't. */
export function parseDataJson(text: string): { data: Record<string, unknown> } | { error: string } {
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'The data must be a JSON object.' };
    return { data: value as Record<string, unknown> };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Invalid JSON' };
  }
}

/** A table cell for any catalog value. */
export function cellText(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string') return value.length > 80 ? `${value.slice(0, 80)}…` : value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

/** 0.123 → "12.3%". */
export function formatRate(rate: number): string {
  return `${(Math.round(rate * 1000) / 10).toFixed(1)}%`;
}
