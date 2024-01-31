import { ViewConfig } from './ViewConfig';
import { AddChild, HasChildren, HasId, RepresentsRoutes, uniqueKey } from './common';
import { CommonRouteObject } from '../type';

interface RootRoutePartial extends CommonRouteObject {
  root: string;
  view: string;
  panel: string;
  modal?: string;
}

export class RootConfig<T extends string> implements HasId<T>, HasChildren<ViewConfig<string>>, RepresentsRoutes<RootRoutePartial> {
  constructor(public id: T, private views: ViewConfig<string>[]) {
    if (!views.length) {
      throw new Error(`Trying to create root ${id} without views. Root must have at least one view.`);
    }
    views.forEach((views) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this[uniqueKey(this, views.id)] = views;
    });
  }

  get children(): ViewConfig<string>[] {
    return this.views;
  }

  getRoutes(): RootRoutePartial[] {
    return this.views
      .map((view) => view.getRoutes())
      .flat()
      .map((viewRoute) => ({ ...viewRoute, root: this.id }));
  }
}

export function createRoot<
  T extends string, A extends ViewConfig<any>, B extends ViewConfig<any>, C extends ViewConfig<any>, D extends ViewConfig<any>,
  E extends ViewConfig<any>, F extends ViewConfig<any>, G extends ViewConfig<any>,
>(id: T, panels: [A, B, C, D, E, F, G]): AddChild<AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<RootConfig<T>, A>, B>, C>, D>, E>, F>, G>;
export function createRoot<
  T extends string, A extends ViewConfig<any>, B extends ViewConfig<any>, C extends ViewConfig<any>, D extends ViewConfig<any>,
  E extends ViewConfig<any>, F extends ViewConfig<any>,
>(id: T, panels: [A, B, C, D, E, F]): AddChild<AddChild<AddChild<AddChild<AddChild<
AddChild<RootConfig<T>, A>, B>, C>, D>, E>, F>;
export function createRoot<
  T extends string, A extends ViewConfig<any>, B extends ViewConfig<any>, C extends ViewConfig<any>, D extends ViewConfig<any>,
  E extends ViewConfig<any>,
>(id: T, panels: [A, B, C, D, E]): AddChild<AddChild<AddChild<AddChild<AddChild<RootConfig<T>, A>, B>, C>, D>, E>;
export function createRoot<
  T extends string, A extends ViewConfig<any>, B extends ViewConfig<any>, C extends ViewConfig<any>, D extends ViewConfig<any>,
>(id: T, panels: [A, B, C, D]): AddChild<AddChild<AddChild<AddChild<RootConfig<T>, A>, B>, C>, D>;
export function createRoot<
  T extends string, A extends ViewConfig<any>, B extends ViewConfig<any>, C extends ViewConfig<any>,
>(id: T, panels: [A, B, C]): AddChild<AddChild<AddChild<RootConfig<T>, A>, B>, C>;
export function createRoot<T extends string,
  A extends ViewConfig<any>, B extends ViewConfig<any>,
>(id: T, views: [A, B]): AddChild<AddChild<RootConfig<T>, A>, B>;
export function createRoot<T extends string, A extends ViewConfig<any>>(id: T, views: [A]): AddChild<RootConfig<T>, A>;
export function createRoot<T extends string>(id: T, views: ViewConfig<any>[]): RootConfig<T>;
export function createRoot<T extends string>(id: T, views: any[]): RootConfig<T> {
  return new RootConfig<T>(id, views);
}
