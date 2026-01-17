import { ReactElement, ReactNode, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Action, Router } from '@remix-run/router';
import bridge from '@vkontakte/vk-bridge';
import {
  DEFAULT_PATH_PARAM_NAME,
  SEARCH_PARAM_INFLATE,
  STATE_KEY_SHOW_POPOUT,
  UNIVERSAL_URL,
} from '../const';
import { PopoutContext, RouteContext, RouterContext } from '../contexts';
import { getRouteContext, fillHistory, createSearchParams, getHrefWithoutHash } from '../utils';
import {
  DefaultRouteNavigator,
  ContextThrottleService,
  TransactionExecutor,
  RouteNavigator,
  ViewHistory,
} from '../services';
import { useBlockForwardToModals } from '../hooks/useBlockForwardToModals';
import { DefaultNotFound } from './DefaultNotFound';
import { RouteLeaf } from '../type';

export interface RouterProviderProps {
  router: Router;
  children: ReactNode;
  interval?: number;
  useBridge?: boolean;
  throttled?: boolean;
  hierarchy?: RouteLeaf[];
  notFound?: ReactNode;
  notFoundRedirectPath?: string;
}

export function RouterProvider({
  router,
  children,
  notFound,
  hierarchy,
  notFoundRedirectPath,
  interval = 400,
  useBridge = true,
  throttled = true,
}: RouterProviderProps): ReactElement {
  const [popout, setPopout] = useState<JSX.Element | null>(null);
  const [viewHistory] = useState<ViewHistory>(new ViewHistory());
  const [panelsHistory, setPanelsHistory] = useState<string[]>([]);
  const isPopoutShown = router.state.location.state?.[STATE_KEY_SHOW_POPOUT];

  const dataRouterContext = useMemo(() => {
    const routeNavigator: RouteNavigator = new DefaultRouteNavigator(
      router,
      viewHistory,
      setPopout,
    );
    return { router, routeNavigator, viewHistory };
  }, [router, viewHistory, setPopout]);

  const routeContext = useMemo(
    () => getRouteContext(router.state, panelsHistory),
    [router.state, panelsHistory],
  );

  const dataPopoutContext = useMemo(() => {
    return { popout: isPopoutShown ? popout : null };
  }, [isPopoutShown, popout]);

  useBlockForwardToModals(router, viewHistory, dataRouterContext.routeNavigator);
  useEffect(() => {
    // Отключаем браузерное восстановление скролла, используем решения от VKUI
    history.scrollRestoration = 'manual';

    TransactionExecutor.resetTransactions();
    viewHistory.resetHistory();
    viewHistory.updateNavigation({ ...router.state, historyAction: Action.Push });
    setPanelsHistory(viewHistory.panelsHistory);

    router.subscribe((state) => {
      viewHistory.updateNavigation(state);
      setPanelsHistory(viewHistory.panelsHistory);
      TransactionExecutor.doNext();
    });

    if (useBridge) {
      bridge.subscribe(({ detail }) => {
        if (detail.type !== 'VKWebAppChangeFragment') {
          return;
        }

        const location = detail.data.location;
        const hashParams = new URLSearchParams(location);
        const pathFromHash = hashParams.get(DEFAULT_PATH_PARAM_NAME);
        const to = pathFromHash || location || '/';

        router.navigate(to, { replace: true });
      });

      router.subscribe((state) => {
        const href = router.createHref(state.location);
        const hrefWithoutHash = getHrefWithoutHash();
        const location = href.replace(hrefWithoutHash, '').replace(/^#/, '');
        bridge.send('VKWebAppSetLocation', { location, replace_state: true });
      });
    }

    const searchParams = createSearchParams(router.state.location.search);
    const enableFilling = Boolean(searchParams.get(SEARCH_PARAM_INFLATE));
    if (hierarchy && enableFilling) {
      fillHistory(hierarchy, dataRouterContext.routeNavigator, routeContext);
    }
  }, [router]);

  useLayoutEffect(() => {
    ContextThrottleService.updateThrottledServiceSettings({
      interval,
      throttled,
    });
  }, [interval, throttled]);

  const routeNotFound = Boolean(
    !routeContext.match ||
      (routeContext.state.errors &&
        routeContext.state.errors[routeContext.match.route.id] &&
        routeContext.state.errors[routeContext.match.route.id].status === 404),
  );

  if (notFoundRedirectPath && (routeNotFound || routeContext.match?.route.path === UNIVERSAL_URL)) {
    if (router.state.location.pathname === notFoundRedirectPath) {
      console.warn('Incorrect notFoundRedirectPath');
    } else dataRouterContext.routeNavigator.replace(notFoundRedirectPath);
  }

  return (
    <RouterContext.Provider value={dataRouterContext}>
      <PopoutContext.Provider value={dataPopoutContext}>
        {routeNotFound &&
          (notFound || <DefaultNotFound routeNavigator={dataRouterContext.routeNavigator} />)}
        {!routeNotFound && <RouteContext.Provider value={routeContext} children={children} />}
      </PopoutContext.Provider>
    </RouterContext.Provider>
  );
}
