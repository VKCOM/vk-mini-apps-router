import { Location, RelativeRoutingType, To, UNSAFE_invariant as invariant } from '@remix-run/router';
import { RouterContext } from '../contexts';
import { useContext } from 'react';
import { useResolvedPath } from './useResolvedPath';

export function useHref(
  to: To,
  { relative }: { relative?: RelativeRoutingType } = {}
): string {
  const routeContext = useContext(RouterContext);
  invariant(routeContext, 'You can not use useHref hook outside of RouteContext. Make sure calling it inside RouterProvider.');

  const { hash, pathname, search } = useResolvedPath(to, { relative });

  return routeContext.router.createHref({ pathname, search, hash } as Location);
}
