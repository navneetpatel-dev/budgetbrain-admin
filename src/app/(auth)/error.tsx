'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/shared/components/PageStates.component';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Auth Error]:', error);
  }, [error]);

  return (
    <div style={{ padding: 32 }}>
      <ErrorState
        message={error.message || 'An unexpected error occurred loading this section.'}
        onRetry={reset}
      />
    </div>
  );
}
