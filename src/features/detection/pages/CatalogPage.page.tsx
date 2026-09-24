'use client';

import { useCatalog } from '../hooks/useCatalog.hook';
import { DetectionTabs } from '../components/DetectionTabs.component';
import { CatalogTable } from '../components/CatalogTable.component';
import { CatalogEditor } from '../components/CatalogEditor.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates.component';
import { AdminTableSkeleton } from '@/shared/components/Skeleton.component';
import { CATALOG_NEW_ROW } from '../utils/templateMapping';
import { CATALOG_ENTITIES, type CatalogEntity, type CatalogStatus } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

export function CatalogPage() {
  const catalog = useCatalog();
  const editorOpen = catalog.creating || catalog.selected !== null;

  return (
    <div className={detectionStyles.view}>
      <div className={detectionStyles.header}>
        <div className={detectionStyles.headerLeft}>
          <h2 className={detectionStyles.title}>Knowledge Base Catalog</h2>
          <p className={detectionStyles.subtitle}>
            Edits land as drafts; only published rows go into the next pack build.
          </p>
        </div>
        <div className={detectionStyles.headerActions}>
          <button type="button" className={detectionStyles.btnPrimary} onClick={catalog.startCreate}>
            + New row
          </button>
          <button
            type="button"
            className={detectionStyles.btn}
            onClick={() => void catalog.reload()}
            disabled={catalog.loading || catalog.refreshing}
          >
            {catalog.refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <DetectionTabs />

      <div className={detectionStyles.filterCard}>
        <div className={detectionStyles.formRow}>
          <label className={detectionStyles.field}>
            <span>Entity</span>
            <select
              className={detectionStyles.select}
              value={catalog.entity}
              onChange={(e) => catalog.setEntity(e.target.value as CatalogEntity)}
            >
              {CATALOG_ENTITIES.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>
          </label>
          <label className={detectionStyles.field}>
            <span>Status</span>
            <select
              className={detectionStyles.select}
              value={catalog.status}
              onChange={(e) => catalog.setStatus(e.target.value as '' | CatalogStatus)}
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className={detectionStyles.field}>
            <span>Search</span>
            <input
              className={detectionStyles.input}
              value={catalog.q}
              placeholder="id or name"
              onChange={(e) => catalog.setQ(e.target.value)}
            />
          </label>
        </div>
      </div>

      {editorOpen && (
        <CatalogEditor
          row={catalog.selected}
          creating={catalog.creating}
          hasProvidedId={CATALOG_NEW_ROW[catalog.entity].id !== undefined}
          draftId={catalog.draftId}
          draftJson={catalog.draftJson}
          history={catalog.history}
          saving={catalog.saving}
          error={catalog.actionError}
          onDraftIdChange={catalog.setDraftId}
          onDraftJsonChange={catalog.setDraftJson}
          onSave={catalog.save}
          onMove={catalog.moveTo}
          onClose={catalog.closeEditor}
        />
      )}

      {catalog.loading && <AdminTableSkeleton rows={8} columns={6} />}
      {!catalog.loading && catalog.error && <ErrorState message={catalog.error} onRetry={catalog.reload} />}
      {!catalog.loading && !catalog.error && catalog.items.length === 0 && <EmptyState message="No rows match." />}
      {!catalog.loading && !catalog.error && catalog.items.length > 0 && (
        <CatalogTable
          entity={catalog.entity}
          items={catalog.items}
          total={catalog.total}
          page={catalog.page}
          limit={catalog.limit}
          refreshing={catalog.refreshing}
          selectedId={catalog.selected?.id ?? null}
          onSelect={(row) => void catalog.select(row)}
          onPageChange={catalog.setPage}
        />
      )}
    </div>
  );
}

export default CatalogPage;
