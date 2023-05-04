import { AnyPanel } from './panelPage';
import { AddChild, HasChildren, HasId, RepresentsRoutes } from './common';
import { CommonRouteObject } from '../type';

interface ViewRoutePartial extends CommonRouteObject {
  view: string;
  panel: string;
  modal?: string;
}

export class ViewConfig<T extends string> implements HasId<T>, HasChildren<AnyPanel>, RepresentsRoutes<ViewRoutePartial> {
  constructor(public id: T, private panels: AnyPanel[]) {}

  get children(): AnyPanel[] {
    return this.panels;
  }

  getRoutes(): ViewRoutePartial[] {
    console.log(this);
    return this.panels
      .map((panel) => panel.getRoutes())
      .flat()
      .map((panelRoute) => ({ ...panelRoute, view: this.id }));
  }
}

export function createView<T extends string,
  A extends AnyPanel,
  B extends AnyPanel,
  C extends AnyPanel,
  D extends AnyPanel,
>(id: T, panels: [A, B, C, D]): AddChild<AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>, D>;
export function createView<T extends string,
  A extends AnyPanel,
  B extends AnyPanel,
  C extends AnyPanel,
>(id: T, panels: [A, B, C]): AddChild<AddChild<AddChild<ViewConfig<T>, A>, B>, C>;
export function createView<T extends string,
  A extends AnyPanel,
  B extends AnyPanel,
>(id: T, panels: [A, B]): AddChild<AddChild<ViewConfig<T>, A>, B>;
export function createView<T extends string, A extends AnyPanel>(id: T, panels: [A]): AddChild<ViewConfig<T>, A>;
export function createView<T extends string>(id: T, panels: AnyPanel[]): ViewConfig<T>;
export function createView<T extends string>(id: T, panels: AnyPanel[]): ViewConfig<T> {
  return new ViewConfig<T>(id, panels);
}
