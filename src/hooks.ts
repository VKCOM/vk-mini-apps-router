import { useContext, useState } from 'react';
import { RouteContext, RouterContext, RouterContextObject } from './contexts';
import { ActiveVkuiLocationObject } from './type';
import { Params } from '@remix-run/router';

export function useRouterContext(): RouterContextObject | null {
  return useContext(RouterContext);
}

export function useActiveVkuiLocation(): ActiveVkuiLocationObject {
  const routeContext = useContext(RouteContext);
  return {
    view: routeContext?.viewMatch?.route.view,
    panel: routeContext?.panelMatch?.route.panel,
  };
}

export function usePanelParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  return routeContext?.panelMatch?.params;
}

export function useForceUpdate() {
  const [, setState] = useState(0);

  return () => {
    setState(Date.now());
  };
}
