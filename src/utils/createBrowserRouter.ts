import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { createKey } from './utils';
import { createBrowserHistory, createRouter } from '@remix-run/router';
import { RouteWithoutRoot, RouteWithRoot } from '../type';
import { InitialLocation } from '../services/InitialLocation';

export function createBrowserRouter(routes: RouteWithRoot[] | RouteWithoutRoot[]): RemixRouter {
  // Задать новый key для новой локации в случае, если приложение уже запущено,
  // а пользователь делает переход изменив hash в адресной строке браузера.
  window.addEventListener('popstate', (event: PopStateEvent) => {
    if (!event.state) {
      window.history.replaceState({ key: createKey() }, '');
    }
  });
  const history = createBrowserHistory();
  InitialLocation.init(history.location);
  return createRouter({
    history,
    routes: routes.map((item) => ({ ...item, index: true })),
  }).initialize();
}
