import { AgnosticRouteMatch, Router, RouterState } from '@remix-run/router';
import React from 'react';
import { ModalRouteObject, PanelRouteObject, RootRouteObject, ViewRouteObject } from './type';

export interface RouteNavigator {
  push(path: string): void;
  replace(path: string): void;
  back(): void;
  showModal(id: string): void;

  /**
   * Закрыть модальное окно, открытое методом showModal или навигацией (push/replace/back).
   *
   * @param pushPanel Установите значение в true, если хотите выполнить PUSH навигацию.
   * В случае, если модальное окно было открыто через навигацию, можно закрыть окно шагом назад
   * или навигацией вперед на родительскую панель.<br>
   * По умолчанию false.
   */
  hideModal(pushPanel?: boolean): void;
  showPopout(popout: JSX.Element | null): void;
  hidePopout(): void;
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

export interface PopoutContextObject {
  popout: JSX.Element | null;
}

export const PopoutContext = React.createContext<PopoutContextObject>({ popout: null });
