import { RootRouteObject, ViewRouteObject } from './type';
import { createHashHistory, createRouter, Router as RemixRouter } from '@remix-run/router';
import { createKey } from './utils';

export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export type { RouterContextObject } from './contexts';
export {
  useRouterContext,
  usePanelParams,
  useModalParams,
  usePopout,
} from './hooks/hooks';
export { useSearchParams } from './hooks/useSearchParams';
export { useActiveVkuiLocation } from './hooks/useActiveVkuiLocation';

export function createHashRouter(routes: RootRouteObject[] | ViewRouteObject[]): RemixRouter {
  // Задать новый key для новой локации в случае, если приложение уже запущено,
  // а пользователь делает переход изменив hash в адресной строке браузера.
  window.addEventListener('popstate', (event: PopStateEvent) => {
    if (!event.state) {
      window.history.replaceState({ key: createKey() }, '');
    }
  });
  return createRouter({
    history: createHashHistory(),
    routes,
  }).initialize();
}

export { AgnosticDataRouteObject, AgnosticRouteMatch } from '@remix-run/router';
export { RouteNavigator } from './services/routeNavigator.type';