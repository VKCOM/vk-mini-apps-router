import { AgnosticDataRouteObject, AgnosticRouteMatch, Params, RouterState } from '@remix-run/router';
import { RouteContextObject } from './contexts';
import { ModalRouteObject, PanelRouteObject, RootRouteObject, ViewRouteObject } from './type';

export function resolveRouteToPath(route: AgnosticDataRouteObject, routes: AgnosticDataRouteObject[], params: Params = {}): string {
  const parentRoutes = route.id
    .split('-')
    .reduce<AgnosticDataRouteObject[]>((acc, id) => {
    if (!acc.length) {
      acc.push(routes[parseInt(id)]);
    } else {
      const child = acc[acc.length - 1]?.children?.[parseInt(id)];
      if (child) acc.push(child);
    }
    return acc;
  }, []);
  const pathFromRoute = parentRoutes
    .map((route) => route.path)
    .filter(Boolean)
    .map((path) => path?.replace(/^\//, '').replace(/\/$/, ''))
    .join('/');
  const parameters = pathFromRoute
    .match(/\/:[^\/]+/g)
    ?.map((param) => param.replace('/', ''));
  const paramInjector = (acc: string, param: string): string => {
    const paramName = param.replace(':', '');
    if (!params[paramName]) {
      throw new Error(`Missing parameter ${paramName} while building route ${pathFromRoute}`);
    }
    return acc.replace(param, params[paramName] as string);
  };
  return parameters ? parameters.reduce(paramInjector, pathFromRoute) : pathFromRoute;
}

export function getContextFromState(state: RouterState): RouteContextObject {
  const rootMatch = state.matches.find((item) => 'root' in item.route);
  const viewMatch = state.matches.find((item) => 'view' in item.route);
  const panelMatch = state.matches.find((item) => 'panel' in item.route);
  const modalMatch = state.matches.find((item) => 'modal' in item.route);
  return {
    state,
    rootMatch: rootMatch as AgnosticRouteMatch<string, RootRouteObject>,
    viewMatch: viewMatch as AgnosticRouteMatch<string, ViewRouteObject>,
    panelMatch: panelMatch as AgnosticRouteMatch<string, PanelRouteObject>,
    modalMatch: modalMatch as AgnosticRouteMatch<string, ModalRouteObject>,
    panelsHistory: [],
  };
}
