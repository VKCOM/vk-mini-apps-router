import { ViewRouteObject } from './type';
import { createHashHistory, createRouter, Router as RemixRouter } from '@remix-run/router';

export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export type { RouterContextObject } from './contexts';
export {
  useRouterContext,
  useActiveVkuiLocation,
  usePanelParams,
  useModalParams,
  useModalParentRoute,
} from './hooks';

export function createHashRouter(
  routes: ViewRouteObject[],
): RemixRouter {
  return createRouter({
    history: createHashHistory(),
    routes,
  }).initialize();
}
