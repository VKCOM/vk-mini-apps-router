import { AddChild, HasId, Page, PageWithParams, RepresentsRoutes, uniqueKey } from './common';
import { AnyModalPage } from './ModalPage';
import { CommonRouteObject } from '../type';
import { AnyTabPage } from './TabPage';

interface PanelRoutePartial extends CommonRouteObject {
  panel: string;
  tab?: string;
  modal?: string;
}

type AnySubPage = AnyModalPage | AnyTabPage;

abstract class BasePanelPage<I extends string> implements RepresentsRoutes<PanelRoutePartial>, HasId<I> {
  protected constructor(public id: I, public path: string, protected modals: AnySubPage[]) {
    modals.forEach((modal) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this[uniqueKey(this, modal.id)] = modal;
    });
  }

  getRoutes(): PanelRoutePartial[] {
    return this.modals
      .map((modalOrTab) => modalOrTab.getRoutes())
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
  constructor(id: I, public path: string, modals: AnySubPage[] = []) {
    super(id, path, modals);
  }
}

export class PanelPageWithParams<I extends string, T extends string> extends BasePanelPage<I> implements PageWithParams<T>, HasId<I> {
  hasParams: true = true;
  constructor(public id: I, public path: string, public paramKeys: readonly T[], modals: AnySubPage[] = []) {
    super(id, path, modals);
  }
}

export type AnyPanel = PanelPage<any> | PanelPageWithParams<any, any>;

export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage, H extends AnySubPage,
  I extends AnySubPage, J extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G, H, I, J]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<PanelPage<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>, J>;
export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage, H extends AnySubPage,
  I extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G, H, I]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<PanelPage<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>;
export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage, H extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G, H]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>, D>, E>, F>, G>, H>;
export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>, D>, E>, F>, G>;
export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>, D>, E>, F>;
export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E]):
AddChild<AddChild<AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>, D>, E>;
export function createPanel<
  T extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D]):
AddChild<AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>, D>;
export function createPanel<
  T extends string, A extends AnySubPage, B extends AnySubPage, C extends AnySubPage,
>(id: T, path: string, modals: [A, B, C]): AddChild<AddChild<AddChild<PanelPage<T>, A>, B>, C>;
export function createPanel<
  T extends string, A extends AnySubPage, B extends AnySubPage,
>(id: T, path: string, modals: [A, B]): AddChild<AddChild<PanelPage<T>, A>, B>;
export function createPanel<T extends string, A extends AnySubPage>(id: T, path: string, modals: [A]): AddChild<PanelPage<T>, A>;
export function createPanel<T extends string>(id: T, path: string, modals?: AnySubPage[]): PanelPage<T>;

export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage, H extends AnySubPage,
  I extends AnySubPage, J extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G, H, I, J], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>, E>, F>, G>, H>, I>, J>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage, H extends AnySubPage,
  I extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G, H, I], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>, E>, F>, G>, H>, I>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage, H extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G, H], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>, E>, F>, G>, H>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage, G extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F, G], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>, E>, F>, G>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage, F extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E, F], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>, E>, F>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
  E extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D, E], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>, E>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage, D extends AnySubPage,
>(id: T, path: string, modals: [A, B, C, D], paramKeys: readonly P[]):
AddChild<AddChild<AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>, C>, D>;
export function createPanel<
  T extends string, P extends string,
  A extends AnySubPage, B extends AnySubPage, C extends AnySubPage,
>(id: T, path: string, modals: [A, B, C], paramKeys: readonly P[]): AddChild<AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>, C>;
export function createPanel<
  T extends string, P extends string, A extends AnySubPage, B extends AnySubPage,
>(id: T, path: string, modals: [A, B], paramKeys: readonly P[]): AddChild<AddChild<PanelPageWithParams<T, P>, A>, B>;
export function createPanel<
  T extends string, P extends string, A extends AnySubPage,
>(id: T, path: string, modals: [A], paramKeys: readonly P[]): AddChild<PanelPageWithParams<T, P>, A>;
export function createPanel<T extends string, P extends string>(id: T, path: string, modals: AnySubPage[], paramKeys: readonly P[]): PanelPageWithParams<T, P>;
export function createPanel<T extends string, P extends string>(id: T, path: string, modals?: AnySubPage[], paramKeys?: readonly P[]):
PanelPage<T> | PanelPageWithParams<T, P> {
  if (paramKeys) {
    return new PanelPageWithParams(id, path, paramKeys, modals ?? []);
  }
  return new PanelPage(id, path, modals ?? []);
}
