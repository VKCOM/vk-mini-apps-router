import { Action, Router } from '@remix-run/router';
import { PopoutContext, RouteContext, RouterContext, ThrottledContext } from '../contexts';
import { ReactElement, useEffect, useMemo, useState, ReactNode, useRef } from 'react';
import { DefaultRouteNavigator } from '../services/DefaultRouteNavigator';
import bridge from '@vkontakte/vk-bridge';
import { DefaultNotFound } from './DefaultNotFound';
import { getRouteContext, useForceUpdate } from '../utils/utils';
import { ViewHistory } from '../services/ViewHistory';
import { useBlockForwardToModals } from '../hooks/useBlockForwardToModals';
import { SEARCH_PARAM_INFLATE, STATE_KEY_SHOW_POPOUT } from '../const';
import { RouteNavigator } from '../services/RouteNavigator.type';
import { TransactionExecutor } from '../services/TransactionExecutor';
import { fillHistory } from '../utils/fillHistory';
import { createSearchParams } from '../utils/createSearchParams';
import { RouteLeaf, RouteWithRoot } from '../type';

export interface RouterProviderProps {
  router: Router;
  children: ReactNode;
  interval?: number;
  useBridge?: boolean;
  throttled?: boolean;
  fallbackUrl?: string;
  notFound?: ReactNode;
  hierarchy?: RouteLeaf[];
  showInvalidUrlPage?: boolean;
}

export function RouterProvider({
  router,
  children,
  notFound,
  hierarchy,
  fallbackUrl,
  interval = 400,
  useBridge = true,
  throttled = true,
  showInvalidUrlPage = true,
}: RouterProviderProps): ReactElement {
  const forceUpdate = useForceUpdate();
  const [popout, setPopout] = useState<JSX.Element | null>(null);
  const [viewHistory] = useState<ViewHistory>(new ViewHistory());
  const [panelsHistory, setPanelsHistory] = useState<string[]>([]);
  const [transactionExecutor, setTransactionExecutor] = useState<TransactionExecutor>(
    new TransactionExecutor(forceUpdate),
  );
  const showDefaultNotFoundForce = useRef(false);
  const isPopoutShown = router.state.location.state?.[STATE_KEY_SHOW_POPOUT];
  const dataRouterContext = useMemo(() => {
    const routeNavigator: RouteNavigator = new DefaultRouteNavigator(
      router,
      viewHistory,
      transactionExecutor,
      setPopout,
    );
    return { router, routeNavigator, viewHistory };
  }, [router, viewHistory, transactionExecutor, setPopout]);

  const throttlingOptions = useMemo(() => {
    return {
      enabled: throttled || Boolean(transactionExecutor.initialDelay),
      firstActionDelay: transactionExecutor.initialDelay,
      interval,
    };
  }, [transactionExecutor.initialDelay, interval, throttled]);

  const routeContext = useMemo(
    () => getRouteContext(router.state, panelsHistory),
    [router.state, panelsHistory],
  );

  const dataPopoutContext = useMemo(() => {
    return { popout: isPopoutShown ? popout : null };
  }, [isPopoutShown, popout]);

  useBlockForwardToModals(router, viewHistory);
  useEffect(() => {
    viewHistory.resetHistory();
    viewHistory.updateNavigation({ ...router.state, historyAction: Action.Push });
    setPanelsHistory(viewHistory.panelsHistory);

    router.subscribe((state) => {
      viewHistory.updateNavigation(state);
      setPanelsHistory(viewHistory.panelsHistory);
      transactionExecutor.doNext();
    });

    if (useBridge) {
      bridge.subscribe((event) => {
        if (event.detail.type === 'VKWebAppChangeFragment') {
          router.navigate(event.detail.data.location, { replace: true });
        }
      });
      router.subscribe((state) => {
        const location = router.createHref(state.location).replace(/^#/, '');
        bridge.send('VKWebAppSetLocation', { location, replace_state: true });
      });
    }

    const executor = new TransactionExecutor(forceUpdate);
    setTransactionExecutor(executor);
    const searchParams = createSearchParams(router.state.location.search);
    const enableFilling = Boolean(searchParams.get(SEARCH_PARAM_INFLATE));
    if (hierarchy && enableFilling)
      fillHistory(hierarchy, dataRouterContext.routeNavigator, routeContext, executor);
  }, [router]);

  const routeNotFound = Boolean(
    !routeContext.match ||
      (routeContext.state.errors &&
        routeContext.state.errors[routeContext.match.route.id] &&
        routeContext.state.errors[routeContext.match.route.id].status === 404),
  );
  let showDefaultNotFound = false

  if (routeNotFound && fallbackUrl) {
    if (fallbackUrl === router.state.location.pathname) {
      console.warn('Некорректный fallbackUrl');
      showDefaultNotFound = true
    } else {
      dataRouterContext.routeNavigator.replace(fallbackUrl);
      const userRoutes = router.routes as unknown as RouteWithRoot[];
      const lastPanelName = panelsHistory[dataRouterContext.viewHistory.position - 1];
      const lastPath = userRoutes.find((route) => route.panel === lastPanelName)?.path;
      if (fallbackUrl === lastPath) dataRouterContext.routeNavigator.back();
    }
  } else if (routeNotFound) {
    if (!showInvalidUrlPage) {
      dataRouterContext.routeNavigator.back();
      showDefaultNotFoundForce.current = true;
    }
    showDefaultNotFound = true
  } else if (showDefaultNotFoundForce.current) {
    showDefaultNotFound = true
    showDefaultNotFoundForce.current = false
  }

  return (
    <RouterContext.Provider value={dataRouterContext}>
      <ThrottledContext.Provider value={throttlingOptions}>
        <PopoutContext.Provider value={dataPopoutContext}>
          {showDefaultNotFound &&
            (notFound || <DefaultNotFound routeNavigator={dataRouterContext.routeNavigator} />)}
          {!showDefaultNotFound && <RouteContext.Provider value={routeContext} children={children} />}
        </PopoutContext.Provider>
      </ThrottledContext.Provider>
    </RouterContext.Provider>
  );
}
