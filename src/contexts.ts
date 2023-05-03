import { AgnosticRouteMatch, Router, RouterState } from '@remix-run/router';
import React from 'react';
import { ModalRouteObject, PanelRouteObject, RootRouteObject, ViewRouteObject } from './type';
import { RouteNavigator } from './services/routeNavigator.type';

export interface RouterContextObject {
  router: Router;
  routeNavigator: RouteNavigator;
}

export const RouterContext = React.createContext<RouterContextObject>(null!);

export interface RouteContextObject {
  state: RouterState;
  rootMatch?: AgnosticRouteMatch<string, RootRouteObject> | undefined;
  viewMatch?: AgnosticRouteMatch<string, ViewRouteObject> | undefined;
  panelMatch?: AgnosticRouteMatch<string, PanelRouteObject> | undefined;
  modalMatch?: AgnosticRouteMatch<string, ModalRouteObject> | undefined;
  panelsHistory?: string[];
}

export const RouteContext = React.createContext<RouteContextObject>(null!);

export interface PopoutContextObject {
  popout: JSX.Element | null;
}

export const PopoutContext = React.createContext<PopoutContextObject>({ popout: null });
