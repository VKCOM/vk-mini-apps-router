import { AgnosticIndexRouteObject } from '@remix-run/router';

export interface CommonRouteObject {
  path: AgnosticIndexRouteObject['path'];
}

export interface PanelWithoutRoot extends CommonRouteObject {
  view: string;
  panel: string;
}

export interface PanelWithRoot extends CommonRouteObject {
  root: string;
  view: string;
  panel: string;
}

export interface ModalWithoutRoot extends PanelWithoutRoot {
  modal: string;
}

export interface ModalWithRoot extends PanelWithRoot {
  modal: string;
}

export type RouteWithRoot = PanelWithRoot | ModalWithRoot;
export type RouteWithoutRoot = PanelWithoutRoot | ModalWithoutRoot;

export type InternalRouteConfig = { index: true; id: string };
export type PageInternal = (PanelWithoutRoot & InternalRouteConfig) | (PanelWithRoot & InternalRouteConfig) | (ModalWithoutRoot & InternalRouteConfig) | (ModalWithRoot & InternalRouteConfig);
