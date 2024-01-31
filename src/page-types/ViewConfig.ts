import { AnyPanel } from './PanelPage';
import { AddChild, HasChildren, HasId, RepresentsRoutes, uniqueKey } from './common';
import { CommonRouteObject } from '../type';

interface ViewRoutePartial extends CommonRouteObject {
  view: string;
  panel: string;
  modal?: string;
}

export class ViewConfig<T extends string> implements HasId<T>, HasChildren<AnyPanel>, RepresentsRoutes<ViewRoutePartial> {
  constructor(public id: T, private panels: AnyPanel[]) {
    panels.forEach((panel) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this[uniqueKey(this, panel.id)] = panel;
    });
  }

  get children(): AnyPanel[] {
    return this.panels;
  }

  getRoutes(): ViewRoutePartial[] {
    return this.panels
      .map((panel) => panel.getRoutes())
      .flat()
      .map((panelRoute) => ({ ...panelRoute, view: this.id }));
  }
}

export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel, H extends AnyPanel, I extends AnyPanel,
  J extends AnyPanel, K extends AnyPanel, L extends AnyPanel, M extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G, H, I, J, K, L, M]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<AddChild<AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>, J>, K>, L>, M>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel, H extends AnyPanel, I extends AnyPanel,
  J extends AnyPanel, K extends AnyPanel, L extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G, H, I, J, K, L]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>, J>, K>, L>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel, H extends AnyPanel, I extends AnyPanel,
  J extends AnyPanel, K extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G, H, I, J, K]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>, J>, K>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel, H extends AnyPanel, I extends AnyPanel,
  J extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G, H, I, J]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>, J>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel, H extends AnyPanel, I extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G, H, I]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>, H>, I>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel, H extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G, H]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>, H>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel, G extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F, G]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>, G>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel, F extends AnyPanel,
>(id: T, panels: [A, B, C, D, E, F]): AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<ViewConfig<T>, A>, B>, C>, D>, E>, F>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
  E extends AnyPanel,
>(id: T, panels: [A, B, C, D, E]): AddChild<AddChild<AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>, E>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel, D extends AnyPanel,
>(id: T, panels: [A, B, C, D]): AddChild<AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel, C extends AnyPanel,
>(id: T, panels: [A, B, C]): AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>;
export function createView<
  T extends string, A extends AnyPanel, B extends AnyPanel,
>(id: T, panels: [A, B]): AddChild<AddChild<ViewConfig<T>, A>, B>;
export function createView<T extends string, A extends AnyPanel>(id: T, panels: [A]): AddChild<ViewConfig<T>, A>;
export function createView<T extends string>(id: T, panels: AnyPanel[]): ViewConfig<T>;
export function createView<T extends string>(id: T, panels: AnyPanel[]): ViewConfig<T> {
  return new ViewConfig<T>(id, panels);
}
