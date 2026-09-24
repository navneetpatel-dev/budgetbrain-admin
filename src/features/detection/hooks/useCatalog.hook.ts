'use client';

import { useCallback, useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue.hook';
import {
  createCatalogRow,
  getCatalogHistory,
  listCatalog,
  setCatalogStatus,
  updateCatalogRow,
} from '../api/detection.api';
import { CATALOG_NEW_ROW, editableData, parseDataJson } from '../utils/templateMapping';
import type { CatalogEntity, CatalogHistoryEntry, CatalogList, CatalogRow, CatalogStatus } from '../types/detection.types';

const LIMIT = 25;

/**
 * Knowledge-base catalog (T7.3): list, search and filter one entity; edit a row as JSON (an edit
 * returns it to draft with a new version); move it draft → review → published; see its history.
 */
export function useCatalog() {
  const [entity, setEntityState] = useState<CatalogEntity>('institutions');
  const [status, setStatusFilter] = useState<'' | CatalogStatus>('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQ = useDebouncedValue(q, 300);

  const [selected, setSelected] = useState<CatalogRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [draftId, setDraftId] = useState('');
  const [draftJson, setDraftJson] = useState('');
  const [history, setHistory] = useState<CatalogHistoryEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const { data, error, loading, refreshing, reload } = useCachedResource<CatalogList>(
    `detection-catalog:${entity}:${status}:${debouncedQ}:${page}`,
    () => listCatalog(entity, { status, q: debouncedQ, page, limit: LIMIT }),
    { cache: false }
  );

  const closeEditor = () => {
    setSelected(null);
    setCreating(false);
    setHistory([]);
    setActionError('');
  };

  const setEntity = (next: CatalogEntity) => {
    setEntityState(next);
    setPage(1);
    closeEditor();
  };

  const select = useCallback(
    async (row: CatalogRow) => {
      setSelected(row);
      setCreating(false);
      setActionError('');
      setDraftJson(JSON.stringify(editableData(row), null, 2));
      try {
        setHistory(await getCatalogHistory(entity, row.id));
      } catch {
        setHistory([]);
      }
    },
    [entity]
  );

  const startCreate = () => {
    const blank = CATALOG_NEW_ROW[entity];
    setSelected(null);
    setCreating(true);
    setHistory([]);
    setActionError('');
    setDraftId(blank.id ?? '');
    setDraftJson(JSON.stringify(blank.data, null, 2));
  };

  const withSave = async (action: () => Promise<CatalogRow>) => {
    setSaving(true);
    setActionError('');
    try {
      const row = await action();
      await reload();
      await select(row);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    const parsed = parseDataJson(draftJson);
    if ('error' in parsed) {
      setActionError(parsed.error);
      return;
    }
    if (creating) {
      const hasId = CATALOG_NEW_ROW[entity].id !== undefined;
      void withSave(() => createCatalogRow(entity, hasId ? { id: draftId.trim(), data: parsed.data } : { data: parsed.data }));
    } else if (selected) {
      void withSave(() => updateCatalogRow(entity, selected.id, parsed.data));
    }
  };

  const moveTo = (next: CatalogStatus) => {
    if (selected) void withSave(() => setCatalogStatus(entity, selected.id, next));
  };

  return {
    entity,
    setEntity,
    status,
    setStatus: (next: '' | CatalogStatus) => {
      setStatusFilter(next);
      setPage(1);
    },
    q,
    setQ: (next: string) => {
      setQ(next);
      setPage(1);
    },
    page,
    setPage,
    limit: LIMIT,
    items: data?.items ?? [],
    total: data?.total ?? 0,
    error,
    loading,
    refreshing,
    reload,
    selected,
    creating,
    draftId,
    setDraftId,
    draftJson,
    setDraftJson,
    history,
    saving,
    actionError,
    select,
    startCreate,
    closeEditor,
    save,
    moveTo,
  };
}
