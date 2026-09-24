'use client';

import { useLearningQueues } from '../hooks/useLearningQueues.hook';
import { DetectionTabs } from '../components/DetectionTabs.component';
import { SkeletonQueueTable } from '../components/SkeletonQueueTable.component';
import { TemplateMappingForm } from '../components/TemplateMappingForm.component';
import { AliasCandidatesTable } from '../components/AliasCandidatesTable.component';
import { AliasPromoteForm } from '../components/AliasPromoteForm.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { detectionStyles } from '../styles/detection.styles';

export function LearningPage() {
  const q = useLearningQueues();
  const groups = q.skeletons.data ?? [];
  const candidates = q.aliases.data ?? [];

  return (
    <div className={detectionStyles.view}>
      <div className={detectionStyles.header}>
        <div className={detectionStyles.headerLeft}>
          <h2 className={detectionStyles.title}>Learning Queues</h2>
          <p className={detectionStyles.subtitle}>
            Only shapes and merchant names reported by enough distinct users appear here.
          </p>
        </div>
        <button
          type="button"
          className={detectionStyles.btn}
          onClick={() => {
            void q.skeletons.reload();
            void q.aliases.reload();
          }}
          disabled={q.skeletons.refreshing || q.aliases.refreshing}
        >
          ↻ Refresh
        </button>
      </div>

      <DetectionTabs />
      {q.message && <div className={detectionStyles.successBanner}>{q.message}</div>}
      {q.actionError && <div className={detectionStyles.errorBanner}>{q.actionError}</div>}

      <h3 className={detectionStyles.cardTitle}>Unrecognised message shapes</h3>
      {q.mapping && (
        <TemplateMappingForm
          group={q.mapping.group}
          form={q.mapping.form}
          errors={q.mappingErrors}
          saving={q.saving}
          onChange={q.updateMapping}
          onFieldChange={q.setField}
          onSubmit={() => void q.submitMapping()}
          onCancel={q.cancelMapping}
        />
      )}
      {q.skeletons.loading && <AdminTableSkeleton rows={4} columns={5} />}
      {!q.skeletons.loading && q.skeletons.error && <ErrorState message={q.skeletons.error} onRetry={q.skeletons.reload} />}
      {!q.skeletons.loading && !q.skeletons.error && groups.length === 0 && <EmptyState message="No shapes above the threshold." />}
      {!q.skeletons.loading && !q.skeletons.error && groups.length > 0 && (
        <SkeletonQueueTable groups={groups} saving={q.saving} onMap={q.startMapping} onDismiss={(g) => void q.dismiss(g)} />
      )}

      <h3 className={detectionStyles.cardTitle}>Merchant alias candidates</h3>
      {q.promote && (
        <AliasPromoteForm
          candidate={q.promote.candidate}
          merchantId={q.promote.merchantId}
          country={q.promote.country}
          saving={q.saving}
          onChange={q.updatePromote}
          onSubmit={() => void q.submitPromote()}
          onCancel={q.cancelPromote}
        />
      )}
      {q.aliases.loading && <AdminTableSkeleton rows={4} columns={4} />}
      {!q.aliases.loading && q.aliases.error && <ErrorState message={q.aliases.error} onRetry={q.aliases.reload} />}
      {!q.aliases.loading && !q.aliases.error && candidates.length === 0 && <EmptyState message="No candidates above the threshold." />}
      {!q.aliases.loading && !q.aliases.error && candidates.length > 0 && (
        <AliasCandidatesTable candidates={candidates} saving={q.saving} onPromote={q.startPromote} />
      )}
    </div>
  );
}

export default LearningPage;
