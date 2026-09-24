'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { deleteRollout, listRollout, setRollout } from '../api/detection.api';
import { ROLLOUT_STAGES, type RolloutStageId } from '../utils/templateMapping';
import type { RolloutRow } from '../types/detection.types';

/**
 * Staged rollout console (plan T9.3): one row per country plus the default. Every change asks
 * for confirmation and is audited server-side; devices pick it up with their next config fetch.
 */
export function useRollout() {
  const { data, error, loading, refreshing, reload } = useCachedResource<RolloutRow[]>('detection-rollout', listRollout, {
    cache: false,
  });
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const act = async (action: () => Promise<unknown>) => {
    setSaving(true);
    setActionError('');
    try {
      await action();
      await reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const moveTo = (rowCountry: string, stageId: RolloutStageId) => {
    const stage = ROLLOUT_STAGES.find((s) => s.id === stageId);
    if (!stage) return;
    const name = rowCountry || 'the default';
    if (!window.confirm(`Set ${name} to ${stage.label}? Devices apply it within minutes.`)) return;
    void act(() => setRollout(rowCountry, { percent: stage.percent, includeInternal: stage.includeInternal }));
  };

  const addCountry = () => {
    const code = country.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) {
      setActionError('Use a two-letter country code, e.g. IN.');
      return;
    }
    // A new country starts at the internal stage.
    void act(async () => {
      await setRollout(code, { percent: 0, includeInternal: true });
      setCountry('');
    });
  };

  const addDefault = () => {
    if (!window.confirm('Add a default row at the internal stage? Users in countries without a row lose automatic detection.')) return;
    void act(() => setRollout('', { percent: 0, includeInternal: true }));
  };

  const remove = (rowCountry: string) => {
    if (!window.confirm(`Remove the row for ${rowCountry || 'the default'}? Its users fall back to the default row (or 100 % if none).`)) return;
    void act(() => deleteRollout(rowCountry));
  };

  const rows = data ?? [];
  return {
    rows,
    hasDefault: rows.some((r) => r.country === ''),
    error,
    loading,
    refreshing,
    reload,
    country,
    setCountry,
    saving,
    actionError,
    moveTo,
    addCountry,
    addDefault,
    remove,
  };
}
