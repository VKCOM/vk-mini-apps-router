import { PopoutContext, RouteContext, RouterContext } from '../contexts';
import { Location, Params, UNSAFE_invariant as invariant } from '@remix-run/router';
import { RouteNavigator } from '../services/routeNavigator.type';
import { useThrottledContext } from './useThrottledContext';

export function useRouteNavigator(): RouteNavigator {
  const [routerContext] = useThrottledContext(RouterContext);
  invariant(routerContext, 'You can not use useNavigator hook outside of RouterContext. Make sure calling it inside RouterProvider.');
  return routerContext.routeNavigator;
}

export function useParams<T extends string = string>(): Params<T> | undefined {
  const [routeContext] = useThrottledContext(RouteContext);
  invariant(routeContext, 'You can not use useParams hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routeContext.match?.params;
}

export function useLocation(): Location {
  const [routeContext] = useThrottledContext(RouteContext);
  invariant(routeContext, 'You can not use useLocation hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routeContext.state.location;
}

export function usePopout(): JSX.Element | null {
  const [popoutContext] = useThrottledContext(PopoutContext);
  return popoutContext.popout;
}
