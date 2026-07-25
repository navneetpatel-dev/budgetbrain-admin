import { useCallback, useEffect, useRef, useState } from 'react';

const cache = new Map<string, unknown>();

/**
 * Fetches data with an in-memory cache so remounting a page (e.g. sidebar
 * navigation) can render the last result immediately instead of flashing
 * a full skeleton. Background refresh still runs on every mount/key change.
 *
 * When the cache key changes (pagination/filters) and the new key is cold,
 * the previous result stays visible until the new one arrives.
 */
export function useCachedResource<T>(key: string, fetcher: () => Promise<T>) {
  const cached = cache.get(key) as T | undefined;
  const [data, setDataState] = useState<T | undefined>(cached);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(cached === undefined);
  const [refreshing, setRefreshing] = useState(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const requestId = useRef(0);
  const visibleDataRef = useRef<T | undefined>(cached);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    const cachedForKey = cache.get(key) as T | undefined;
    const hasVisible = visibleDataRef.current !== undefined || cachedForKey !== undefined;
    setError('');

    if (cachedForKey !== undefined) {
      visibleDataRef.current = cachedForKey;
      setDataState(cachedForKey);
      setRefreshing(true);
      setLoading(false);
    } else if (hasVisible) {
      setRefreshing(true);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const result = await fetcherRef.current();
      if (id !== requestId.current) return;
      cache.set(key, result);
      visibleDataRef.current = result;
      setDataState(result);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [key]);

  useEffect(() => {
    void load();
  }, [load]);

  const setData = useCallback(
    (updater: T | ((prev: T | undefined) => T | undefined)) => {
      setDataState((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (p: T | undefined) => T | undefined)(prev)
            : updater;
        if (next !== undefined) {
          cache.set(key, next);
          visibleDataRef.current = next;
        }
        return next;
      });
    },
    [key]
  );

  return {
    data,
    error,
    /** True only when there is nothing cached/shown yet. */
    loading,
    /** True when refreshing with existing data still visible. */
    refreshing,
    reload: load,
    setData,
  };
}
