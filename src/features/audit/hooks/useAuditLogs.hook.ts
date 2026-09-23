'use client';

import { useCallback, useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import { getAuditLogs } from '../api/audit.api';
import type {
  AuditLogsResponse,
  AuditSource,
  AuditOutcome,
  AuditSeverity,
} from '../types/audit.types';

export function useAuditLogs(limit = 10) {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState<'' | AuditSource>('');
  const [outcome, setOutcome] = useState<'' | AuditOutcome>('');
  const [severity, setSeverity] = useState<'' | AuditSeverity>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cacheKey = `audit-logs:${page}:${source}:${outcome}:${severity}`;
  const { data, error, loading, refreshing, reload } = useCachedResource<AuditLogsResponse>(
    cacheKey,
    () => getAuditLogs({ page, limit, source, outcome, severity }),
    { cache: false }
  );

  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;

  const handleSourceChange = (newSource: '' | AuditSource) => {
    setPage(1);
    setSource(newSource);
  };

  const handleOutcomeChange = (newOutcome: '' | AuditOutcome) => {
    setPage(1);
    setOutcome(newOutcome);
  };

  const handleSeverityChange = (newSeverity: '' | AuditSeverity) => {
    setPage(1);
    setSeverity(newSeverity);
  };

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return {
    logs,
    total,
    page,
    limit,
    setPage,
    source,
    outcome,
    severity,
    expandedId,
    setSource: handleSourceChange,
    setOutcome: handleOutcomeChange,
    setSeverity: handleSeverityChange,
    toggleExpanded,
    error,
    loading,
    refreshing,
    reload,
  };
}
