'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { createKillSwitch, listKillSwitches, setKillSwitchActive } from '../api/detection.api';
import type { KillSwitch, KillSwitchInput } from '../types/detection.types';

const EMPTY_FORM: KillSwitchInput = { scope: 'institution', key: '', action: 'disable_auto_create', reason: '' };

/** Kill-switch console (T4.6, T7.3). Every change needs a reason and is audited server-side. */
export function useKillSwitches() {
  const { data, error, loading, refreshing, reload } = useCachedResource<KillSwitch[]>(
    'detection-kill-switches',
    listKillSwitches,
    { cache: false }
  );
  const [form, setForm] = useState<KillSwitchInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const act = async (action: () => Promise<unknown>) => {
    setSaving(true);
    setActionError('');
    try {
      await action();
      await reload();
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Request failed');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    if (form.key.trim().length === 0 || form.reason.trim().length < 3) {
      setActionError('A key and a reason (3+ characters) are required.');
      return;
    }
    if (await act(() => createKillSwitch({ ...form, key: form.key.trim(), reason: form.reason.trim() }))) setForm(EMPTY_FORM);
  };

  const toggle = (ks: KillSwitch) => {
    const reason = window.prompt(`${ks.active ? 'Deactivate' : 'Reactivate'} ${ks.scope} "${ks.key}". Reason:`);
    if (reason === null) return;
    if (reason.trim().length < 3) {
      setActionError('A reason of 3+ characters is required.');
      return;
    }
    void act(() => setKillSwitchActive(ks.id, !ks.active, reason.trim()));
  };

  return {
    switches: data ?? [],
    error,
    loading,
    refreshing,
    reload,
    form,
    setForm,
    saving,
    actionError,
    submit,
    toggle,
  };
}
