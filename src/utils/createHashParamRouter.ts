import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { createKey } from './utils';
import { createRouter } from '@remix-run/router';
import { RouteWithoutRoot, RouteWithRoot } from '../type';
import { InitialLocation } from '../services/InitialLocation';
import { createHashParamHistory } from './react-router-override/HashParamHistory';

export function createHashParamRouter(routes: RouteWithRoot[] | RouteWithoutRoot[]): RemixRouter {
  // Задать новый key для новой локации в случае, если приложение уже запущено,
  // а пользователь делает переход изменив hash в адресной строке браузера.
  window.addEventListener('popstate', (event: PopStateEvent) => {
    if (!event.state) {
      window.history.replaceState({ key: createKey() }, '');
    }
  });
  const history = createHashParamHistory();
  InitialLocation.init(history.location);
  return createRouter({
    history,
    routes: routes.map((item) => ({ ...item, index: true })),
  }).initialize();
}
