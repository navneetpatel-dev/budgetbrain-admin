'use client';

import { useDetectionDashboard } from '../hooks/useDetectionDashboard.hook';
import { DetectionTabs } from '../components/DetectionTabs.component';
import { StatCard } from '../components/StatCard.component';
import { CountTable } from '../components/CountTable.component';
import { InstitutionTable } from '../components/InstitutionTable.component';
import { DailySeriesTable } from '../components/DailySeriesTable.component';
import { ErrorState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { formatRate } from '../utils/templateMapping';
import { detectionStyles } from '../styles/detection.styles';

export function DetectionDashboardPage() {
  const {
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
    runRollup,
    buildPacks,
  } = useDetectionDashboard();

  return (
    <div className={detectionStyles.view}>
      <div className={detectionStyles.header}>
        <div className={detectionStyles.headerLeft}>
          <h2 className={detectionStyles.title}>Transaction Detection</h2>
          <p className={detectionStyles.subtitle}>
            {data ? `${data.range.from} to ${data.range.to} · from the hourly rollup` : 'Detection quality and adoption'}
          </p>
        </div>
        <div className={detectionStyles.headerActions}>
          <button type="button" className={detectionStyles.btn} onClick={() => void runRollup()} disabled={busy !== ''}>
            {busy === 'rollup' ? 'Rolling up…' : 'Roll up now'}
          </button>
          <button type="button" className={detectionStyles.btn} onClick={() => void buildPacks()} disabled={busy !== ''}>
            {busy === 'packs' ? 'Building…' : 'Build packs'}
          </button>
          <button type="button" className={detectionStyles.btn} onClick={() => void reload()} disabled={loading || refreshing}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <DetectionTabs />

      <div className={detectionStyles.filterCard}>
        <div className={detectionStyles.formRow}>
          <label className={detectionStyles.field}>
            <span>From</span>
            <input type="date" className={detectionStyles.input} value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className={detectionStyles.field}>
            <span>To</span>
            <input type="date" className={detectionStyles.input} value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <span className={detectionStyles.cardHint}>Defaults to the last 30 days.</span>
        </div>
      </div>

      {message && <div className={detectionStyles.successBanner}>{message}</div>}
      {actionError && <div className={detectionStyles.errorBanner}>{actionError}</div>}

      {loading && !data && <AdminTableSkeleton rows={6} columns={4} />}
      {!loading && error && !data && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <>
          <div className={detectionStyles.statGrid}>
            <StatCard label="Detected" value={data.total.toLocaleString()} />
            <StatCard label="Auto-added" value={formatRate(data.rates.autoApproved)} />
            <StatCard label="Sent to review" value={formatRate(data.rates.review)} />
            <StatCard label="Confirmed" value={formatRate(data.rates.confirmed)} />
            <StatCard label="Rejected" value={formatRate(data.rates.rejected)} hint="Correction signal" />
            <StatCard label="Undone" value={formatRate(data.rates.undone)} hint="Auto-added, then undone" />
            <StatCard label="Duplicates" value={formatRate(data.rates.duplicate)} />
            <StatCard
              label="Active users (30 d)"
              value={data.adoption.activeUsers30d.toLocaleString()}
              hint={`${data.adoption.templateLearningUsers} template learning · ${data.adoption.reviewAllUsers} review all`}
            />
          </div>

          <div className={detectionStyles.grid2}>
            <CountTable
              title="By source"
              labelHeader="Source"
              rows={data.bySource.map((r) => ({ label: r.source, count: r.count }))}
            />
            <CountTable
              title="By country"
              labelHeader="Country"
              rows={data.byCountry.map((r) => ({ label: r.country ?? 'Unknown', count: r.count }))}
            />
          </div>
          <InstitutionTable rows={data.byInstitution} />
          <DailySeriesTable series={data.series} />
        </>
      )}
    </div>
  );
}

export default DetectionDashboardPage;
