import { AgnosticIndexRouteObject, LazyRouteFunction } from '@remix-run/router';

export interface NonIndexRouteObject {
  caseSensitive?: AgnosticIndexRouteObject['caseSensitive'];
  path?: AgnosticIndexRouteObject['path'];
  id?: AgnosticIndexRouteObject['id'];
  loader?: AgnosticIndexRouteObject['loader'];
  action?: AgnosticIndexRouteObject['action'];
  hasErrorBoundary?: AgnosticIndexRouteObject['hasErrorBoundary'];
  shouldRevalidate?: AgnosticIndexRouteObject['shouldRevalidate'];
  handle?: AgnosticIndexRouteObject['handle'];
  index: false;
  children?: PanelRouteObject[];
  lazy?: LazyRouteFunction<NonIndexRouteObject>;
}

export interface ViewRouteObject extends NonIndexRouteObject {
  view: string;
}

export interface PanelRouteObject extends NonIndexRouteObject {
  panel: string;
}
