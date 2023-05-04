import { ViewConfig } from './viewConfig';
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

export function createRoot<T extends string,
  A extends ViewConfig<any>,
  B extends ViewConfig<any>,
>(id: T, views: [A, B]): AddChild<AddChild<RootConfig<T>, A>, B>;
export function createRoot<T extends string, A extends ViewConfig<any>>(id: T, views: [A]): AddChild<RootConfig<T>, A>;
export function createRoot<T extends string>(id: T, views: ViewConfig<any>[]): RootConfig<T>;
export function createRoot<T extends string>(id: T, views: any[]): RootConfig<T> {
  return new RootConfig<T>(id, views);
}
