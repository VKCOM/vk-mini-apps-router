import { useLocation } from './hooks';

/**
 * A hook for transferring state between pages
 */
export function useMetaParams<T extends Object>(): T | null {
  const location = useLocation();
  return location.state as T;
}
