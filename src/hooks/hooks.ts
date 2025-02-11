import { PopoutContext, RouteContext, RouterContext } from '../contexts';
import { Location } from '@remix-run/router';
import { RouteNavigator } from '../services/RouteNavigator.type';
import { useThrottledContext } from './useThrottledContext';
import { invariant } from '../utils/utils';
import { useContext } from 'react';

export function useRouteNavigator(): RouteNavigator {
  const routerContext = useContext(RouterContext);
  invariant(
    routerContext,
    'You can not use useNavigator hook outside of RouterContext. Make sure calling it inside RouterProvider.',
  );
  return routerContext.routeNavigator;
}

export function useLocation(): Location {
  const [routeContext] = useThrottledContext(RouteContext);
  invariant(
    routeContext,
    'You can not use useLocation hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );
  return routeContext.state.location;
}

export function usePopout(): JSX.Element | null {
  const [popoutContext] = useThrottledContext(PopoutContext);
  return popoutContext.popout;
}
