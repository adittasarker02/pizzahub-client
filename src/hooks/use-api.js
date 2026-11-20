'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

/**
 * Tiny data-fetching hook with loading / error state and manual refetch.
 *   const { data, loading, error, refetch } = useApi('/vendor/stats')
 * `key` changes (path / query) trigger a refetch; stale responses are ignored.
 */
export function useApi(path, { query, auth = true, enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const queryKey = JSON.stringify(query || {});
  const reqId = useRef(0);

  const run = useCallback(async () => {
    if (!enabled || !path) return;
    const id = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api(path, { query: JSON.parse(queryKey), auth });
      if (id === reqId.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (id === reqId.current) setState((s) => ({ data: s.data, loading: false, error }));
    }
  }, [path, queryKey, auth, enabled]);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}

export function useDebounce(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
