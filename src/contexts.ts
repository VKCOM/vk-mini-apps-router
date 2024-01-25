import { AgnosticRouteMatch, Router, RouterState } from '@remix-run/router';
import { createContext } from 'react';
import { RouteNavigator } from './services/RouteNavigator.type';
import { PageInternal } from './type';
import { ViewHistory } from './services/ViewHistory';

export interface RouterContextObject {
  router: Router;
  routeNavigator: RouteNavigator;
  viewHistory: ViewHistory;
}

export const RouterContext = createContext<RouterContextObject>(null!);

export interface RouteContextObject {
  state: RouterState;
  match?: AgnosticRouteMatch<string, PageInternal> | undefined;
  panelsHistory: string[];
}

export const RouteContext = createContext<RouteContextObject>(null!);

export interface PopoutContextObject {
  popout: JSX.Element | null;
}

export const PopoutContext = createContext<PopoutContextObject>({ popout: null });

export interface ThrottledContextObject {
  enabled: boolean;
  firstActionDelay: number;
  interval: number;
}

export const ThrottledContext = createContext<ThrottledContextObject>({
  enabled: false,
  firstActionDelay: 0,
  interval: 0,
});
