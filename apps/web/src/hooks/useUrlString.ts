import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Syncs a string value with a URL search-param.
 * Behaves like `useState<string>` but persists the value in the URL
 * (e.g. `?country=sa`), making pages shareable & crawlable.
 *
 * @param key          The search-param name (e.g. `"country"`)
 * @param defaultValue Fallback when the param is missing
 */
export function useUrlString(
  key: string,
  defaultValue: string,
): [string, (v: string | ((prev: string) => string)) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get(key);
  const value = raw !== null ? raw : defaultValue;

  const setValue = useCallback(
    (next: string | ((prev: string) => string)) => {
      setSearchParams((prev) => {
        const current = prev.get(key) ?? defaultValue;
        const resolved = typeof next === 'function' ? next(current) : next;
        const updated = new URLSearchParams(prev);
        updated.set(key, resolved);
        return updated;
      }, { replace: true });
    },
    [key, defaultValue, setSearchParams],
  );

  return [value, setValue];
}
