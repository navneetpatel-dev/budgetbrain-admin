'use client';

import { useKillSwitches } from '../hooks/useKillSwitches.hook';
import { DetectionTabs } from '../components/DetectionTabs.component';
import { KillSwitchForm } from '../components/KillSwitchForm.component';
import { KillSwitchTable } from '../components/KillSwitchTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { detectionStyles } from '../styles/detection.styles';

export function KillSwitchesPage() {
  const { switches, error, loading, refreshing, reload, form, setForm, saving, actionError, submit, toggle } = useKillSwitches();
  const activeCount = switches.filter((ks) => ks.active).length;

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
