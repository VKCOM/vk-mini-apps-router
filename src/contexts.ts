import { AgnosticDataRouteObject, AgnosticRouteMatch, Router } from '@remix-run/router';
import React from 'react';
import { ModalRouteObject, PanelRouteObject, ViewRouteObject } from './type';

export interface RouteNavigator {
  push(path: string): void;
  push(path: AgnosticRouteMatch<string, AgnosticDataRouteObject>): void;
  push(path: string | AgnosticRouteMatch<string, AgnosticDataRouteObject>): void;
  replace(path: string): void;
  get activeViewHistory(): string[];
}

export interface RouterContextObject {
  router: Router;
  navigator: RouteNavigator;
}

export const RouterContext = React.createContext<RouterContextObject | null>(null);

export interface RouteContextObject {
  viewMatch?: AgnosticRouteMatch<string, ViewRouteObject> | undefined;
  panelMatch?: AgnosticRouteMatch<string, PanelRouteObject> | undefined;
  modalMatch?: AgnosticRouteMatch<string, ModalRouteObject> | undefined;
}

export const RouteContext = React.createContext<RouteContextObject | null>(null);
