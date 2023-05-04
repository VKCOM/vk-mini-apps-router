import { AddChild, HasId, Page, PageWithParams, RepresentsRoutes, uniqueKey } from './common';
import { AnyModalPage } from './modalPage';
import { CommonRouteObject } from '../type';

interface PanelRoutePartial extends CommonRouteObject {
  panel: string;
  modal?: string;
}

abstract class BasePanelPage<I extends string> implements RepresentsRoutes<PanelRoutePartial>, HasId<I> {
  protected constructor(public id: I, public path: string, protected modals: AnyModalPage[]) {
    modals.forEach((modal) => {
      // @ts-expect-error
      this[uniqueKey(this, modal.id)] = modal;
    });
  }

  getRoutes(): PanelRoutePartial[] {
    return this.modals
      .map((modal) => modal.getRoutes())
      .flat()
      .map((route): PanelRoutePartial => ({ ...route, panel: this.id }))
      .concat({
        path: this.path,
        panel: this.id,
      });
  }
}

export class PanelPage<I extends string> extends BasePanelPage<I> implements Page, HasId<I> {
  hasParams: false = false;
  constructor(id: I, public path: string, modals: AnyModalPage[] = []) {
    super(id, path, modals);
  }
}

export class PanelPageWithParams<I extends string, T extends string> extends BasePanelPage<I> implements PageWithParams<T>, HasId<I> {
  hasParams: true = true;
  constructor(public id: I, public path: string, public paramKeys: readonly T[], modals: AnyModalPage[] = []) {
    super(id, path, modals);
  }
}

export function createPanel<
  T extends string,
  A extends AnyModalPage,
  B extends AnyModalPage,
  C extends AnyModalPage,
>(id: T, path: string, modals: [A, B, C]): AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>;
export function createPanel<
  T extends string,
  A extends AnyModalPage,
  B extends AnyModalPage,
>(id: T, path: string, modals: [A, B]): AddChild<AddChild<PanelPage<T>, A>, B>;
export function createPanel<T extends string, A extends AnyModalPage>(id: T, path: string, modals: [A]): AddChild<PanelPage<T>, A>;
export function createPanel<T extends string>(id: T, path: string, modals?: AnyModalPage[]): PanelPage<T>;

export function createPanel<
  T extends string,
  P extends string,
  A extends AnyModalPage,
  B extends AnyModalPage,
>(id: T, path: string, modals: [A, B], paramKeys: readonly P[]): AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>;
export function createPanel<
  T extends string,
  P extends string,
  A extends AnyModalPage,
>(id: T, path: string, modals: [A], paramKeys: readonly P[]): AddChild<PanelPageWithParams<T, P>, A>;
export function createPanel<T extends string, P extends string>(id: T, path: string, modals: AnyModalPage[], paramKeys: readonly P[]): PanelPageWithParams<T, P>;
export function createPanel<T extends string, P extends string>(id: T, path: string, modals?: AnyModalPage[], paramKeys?: readonly P[]):
PanelPage<T> | PanelPageWithParams<T, P> {
  if (paramKeys) {
    return new PanelPageWithParams(id, path, paramKeys, modals ?? []);
  }
  return new PanelPage(id, path, modals ?? []);
}

export type AnyPanel = PanelPage<any> | PanelPageWithParams<any, any>;
