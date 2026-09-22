'use client';

import { pageStateStyles } from '@/shared/styles/pageStates.styles';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className={pageStateStyles.error}>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className={pageStateStyles.retryButton} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className={pageStateStyles.empty}>{message}</div>;
}
