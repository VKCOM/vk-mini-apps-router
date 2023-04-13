import { ViewRouteObject } from './type';
import { createHashHistory, createRouter, Router as RemixRouter } from '@remix-run/router';

export type { RouterProviderProps } from './components';
export { RouterProvider } from './components';
export type { RouterContextObject } from './contexts';
export {
  useRouterContext,
  useActiveVkuiLocation,
  usePanelParams,
} from './hooks';

export function createHashRouter(
  routes: ViewRouteObject[],
): RemixRouter {
  return createRouter({
    history: createHashHistory(),
    routes,
  }).initialize();
}
