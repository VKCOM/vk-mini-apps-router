import {
  AgnosticRouteMatch,
  createPath,
  Location,
  Params,
  Path,
  RouterState,
} from '@remix-run/router';
import { RouteContextObject } from '../contexts';
import { PageInternal } from '../type';
import { STATE_KEY_SHOW_MODAL, STATE_KEY_SHOW_POPOUT } from '../const';
import { ExtendedPath, ExtendedPathWithParams, NavigationTarget } from '../services';
import { Page, PageWithParams } from '../page-types/common';

export const isString = (tmp: unknown): tmp is string => typeof tmp === 'string';

export const isPageObject = (path: NavigationTarget): path is Page | PageWithParams<string> => {
  return typeof path === 'object' && 'path' in path;
};

export const isPageWithOptionsPath = (
  path: NavigationTarget,
): path is Partial<Path> | ExtendedPathWithParams<string> | ExtendedPath => {
  return typeof path === 'object' && !isPageObject(path);
};

export function getParamKeys(path: string | undefined): string[] {
  return path?.match(/\/:[^\/]+/g)?.map((param) => param.replace('/', '')) ?? [];
}

export function fillParamsIntoPath(path: string, params?: Params): string {
  const parameters = getParamKeys(path);
  const paramInjector = (acc: string, param: string): string => {
    const paramName = param.replace(':', '');
    invariant(params?.[paramName], `Missing parameter ${paramName} while building route ${path}`);
    return acc.replace(param, params[paramName] as string);
  };
  return parameters.reduce(paramInjector, path);
}

export function getRouteContext(
  state: RouterState,
  panelsHistory: string[] = [],
): RouteContextObject {
  return {
    state,
    match: state.matches.length
      ? (state.matches[state.matches.length - 1] as AgnosticRouteMatch<string, PageInternal>)
      : undefined,
    panelsHistory: panelsHistory,
  };
}

export function isModalShown(location: Location): boolean {
  return location.state && STATE_KEY_SHOW_MODAL in location.state;
}

export function isPopoutShown(location: Location): boolean {
  return location.state && STATE_KEY_SHOW_POPOUT in location.state;
}

export function createKey() {
  const allNumbersAndLetters = 36;
  const positionAfterZeroAnDot = 2;
  const keyLength = 7;
  return Math.random()
    .toString(allNumbersAndLetters)
    .substring(positionAfterZeroAnDot, positionAfterZeroAnDot + keyLength);
}

export function getDisplayName(WrappedComponent: { displayName?: string; name?: string }) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function warning(cond: any, message: string) {
  if (!cond) {
    if (typeof console !== 'undefined') console.warn(message);

    try {
      throw new Error(message);
    } catch (e) {}
  }
}

export function invariant(value: boolean, message?: string): asserts value;

export function invariant<T>(value: T | null | undefined, message?: string): asserts value is T;

export function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    throw new Error(message);
  }
}

export function extractPathFromNavigationTarget(to: NavigationTarget, defaultPathname = '') {
  if (isString(to)) {
    return to;
  }

  const path = isPageObject(to) ? to.path : to.pathname || defaultPathname;

  if (isString(path)) {
    return path;
  }

  return path.path;
}

export function transformSearchParams(
  searchParams: URLSearchParams | Record<string, string> | string = '',
) {
  if (!isString(searchParams) && !(searchParams instanceof URLSearchParams)) {
    return `${new URLSearchParams(searchParams)}`;
  }

  return searchParams.toString();
}

export function getPathFromTo({
  to,
  params,
  defaultPathname = '',
}: {
  to: NavigationTarget;
  params?: Params;
  defaultPathname?: string;
}) {
  const path = extractPathFromNavigationTarget(to, defaultPathname);
  const search = isPageWithOptionsPath(to) ? transformSearchParams(to.search) : '';
  const hasParams = getParamKeys(path).length > 0;

  if (hasParams) {
    const filledPath = fillParamsIntoPath(path, params);

    return isPageWithOptionsPath(to)
      ? createPath({ ...to, pathname: filledPath, search })
      : filledPath;
  }

  return isPageWithOptionsPath(to) ? createPath({ ...to, pathname: path, search }) : path;
}
