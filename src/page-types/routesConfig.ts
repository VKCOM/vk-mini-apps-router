import { RootConfig } from './rootConfig';
import { ViewConfig } from './viewConfig';
import { AddChild, RepresentsRoutes, uniqueKey } from './common';
import { CommonRouteObject } from '../type';

interface RoutePartial extends CommonRouteObject {
  root?: string;
  view: string;
  panel: string;
  modal?: string;
}

export class RoutesConfig implements RepresentsRoutes<RoutePartial> {
  private items: ViewConfig<string>[] | RootConfig<string>[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  getRoutes(): RoutePartial[] {
    return this.items.map((item) => item.getRoutes()).flat();
  }

  static create<A extends RootConfig<string>, B extends RootConfig<string>>(routes: [A, B]): AddChild<AddChild<RoutesConfig, A>, B>
  static create<A extends RootConfig<string>>(routes: [A]): AddChild<RoutesConfig, A>
  static create<A extends ViewConfig<string>, B extends ViewConfig<string>>(routes: [A, B]): AddChild<AddChild<RoutesConfig, A>, B>
  static create<A extends ViewConfig<string>>(routes: [A]): AddChild<RoutesConfig, A>
  static create(routes: ViewConfig<string>[] | RootConfig<string>[]): RoutesConfig {
    const config = new RoutesConfig();
    config.items = routes;
    routes.forEach((route) => {
      // @ts-expect-error
      config[uniqueKey(config, route.id)] = route;
    });
    return config;
  }
}
