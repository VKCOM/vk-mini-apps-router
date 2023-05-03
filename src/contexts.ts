import { AgnosticRouteMatch, Router, RouterState } from '@remix-run/router';
import React from 'react';
import { RouteNavigator } from './services/routeNavigator.type';
import { PageInternal } from './type';

export interface RouterContextObject {
  router: Router;
  routeNavigator: RouteNavigator;
}

export const RouterContext = React.createContext<RouterContextObject>(null!);

export interface RouteContextObject {
  state: RouterState;
  match?: AgnosticRouteMatch<string, PageInternal> | undefined;
  panelsHistory?: string[];
}

export const RouteContext = React.createContext<RouteContextObject>(null!);

export interface PopoutContextObject {
  popout: JSX.Element | null;
}

export const PopoutContext = React.createContext<PopoutContextObject>({ popout: null });
