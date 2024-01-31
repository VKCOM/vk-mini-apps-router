import { Location, parsePath, To } from '@remix-run/router';
import { createKey } from '../utils';

/**
 * Creates a Location object with a unique key from the given Path
 */
export function createLocation(
  current: string | Location,
  to: To,
  state: any = null,
  key?: string,
): Readonly<Location> {
  return {
    pathname: typeof current === 'string' ? current : current.pathname,
    search: '',
    hash: '',
    ...(typeof to === 'string' ? parsePath(to) : to),
    state,
    key: (to && (to as Location).key) || key || createKey(),
  };
}
