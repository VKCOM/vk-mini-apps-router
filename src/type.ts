import { AgnosticIndexRouteObject } from '@remix-run/router';

interface CommonRouteObject {
  caseSensitive?: AgnosticIndexRouteObject['caseSensitive'];
  path?: AgnosticIndexRouteObject['path'];
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

export type InternalRouteConfig = { index: true; id: string };
export type PageInternal = (PanelWithoutRoot & InternalRouteConfig) | (PanelWithRoot & InternalRouteConfig) | (ModalWithoutRoot & InternalRouteConfig) | (ModalWithRoot & InternalRouteConfig);

export type Page = PanelWithoutRoot | PanelWithRoot | ModalWithoutRoot | ModalWithRoot;
