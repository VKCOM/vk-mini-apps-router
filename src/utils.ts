import { AgnosticDataRouteObject, Params } from '@remix-run/router';

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
