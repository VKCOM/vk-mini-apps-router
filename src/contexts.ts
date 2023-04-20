import { AgnosticDataRouteObject, AgnosticRouteMatch, Router, RouterState } from '@remix-run/router';
import React from 'react';
import { ModalRouteObject, PanelRouteObject, RootRouteObject, ViewRouteObject } from './type';

export interface RouteNavigator {
  push(path: string | AgnosticRouteMatch<string, AgnosticDataRouteObject>): void;
  replace(path: string): void;
  back(): void;
}

export interface RouterContextObject {
  router: Router;
  navigator: RouteNavigator;
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
