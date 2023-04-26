import { RootRouteObject, ViewRouteObject } from './type';
import { createHashHistory, createRouter, Router as RemixRouter } from '@remix-run/router';

export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export type { RouterContextObject, RouteNavigator } from './contexts';
export {
  useRouterContext,
  usePanelParams,
  useModalParams,
} from './hooks/hooks';
export { useSearchParams } from './hooks/useSearchParams';
export { useActiveVkuiLocation } from './hooks/useActiveVkuiLocation';

export function createHashRouter(routes: RootRouteObject[] | ViewRouteObject[]): RemixRouter {
  return createRouter({
    history: createHashHistory(),
    routes,
  }).initialize();
}

export { AgnosticDataRouteObject, AgnosticRouteMatch } from '@remix-run/router';