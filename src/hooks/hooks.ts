import { useContext } from 'react';
import { RouteContext, RouterContext, RouterContextObject } from '../contexts';
import { ActiveVkuiLocationObject } from '../type';
import { AgnosticRouteMatch, Location, Params } from '@remix-run/router';

export function useRouterContext(): RouterContextObject | null {
  return useContext(RouterContext);
}

export function useActiveVkuiLocation(): ActiveVkuiLocationObject {
  const routeContext = useContext(RouteContext);
  return {
    root: routeContext.rootMatch?.route.root,
    view: routeContext.viewMatch?.route.view,
    panel: routeContext.panelMatch?.route.panel,
    modal: routeContext.modalMatch?.route.modal,
    panelsHistory: routeContext.panelsHistory,
  };
}

export function usePanelParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  return routeContext.panelMatch?.params;
}

export function useModalParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  return routeContext.modalMatch?.params;
}

export function useModalParentRoute(): AgnosticRouteMatch | undefined {
  const routeContext = useContext(RouteContext);
  return routeContext.panelMatch;
}

export function useLocation(): Location {
  return useContext(RouteContext).state.location;
}
