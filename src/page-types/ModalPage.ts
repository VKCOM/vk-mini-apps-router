import { HasId, Page, PageWithParams, RepresentsRoutes } from './common';
import { CommonRouteObject } from '../type';

interface ModalRoutePartial extends CommonRouteObject {
  modal: string;
}

export class ModalPage<I extends string>
  implements Page, RepresentsRoutes<ModalRoutePartial>, HasId<I>
{
  hasParams: false = false;
  constructor(public id: I, public path: string) {}

  getRoutes(): ModalRoutePartial[] {
    return [
      {
        path: this.path,
        modal: this.id,
      },
    ];
  }
}

export class ModalPageWithParams<I extends string, T extends string>
  implements PageWithParams<T>, RepresentsRoutes<ModalRoutePartial>, HasId<I>
{
  hasParams: true = true;
  constructor(public id: I, public path: string, public paramKeys: readonly T[]) {}

  getRoutes(): ModalRoutePartial[] {
    return [
      {
        path: this.path,
        modal: this.id,
      },
    ];
  }
}

export function createModal<T extends string>(id: T, path: string): ModalPage<T>;
export function createModal<T extends string, P extends string>(
  id: T,
  path: string,
  paramKeys: readonly P[],
): ModalPageWithParams<T, P>;
export function createModal<T extends string, P extends string>(
  id: T,
  path: string,
  paramKeys?: readonly P[],
): ModalPage<T> | ModalPageWithParams<T, P> {
  if (paramKeys) {
    return new ModalPageWithParams(id, path, paramKeys);
  }
  return new ModalPage(id, path);
}

export type AnyModalPage = ModalPage<string> | ModalPageWithParams<string, string>;
