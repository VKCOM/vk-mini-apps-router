import { BlockerFunction, IDLE_BLOCKER } from '@remix-run/router';
import { useRouteNavigator } from './hooks';
import { useEffect, useRef } from 'react';
import { useThrottledContext } from './useThrottledContext';
import { RouteContext } from '../contexts';
import { NAVIGATION_BLOCKER_KEY } from '../const';

export function useBlocker(blocker: BlockerFunction) {
  const routeNavigator = useRouteNavigator();
  const [routeContext] = useThrottledContext(RouteContext);
  const unblocker = useRef<() => void>();

  useEffect(() => {
    if (unblocker.current) unblocker.current();
    unblocker.current = routeNavigator.block(blocker);

    return () => unblocker.current && unblocker.current();
  }, [blocker, routeNavigator]);

  return routeContext.state.blockers.get(NAVIGATION_BLOCKER_KEY) ?? IDLE_BLOCKER;
}
