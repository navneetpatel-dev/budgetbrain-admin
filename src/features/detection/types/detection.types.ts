export interface DetectionAdoption {
  activeUsers30d: number;
  templateLearningUsers: number;
  reviewAllUsers: number;
  computedAt: string | null;
}

export interface DetectionDashboard {
  range: { from: string; to: string };
  total: number;
  counts: Record<string, number>;
  rates: {
    autoApproved: number;
    review: number;
    confirmed: number;
    rejected: number;
    undone: number;
    duplicate: number;
  };
  bySource: { source: string; count: number }[];
  byInstitution: {
    institutionId: string | null;
    name: string | null;
    count: number;
    autoApproved: number;
    review: number;
    rejected: number;
  }[];
  byCountry: { country: string | null; count: number }[];
  series: ({ day: string } & Record<string, number | string>)[];
  adoption: DetectionAdoption;
}

export const CATALOG_ENTITIES = [
  'institutions',
  'senders',
  'lexicons',
  'templates',
  'merchants',
  'aliases',
  'mcc',
  'taxonomy',
] as const;
export type CatalogEntity = (typeof CATALOG_ENTITIES)[number];
export type CatalogStatus = 'draft' | 'review' | 'published';

/** A catalog row: its fields plus id, status, version, source and timestamps. */
export type CatalogRow = Record<string, unknown> & {
  id: string;
  status: CatalogStatus;
  version: number;
  source: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface CatalogList {
  items: CatalogRow[];
  total: number;
  page: number;
  limit: number;
}

export interface CatalogHistoryEntry {
  id: string;
  version: number;
  status: CatalogStatus;
  action: string;
  data: Record<string, unknown>;
  createdAt: string;
  changedBy: string | null;
}

export const KILL_SWITCH_SCOPES = ['institution', 'template', 'country', 'pack', 'app_version'] as const;
export const KILL_SWITCH_ACTIONS = ['disable_auto_create', 'disable_detection'] as const;
export type KillSwitchScope = (typeof KILL_SWITCH_SCOPES)[number];
export type KillSwitchAction = (typeof KILL_SWITCH_ACTIONS)[number];

export interface KillSwitch {
  id: string;
  scope: KillSwitchScope;
  key: string;
  action: KillSwitchAction;
  reason: string | null;
  active: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KillSwitchInput {
  scope: KillSwitchScope;
  key: string;
  action: KillSwitchAction;
  reason: string;
}

/** A message shape at least k users submitted (T7.4). */
export interface SkeletonGroup {
  skeletonHash: string;
  skeleton: string;
  institutionId: string | null;
  institutionName: string | null;
  country: string;
  users: number;
  correctedFields: string[];
  lastSeenAt: string;
}

export const TEMPLATE_FIELDS = [
  'amount',
  'balance',
  'limit',
  'date',
  'time',
  'account',
  'reference',
  'merchant',
  'counterparty',
  'ignore',
] as const;
export type TemplateField = (typeof TEMPLATE_FIELDS)[number];

export interface TemplateFromSkeletonInput {
  id: string;
  institutionId: string;
  language: string;
  fields: TemplateField[];
  direction: 'DEBIT' | 'CREDIT';
  transactionType: string;
  paymentMethod?: string;
  dateOrder?: 'DMY' | 'MDY' | 'YMD';
  sample: string;
}

export interface AliasCandidate {
  aliasKey: string;
  users: number;
  suggestedCategory: string | null;
}

export interface DeletionRequest {
  id: string;
  action: string;
  userId: string | null;
  createdAt: string;
  detail: Record<string, unknown> | null;
}

export interface PackBuildResult {
  country: string;
  version?: number;
  [key: string]: unknown;
}

export interface UserDetection {
  settings: { autoAddHighConfidence: boolean; templateLearning: boolean };
  counts: { status: string; source: string; count: number }[];
  rules: { merchant: string; categoryName: string | null; updatedAt: string }[];
  diagnostics: {
    day: string;
    stage: string;
    reasonCode: string;
    institutionId: string | null;
    institutionName: string | null;
    count: number;
  }[];
  recent: {
    id: string;
    status: string;
    source: string;
    merchant: string | null;
    amount: string;
    currency: string;
    institutionId: string | null;
    confidenceTier: string | null;
    reviewReason: string | null;
    createdAt: string;
  }[];
  skeletonSubmissions: number;
}
