import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  NEXT_STATUSES,
  cellText,
  defaultTemplateFields,
  editableData,
  formatRate,
  nextRolloutStage,
  parseDataJson,
  rolloutStageOf,
  skeletonPlaceholders,
  suggestTemplateId,
  templateMappingErrors,
} from '../templateMapping';

const SKELETON = 'Rs.<AMT> debited from a/c <ACCT> on <DATE> to VPA <VPA> Ref <REF>. Avl Bal Rs <AMT>';

describe('template mapping (T7.4)', () => {
  it('lists the placeholders in order', () => {
    assert.deepEqual(skeletonPlaceholders(SKELETON), ['AMT', 'ACCT', 'DATE', 'VPA', 'REF', 'AMT']);
  });

  it('suggests one field per placeholder, with the later amount after "Bal" as the balance', () => {
    assert.deepEqual(defaultTemplateFields(SKELETON), ['amount', 'account', 'date', 'counterparty', 'reference', 'balance']);
    assert.deepEqual(defaultTemplateFields('INR <AMT> spent at <NAME>. Limit <AMT>. Call <NUM>'), [
      'amount',
      'merchant',
      'limit',
      'ignore',
    ]);
  });

  it('reports what the server would reject', () => {
    assert.deepEqual(templateMappingErrors(SKELETON, defaultTemplateFields(SKELETON), 'Rs.10 debited from a/c xx1234'), []);
    assert.deepEqual(templateMappingErrors('Rs.<AMT> at <NAME>', ['merchant'], ''), [
      'The skeleton has 2 placeholders but 1 fields are mapped.',
      'Map one placeholder to the amount.',
      'Paste a sample message the template must match.',
    ]);
    assert.deepEqual(templateMappingErrors('<AMT> <AMT>', ['amount', 'amount'], 'sample text'), [
      'Only one placeholder can be the amount.',
    ]);
  });

  it('suggests a template id from the institution and hash', () => {
    assert.equal(suggestTemplateId('in.hdfc_bank', 'abcdef0123456789'), 'in.hdfc_bank.learned_abcdef01');
    assert.equal(suggestTemplateId(null, 'abcdef0123456789'), 'unknown.learned_abcdef01');
  });
});

describe('catalog helpers (T7.3)', () => {
  it('matches the server status moves', () => {
    assert.deepEqual(NEXT_STATUSES.published, ['draft']);
    assert.deepEqual(NEXT_STATUSES.draft, ['review', 'published']);
  });

  it('keeps only the editable fields of a row', () => {
    const row = { id: 'x', status: 'draft', version: 2, source: 'admin', createdAt: 'a', updatedAt: 'b', name: 'HDFC', country: 'IN' };
    assert.deepEqual(editableData(row), { name: 'HDFC', country: 'IN' });
  });

  it('parses the JSON editor text into an object or an error', () => {
    assert.deepEqual(parseDataJson('{"name":"A"}'), { data: { name: 'A' } });
    assert.deepEqual(parseDataJson('[1]'), { error: 'The data must be a JSON object.' });
    assert.ok('error' in parseDataJson('{nope'));
  });

  it('formats cells and rates', () => {
    assert.equal(cellText(null), '—');
    assert.equal(cellText(['a', 'b']), '["a","b"]');
    assert.equal(cellText('x'.repeat(90)), `${'x'.repeat(80)}…`);
    assert.equal(formatRate(0.1234), '12.3%');
    assert.equal(formatRate(0), '0.0%');
  });
});

describe('rollout stages (T9.3)', () => {
  it('names the stage a row is at and the next one in the plan', () => {
    assert.equal(rolloutStageOf({ percent: 0, includeInternal: true }), 'internal');
    assert.equal(rolloutStageOf({ percent: 0, includeInternal: false }), 'off');
    assert.equal(rolloutStageOf({ percent: 25, includeInternal: true }), 'pct25');
    assert.equal(rolloutStageOf({ percent: 40, includeInternal: true }), 'custom');
    assert.equal(nextRolloutStage('internal'), 'pct5');
    assert.equal(nextRolloutStage('pct25'), 'all');
    assert.equal(nextRolloutStage('all'), null);
    assert.equal(nextRolloutStage('off'), null);
  });
});
