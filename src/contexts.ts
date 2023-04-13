import { Router } from '@remix-run/router';
import React from 'react';

export interface RouteNavigator {
  push(path: string): void;
  replace(path: string): void;
  get activeViewHistory(): string[];
}

export interface RouterContextObject {
  router: Router;
  navigator: RouteNavigator;
}

export const RouterContext = React.createContext<RouterContextObject | null>(null);

export interface ActiveVkuiLocationObject {
  view?: string | null;
  panel?: string | null;
}

export const ActiveVkuiLocationContext = React.createContext<ActiveVkuiLocationObject | null>(null);
