import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/shared/api/admin.api';
import type {
  AliasCandidate,
  CatalogEntity,
  CatalogHistoryEntry,
  CatalogList,
  CatalogRow,
  CatalogStatus,
  DeletionRequest,
  DetectionDashboard,
  KillSwitch,
  KillSwitchInput,
  PackBuildResult,
  RolloutRow,
  SkeletonGroup,
  TemplateFromSkeletonInput,
  UserDetection,
} from '../types/detection.types';

const BASE = '/admin/detection';

export function getDetectionDashboard(range: { from?: string; to?: string } = {}) {
  const query = new URLSearchParams();
  if (range.from) query.set('from', range.from);
  if (range.to) query.set('to', range.to);
  const qs = query.toString();
  return apiGet<DetectionDashboard>(`${BASE}/dashboard${qs ? `?${qs}` : ''}`);
}

export function runDetectionRollup() {
  return apiPost<{ days: number }>(`${BASE}/rollup`, {});
}

export function buildKnowledgePacks(country?: string) {
  return apiPost<PackBuildResult[]>(`${BASE}/packs/build`, country ? { country } : {});
}

export function listCatalog(
  entity: CatalogEntity,
  params: { status?: '' | CatalogStatus; q?: string; page: number; limit: number }
) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.status) query.set('status', params.status);
  if (params.q) query.set('q', params.q);
  return apiGet<CatalogList>(`${BASE}/catalog/${entity}?${query}`);
}

export function createCatalogRow(entity: CatalogEntity, body: { id?: string; data: Record<string, unknown> }) {
  return apiPost<CatalogRow>(`${BASE}/catalog/${entity}`, body);
}

export function updateCatalogRow(entity: CatalogEntity, id: string, data: Record<string, unknown>) {
  return apiPatch<CatalogRow>(`${BASE}/catalog/${entity}/${encodeURIComponent(id)}`, { data });
}

export function setCatalogStatus(entity: CatalogEntity, id: string, status: CatalogStatus) {
  return apiPost<CatalogRow>(`${BASE}/catalog/${entity}/${encodeURIComponent(id)}/status`, { status });
}

export function getCatalogHistory(entity: CatalogEntity, id: string) {
  return apiGet<CatalogHistoryEntry[]>(`${BASE}/catalog/${entity}/${encodeURIComponent(id)}/history`);
}

export function listKillSwitches() {
  return apiGet<KillSwitch[]>(`${BASE}/kill-switches`);
}

export function createKillSwitch(input: KillSwitchInput) {
  return apiPost<KillSwitch>(`${BASE}/kill-switches`, input);
}

export function setKillSwitchActive(id: string, active: boolean, reason?: string) {
  return apiPatch<KillSwitch>(`${BASE}/kill-switches/${id}`, reason ? { active, reason } : { active });
}

/** `''` (the default row) is `default` in the URL. */
const rolloutPath = (country: string) => `${BASE}/rollout/${country || 'default'}`;

export function listRollout() {
  return apiGet<RolloutRow[]>(`${BASE}/rollout`);
}

export function setRollout(country: string, input: { percent: number; includeInternal: boolean; note?: string | null }) {
  return apiPut<RolloutRow>(rolloutPath(country), input);
}

export function deleteRollout(country: string) {
  return apiDelete<{ deleted: boolean }>(rolloutPath(country));
}

export function listSkeletonQueue() {
  return apiGet<SkeletonGroup[]>(`${BASE}/skeletons`);
}

export function createTemplateFromSkeleton(hash: string, input: TemplateFromSkeletonInput) {
  return apiPost<CatalogRow>(`${BASE}/skeletons/${hash}/template`, input);
}

export function dismissSkeleton(hash: string) {
  return apiPost<{ dismissed: boolean }>(`${BASE}/skeletons/${hash}/dismiss`, {});
}

export function listAliasCandidates() {
  return apiGet<AliasCandidate[]>(`${BASE}/alias-candidates`);
}

export function promoteAliasCandidate(input: { aliasKey: string; merchantId: string; country?: string }) {
  return apiPost<CatalogRow>(`${BASE}/alias-candidates/promote`, input);
}

export function getUserDetection(userId: string) {
  return apiGet<UserDetection>(`${BASE}/users/${userId}`);
}

export function listDeletionRequests() {
  return apiGet<DeletionRequest[]>(`${BASE}/deletions`);
}
