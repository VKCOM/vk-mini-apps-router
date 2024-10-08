import { Location, RelativeRoutingType } from '@remix-run/router';
import { RouterContext } from '../contexts';
import { useContext } from 'react';
import { useResolvedPath } from './useResolvedPath';
import { getHrefWithoutHash } from '../utils/getHrefWithoutHash';
import { getPathFromTo, invariant } from '../utils/utils';
import { InjectParamsIfNeeded } from '../page-types/common';
import { NavigationTarget } from '../services';

export type UseHrefOptions<T extends NavigationTarget> = InjectParamsIfNeeded<
  T,
  { relative?: RelativeRoutingType }
>;

export function useHref<T extends NavigationTarget>(
  to: T,
  { relative, params }: UseHrefOptions<T>,
): string {
  const routeContext = useContext(RouterContext);
  invariant(
    routeContext,
    'You can not use useHref hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );

  const path = getPathFromTo({
    to,
    params,
    defaultPathname: routeContext.router.state.location.pathname,
  });

  const { hash, pathname, search } = useResolvedPath(path, { relative });

  const hrefWithoutHash = getHrefWithoutHash();
  const href = routeContext.router.createHref({ pathname, search, hash } as Location);
  const location = href.replace(hrefWithoutHash, '');

  return location.startsWith('/') ? location : '/' + location;
}
