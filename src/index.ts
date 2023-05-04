import { createHashHistory, createRouter, Router as RemixRouter } from '@remix-run/router';
import { createKey } from './utils/utils';
import { ModalWithoutRoot, ModalWithRoot, PanelWithoutRoot, PanelWithRoot } from './type';

export type { RouterProviderProps } from './components/RouterProvider';
export { RouterProvider } from './components/RouterProvider';
export type { RouterContextObject } from './contexts';
export {
  useRouteNavigator,
  useParams,
  usePopout,
} from './hooks/hooks';
export { useSearchParams } from './hooks/useSearchParams';
export { useFirstPageCheck } from './hooks/useFirstPageCheck';
export { useActiveVkuiLocation } from './hooks/useActiveVkuiLocation';
export { withRouter } from './hoc/withRouter';

export function createHashRouter(routes: (PanelWithRoot | ModalWithRoot)[] | (PanelWithoutRoot | ModalWithoutRoot)[]): RemixRouter {
  // Задать новый key для новой локации в случае, если приложение уже запущено,
  // а пользователь делает переход изменив hash в адресной строке браузера.
  window.addEventListener('popstate', (event: PopStateEvent) => {
    if (!event.state) {
      window.history.replaceState({ key: createKey() }, '');
    }
  });
  return createRouter({
    history: createHashHistory(),
    routes: routes.map((item) => ({ ...item, index: true })),
  }).initialize();
}

export { AgnosticDataRouteObject, AgnosticRouteMatch } from '@remix-run/router';
export { RouteNavigator } from './services/routeNavigator.type';
export { RoutesConfig, createView, createRoot, createPanel, createModal } from './page-types';
