import { AddChild, HasId, Page, PageWithParams, RepresentsRoutes, uniqueKey } from './common';
import { AnyModalPage } from './ModalPage';
import { CommonRouteObject } from '../type';

interface TabRoutePartial extends CommonRouteObject {
  tab: string;
  modal?: string;
}

abstract class BaseTabPage<I extends string> implements RepresentsRoutes<TabRoutePartial>, HasId<I> {
  protected constructor(public id: I, public path: string, protected modals: AnyModalPage[]) {
    modals.forEach((modal) => {
      // @ts-expect-error
      this[uniqueKey(this, modal.id)] = modal;
    });
  }

  getRoutes(): TabRoutePartial[] {
    return this.modals
      .map((modal) => modal.getRoutes())
      .flat()
      .map((route): TabRoutePartial => ({ ...route, tab: this.id }))
      .concat({
        path: this.path,
        tab: this.id,
      });
  }
}

export class TabPage<I extends string> extends BaseTabPage<I> implements Page, HasId<I> {
  hasParams: false = false;
  constructor(id: I, public path: string, modals: AnyModalPage[] = []) {
    super(id, path, modals);
  }
}

export class TabPageWithParams<I extends string, T extends string> extends BaseTabPage<I> implements PageWithParams<T>, HasId<I> {
  hasParams: true = true;
  constructor(public id: I, public path: string, public paramKeys: readonly T[], modals: AnyModalPage[] = []) {
    super(id, path, modals);
  }
}

export type AnyTabPage = TabPage<any> | TabPageWithParams<any, any>;

export function createTab<
  T extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage, D extends AnyModalPage,
  E extends AnyModalPage, F extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C, D, E, F]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<TabPage<T>, A>, B>, C>, D>, E>, F>;
export function createTab<
  T extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage, D extends AnyModalPage,
  E extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C, D, E]):
AddChild<AddChild<AddChild<AddChild<AddChild<TabPage<T>, A>, B>, C>, D>, E>;
export function createTab<
  T extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage, D extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C, D]):
AddChild<AddChild<AddChild<AddChild<TabPage<T>, A>, B>, C>, D>;
export function createTab<
  T extends string, A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C]): AddChild<AddChild<AddChild<TabPage<T>, A>, B>, C>;
export function createTab<
  T extends string, A extends AnyModalPage, B extends AnyModalPage,
>(id: T, path: string, modals: [A, B]): AddChild<AddChild<TabPage<T>, A>, B>;
export function createTab<T extends string, A extends AnyModalPage>(id: T, path: string, modals: [A]): AddChild<TabPage<T>, A>;
export function createTab<T extends string>(id: T, path: string, modals?: AnyModalPage[]): TabPage<T>;

export function createTab<
  T extends string, P extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage, D extends AnyModalPage,
  E extends AnyModalPage, F extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C, D, E, F], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<TabPageWithParams<T, P>, A>, B>, C>, D>, E>, F>;
export function createTab<
  T extends string, P extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage, D extends AnyModalPage,
  E extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C, D, E], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<TabPageWithParams<T, P>, A>, B>, C>, D>, E>;
export function createTab<
  T extends string, P extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage, D extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C, D], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<TabPageWithParams<T, P>, A>, B>, C>, D>;
export function createTab<
  T extends string, P extends string,
  A extends AnyModalPage, B extends AnyModalPage, C extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C], paramKeys: readonly P[]): AddChild<AddChild<AddChild<TabPageWithParams<T, P>, A>, B>, C>;
export function createTab<
  T extends string, P extends string, A extends AnyModalPage, B extends AnyModalPage,
>(id: T, path: string, modals: [A, B], paramKeys: readonly P[]): AddChild<AddChild<TabPageWithParams<T, P>, A>, B>;
export function createTab<
  T extends string, P extends string, A extends AnyModalPage,
>(id: T, path: string, modals: [A], paramKeys: readonly P[]): AddChild<TabPageWithParams<T, P>, A>;
export function createTab<T extends string, P extends string>(id: T, path: string, modals: AnyModalPage[], paramKeys: readonly P[]): TabPageWithParams<T, P>;
export function createTab<T extends string, P extends string>(id: T, path: string, modals?: AnyModalPage[], paramKeys?: readonly P[]):
TabPage<T> | TabPageWithParams<T, P> {
  if (paramKeys) {
    return new TabPageWithParams(id, path, paramKeys, modals ?? []);
  }
  return new TabPage(id, path, modals ?? []);
}
