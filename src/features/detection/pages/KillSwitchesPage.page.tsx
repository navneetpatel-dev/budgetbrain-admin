'use client';

import { useKillSwitches } from '../hooks/useKillSwitches.hook';
import { useRollout } from '../hooks/useRollout.hook';
import { RolloutTable } from '../components/RolloutTable.component';
import { DetectionTabs } from '../components/DetectionTabs.component';
import { KillSwitchForm } from '../components/KillSwitchForm.component';
import { KillSwitchTable } from '../components/KillSwitchTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { detectionStyles } from '../styles/detection.styles';

export function KillSwitchesPage() {
  const { switches, error, loading, refreshing, reload, form, setForm, saving, actionError, submit, toggle } = useKillSwitches();
  const activeCount = switches.filter((ks) => ks.active).length;
  const rollout = useRollout();

  return (
    <div className={detectionStyles.view}>
      <div className={detectionStyles.header}>
        <div className={detectionStyles.headerLeft}>
          <h2 className={detectionStyles.title}>Kill Switches</h2>
          <p className={detectionStyles.subtitle}>{activeCount} active · every change is audited</p>
        </div>
        <button type="button" className={detectionStyles.btn} onClick={() => void reload()} disabled={loading || refreshing}>
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      <DetectionTabs />

      <div className={detectionStyles.card}>
        <h3 className={detectionStyles.cardTitle}>Staged rollout</h3>
        <p className={detectionStyles.cardHint}>
          Automatic detection per country: internal (admins) → 5 % → 25 % → 100 %. Users keep their bucket as
          the percentage grows. Countries without a row use the default row; with no rows at all, everyone has
          it. Watch correction and undo rates on the Overview before each step. Paste and import are never gated.
        </p>
        {rollout.actionError && <div className={detectionStyles.errorBanner}>{rollout.actionError}</div>}
        {rollout.error && <ErrorState message={rollout.error} onRetry={rollout.reload} />}
        {!rollout.error && rollout.rows.length === 0 && !rollout.loading && (
          <p className={detectionStyles.cardHint}>No rollout rows: automatic detection is on for everyone.</p>
        )}
        {rollout.rows.length > 0 && (
          <RolloutTable rows={rollout.rows} saving={rollout.saving} onMove={rollout.moveTo} onRemove={rollout.remove} />
        )}
        <div className={detectionStyles.formRow}>
          <label className={detectionStyles.field}>
            <span>Country</span>
            <input
              className={detectionStyles.input}
              value={rollout.country}
              placeholder="IN"
              maxLength={2}
              onChange={(e) => rollout.setCountry(e.target.value)}
            />
          </label>
          <button type="button" className={detectionStyles.btn} onClick={rollout.addCountry} disabled={rollout.saving}>
            Add at internal stage
          </button>
          {!rollout.hasDefault && (
            <button type="button" className={detectionStyles.btn} onClick={rollout.addDefault} disabled={rollout.saving}>
              Add default row
            </button>
          )}
        </div>
      </div>

      {actionError && <div className={detectionStyles.errorBanner}>{actionError}</div>}
      <KillSwitchForm form={form} saving={saving} onChange={setForm} onSubmit={() => void submit()} />

      {loading && <AdminTableSkeleton rows={4} columns={7} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && switches.length === 0 && <EmptyState message="No kill switches yet." />}
      {!loading && !error && switches.length > 0 && <KillSwitchTable switches={switches} saving={saving} onToggle={toggle} />}
    </div>
  );
}

export default KillSwitchesPage;
