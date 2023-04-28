import { useContext } from 'react';
import { PopoutContext, RouteContext, RouterContext, RouterContextObject } from '../contexts';
import { Location, Params } from '@remix-run/router';

export function useRouterContext(): RouterContextObject {
  return useContext(RouterContext);
}

export function usePanelParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  return routeContext.panelMatch?.params;
}

export function useModalParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  return routeContext.modalMatch?.params;
}

export function useLocation(): Location {
  return useContext(RouteContext).state.location;
}

export function usePopout(): JSX.Element | null {
  return useContext(PopoutContext).popout;
}
