import { createPath, RelativeRoutingType, To } from '@remix-run/router';
import { HTMLAttributeAnchorTarget, MouseEvent as ReactMouseEvent, useCallback } from 'react';
import { useLocation, useRouteNavigator } from './hooks';
import { useResolvedPath } from './useResolvedPath';
import { InjectParamsIfNeeded, Page, PageWithParams } from '../page-types/common';
import { getPathFromTo } from '../utils';

type LimitedMouseEvent = Pick<MouseEvent, 'button' | 'metaKey' | 'altKey' | 'ctrlKey' | 'shiftKey'>;
export type UseClickHandlerOptions<T extends To | Page | PageWithParams<string>> =
  InjectParamsIfNeeded<
    T,
    {
      target?: HTMLAttributeAnchorTarget;
      replace?: boolean;
      preventScrollReset?: boolean;
      relative?: RelativeRoutingType;
    }
  >;

function isModifiedEvent(event: LimitedMouseEvent): boolean {
  return Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function shouldProcessLinkClick(event: LimitedMouseEvent, target?: string): boolean {
  return (
    event.button === 0 && // Ignore everything but left clicks
    (!target || target === '_self') && // Let browser handle "target=_blank" etc.
    !isModifiedEvent(event) // Ignore clicks with modifier keys
  );
}

export function useLinkClickHandler<
  T extends To | Page | PageWithParams<string>,
  E extends Element = HTMLAnchorElement,
>(
  to: T,
  { target, replace: replaceProp, preventScrollReset, relative, params }: UseClickHandlerOptions<T>,
): (event: ReactMouseEvent<E>) => void {
  const navigator = useRouteNavigator();
  const location = useLocation();

  const path = useResolvedPath(getPathFromTo({ to, params, defaultPathname: location.pathname }), {
    relative,
  });

  return useCallback(
    (event: ReactMouseEvent<E>) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();

        // If the URL hasn't changed, a regular <a> will do a replace instead of
        // a push, so do the same here unless the replace prop is explicitly set
        const toPath = createPath(path);
        const replace = replaceProp !== undefined ? replaceProp : createPath(location) === toPath;

        if (replace) {
          navigator.replace(toPath);
        } else {
          navigator.push(toPath);
        }
      }
    },
    [location, navigator, path, replaceProp, target, to, preventScrollReset, relative],
  );
}
