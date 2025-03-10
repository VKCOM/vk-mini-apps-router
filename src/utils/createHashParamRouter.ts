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
  /*
   * ВНИМАНИЕ:
   * Если вы передаете пользовательский `paramName`, необходимо также обновить обработчик в RouterProvider,
   * который подписывается на события bridge VKWebAppChangeFragment.
   *
   * Сейчас в обработчике используется жестко заданное имя параметра DEFAULT_PATH_PARAM_NAME:
   *   const pathFromHash = hashParams.get(DEFAULT_PATH_PARAM_NAME);
   *
   * При использовании кастомного `paramName` эта строка должна быть изменена на:
   *   const pathFromHash = hashParams.get(paramName);
   *
   * Это необходимо для корректной работы интеграции с VK Bridge.
   */
  return createRouter({
    history,
    routes: routes.map((item) => ({ ...item, index: true })),
  }).initialize();
}
