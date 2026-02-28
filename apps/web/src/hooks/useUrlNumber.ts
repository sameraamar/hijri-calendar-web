import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Syncs a numeric value with a URL search-param.
 * Behaves like `useState<number>` but persists the value in the URL
 * (e.g. `?year=2026&month=3`), making pages shareable & crawlable.
 *
 * @param key          The search-param name (e.g. `"year"`)
 * @param defaultValue Fallback when the param is missing or invalid
 */
export function useUrlNumber(
  key: string,
  defaultValue: number,
): [number, (v: number | ((prev: number) => number)) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get(key);
  const parsed = raw !== null ? Number(raw) : NaN;
  const value = Number.isFinite(parsed) ? parsed : defaultValue;

  const setValue = useCallback(
    (next: number | ((prev: number) => number)) => {
      setSearchParams((prev) => {
        const rawCur = prev.get(key);
        const parsedCur = rawCur !== null ? Number(rawCur) : NaN;
        const current = Number.isFinite(parsedCur) ? parsedCur : defaultValue;

        const resolved = typeof next === 'function' ? next(current) : next;
        const updated = new URLSearchParams(prev);
        updated.set(key, String(resolved));
        return updated;
      }, { replace: true });
    },
    [key, defaultValue, setSearchParams],
  );

  return [value, setValue];
}
