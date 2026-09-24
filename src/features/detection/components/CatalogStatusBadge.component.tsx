import type { CatalogStatus } from '../types/detection.types';
import { detectionStyles } from '../styles/detection.styles';

const BADGES: Record<CatalogStatus, string> = {
  draft: detectionStyles.badgeDraft,
  review: detectionStyles.badgeReview,
  published: detectionStyles.badgePublished,
};

export function CatalogStatusBadge({ status }: { status: CatalogStatus }) {
  return <span className={BADGES[status] ?? detectionStyles.badgeDraft}>{status}</span>;
}
