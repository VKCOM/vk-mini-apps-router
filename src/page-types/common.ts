import { Params } from "@remix-run/router";
import { ExtendedPathWithParams } from "../services";

export type WithChildren<Target extends {}, Children extends {}> = Target & {
  [key in keyof Children]: Children[key];
};

export interface HasId<T extends string = string> {
  id: T;
}

export interface HasChildren<T extends {}> {
  get children(): T[];
}

export interface RepresentsRoutes<T> {
  getRoutes(): T[];
}

export type GetId<Obj extends HasId> = Obj extends { id: infer X } ? X : never;

export type AddChild<Target extends {}, V extends HasId> = WithChildren<Target, { [key in UniqueKey<Target, GetId<V>>]: V }>;

export interface Page {
  path: string;
  hasParams: false;
}

export type WithParams<T extends string> = {
  paramKeys: readonly T[];
};

export interface PageWithParams<T extends string> extends WithParams<T> {
  path: string;
  hasParams: true;
}

type IsEmptyKey<K extends string> = '' extends K ? true : false;
type KeyExists<Obj, K extends string> = K extends keyof Obj ? true : false;
type KeyWithZeroExists<Obj, K extends string> = `${K}_0` extends keyof Obj ? true : false;

type UniqueKey<Obj extends {}, K extends string> =
  IsEmptyKey<K> extends true
    ? K
    : KeyExists<Obj, K> extends true
      ? KeyWithZeroExists<Obj, K> extends true
        ? UniqueKey<Obj, `${K}_0`>
        : `${K}_0`
      : K;

export function uniqueKey<Obj extends {}, K extends string>(target: Obj, key: K): UniqueKey<Obj, K> {
  if (key && key.length && typeof target === 'object') {
    if (target.hasOwnProperty(key)) {
      const extendedKey = `${key}_0`;
      return (target.hasOwnProperty(extendedKey) ? uniqueKey(target, extendedKey) : extendedKey) as UniqueKey<Obj, K>;
    }
  }
  return key as UniqueKey<Obj, K>;
}

export type InjectParamsIfNeeded<T, Base extends object> = T extends (PageWithParams<infer U> | ExtendedPathWithParams<infer U>)
  ? Base & { params: Params<U> }
  : Base & { params?: Params };
