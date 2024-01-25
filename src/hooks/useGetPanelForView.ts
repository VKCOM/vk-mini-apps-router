import { useThrottledContext } from './useThrottledContext';
import { RouteContext } from '../contexts';

export function useGetPanelForView(view?: string): string | undefined {
  const [routeContext, prevRouteContext] = useThrottledContext(RouteContext);
  const { match } = routeContext;
  const route = match?.route;
  const routeForPanel =
    view && prevRouteContext?.match?.route.view === view && route?.view !== view
      ? prevRouteContext.match.route
      : route;
  return routeForPanel?.panel;
}
