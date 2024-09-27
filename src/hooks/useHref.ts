import { Location, RelativeRoutingType, To } from '@remix-run/router';
import { RouterContext } from '../contexts';
import { useContext } from 'react';
import { useResolvedPath } from './useResolvedPath';
import { getHrefWithoutHash } from '../utils/getHrefWithoutHash';
import { getPathFromTo, invariant } from '../utils/utils';
import { InjectParamsIfNeeded, Page, PageWithParams } from '../page-types/common';

export type UseHrefOptions<T extends To | Page | PageWithParams<string>> = InjectParamsIfNeeded<
  T,
  { relative?: RelativeRoutingType }
>;

export function useHref<T extends To | Page | PageWithParams<string>>(
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
