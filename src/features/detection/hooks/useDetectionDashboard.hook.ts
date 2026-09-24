'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { buildKnowledgePacks, getDetectionDashboard, runDetectionRollup } from '../api/detection.api';
import type { DetectionDashboard } from '../types/detection.types';

/** Detection dashboard (T7.3): rollup figures for a date range, plus "roll up now" and "build packs". */
export function useDetectionDashboard() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState<'' | 'rollup' | 'packs'>('');
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const { data, error, loading, refreshing, reload } = useCachedResource<DetectionDashboard>(
    `detection-dashboard:${from}:${to}`,
    () => getDetectionDashboard({ from: from || undefined, to: to || undefined })
  );

  const run = async (kind: 'rollup' | 'packs') => {
    setBusy(kind);
    setMessage('');
    setActionError('');
    try {
      if (kind === 'rollup') {
        const result = await runDetectionRollup();
        setMessage(`Rolled up ${result.days} day(s).`);
        await reload();
      } else {
        const packs = await buildKnowledgePacks();
        setMessage(`Built ${packs.length} pack(s): ${packs.map((p) => p.country).join(', ') || 'none'}.`);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setBusy('');
    }
  };

  return {
    data,
    error,
    loading,
    refreshing,
    reload,
    from,
    to,
    setFrom,
    setTo,
    busy,
    message,
    actionError,
    runRollup: () => run('rollup'),
    buildPacks: () => run('packs'),
  };
}
