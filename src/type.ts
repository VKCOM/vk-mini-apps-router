import { AgnosticIndexRouteObject, LazyRouteFunction } from '@remix-run/router';

interface CommonRouteObject {
  caseSensitive?: AgnosticIndexRouteObject['caseSensitive'];
  path?: AgnosticIndexRouteObject['path'];
  id?: AgnosticIndexRouteObject['id'];
  loader?: AgnosticIndexRouteObject['loader'];
  action?: AgnosticIndexRouteObject['action'];
  hasErrorBoundary?: AgnosticIndexRouteObject['hasErrorBoundary'];
  shouldRevalidate?: AgnosticIndexRouteObject['shouldRevalidate'];
  handle?: AgnosticIndexRouteObject['handle'];
}

interface NonIndexRouteObject<T extends CommonRouteObject> extends CommonRouteObject {
  index: false;
  children?: T[];
}

interface IndexRouteObject extends CommonRouteObject {
  index: true;
}

export interface RootRouteObject extends NonIndexRouteObject<ViewRouteObject> {
  root: string;
  children?: ViewRouteObject[];
  lazy?: LazyRouteFunction<RootRouteObject>;
}

export interface ViewRouteObject extends NonIndexRouteObject<PanelRouteObject> {
  view: string;
  children?: PanelRouteObject[];
  lazy?: LazyRouteFunction<ViewRouteObject>;
}

export interface PanelIndexRouteObject extends IndexRouteObject {
  panel: string;
  lazy?: LazyRouteFunction<PanelRouteObject>;
}

export interface PanelNonIndexRouteObject extends NonIndexRouteObject<ModalRouteObject> {
  panel: string;
  children?: ModalRouteObject[];
  lazy?: LazyRouteFunction<PanelRouteObject>;
}

export type PanelRouteObject = PanelIndexRouteObject | PanelNonIndexRouteObject;

export interface ModalRouteObject extends IndexRouteObject {
  modal: string;
  lazy?: LazyRouteFunction<ModalRouteObject>;
}

