import { Action, Router } from '@remix-run/router';
import { PopoutContext, RouteContext, RouterContext, ThrottledContext } from '../contexts';
import { ReactElement, useEffect, useMemo, useState } from 'react';
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
import { RouteLeaf } from '../type';

export interface RouterProviderProps {
  router: Router;
  children: any;
  useBridge?: boolean;
  notFound?: ReactElement;
  throttled?: boolean;
  interval?: number;
  hierarchy?: RouteLeaf[];
}

export function RouterProvider({
  router,
  children,
  useBridge = true,
  notFound = undefined,
  throttled = true,
  interval = 400,
  hierarchy,
}: RouterProviderProps): ReactElement {
  const forceUpdate = useForceUpdate();
  const [popout, setPopout] = useState<JSX.Element | null>(null);
  const [viewHistory] = useState<ViewHistory>(new ViewHistory());
  const [panelsHistory, setPanelsHistory] = useState<string[]>([]);
  const [transactionExecutor, setTransactionExecutor] = useState<TransactionExecutor>(
    new TransactionExecutor(forceUpdate),
  );
  const isPopoutShown = router.state.location.state?.[STATE_KEY_SHOW_POPOUT];

  const dataRouterContext = useMemo(() => {
    const routeNavigator: RouteNavigator = new DefaultRouteNavigator(
      router,
      viewHistory,
      transactionExecutor,
      setPopout,
    );
    return { router, routeNavigator, viewHistory };
  }, [router, setPopout, viewHistory]);

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
  }, [router, viewHistory]);

  useEffect(() => {
    viewHistory.resetHistory();
    const executor = new TransactionExecutor(forceUpdate);
    setTransactionExecutor(executor);
    const searchParams = createSearchParams(router.state.location.search);
    const enableFilling = Boolean(searchParams.get(SEARCH_PARAM_INFLATE));
    hierarchy &&
      enableFilling &&
      fillHistory(hierarchy, dataRouterContext.routeNavigator, routeContext, executor);
  }, [router]);

  const routeNotFound = Boolean(
    !routeContext.match ||
      (routeContext.state.errors &&
        routeContext.state.errors[routeContext.match.route.id] &&
        routeContext.state.errors[routeContext.match.route.id].status === 404),
  );

  return (
    <RouterContext.Provider value={dataRouterContext}>
      <ThrottledContext.Provider value={throttlingOptions}>
        <PopoutContext.Provider value={dataPopoutContext}>
          {routeNotFound &&
            (notFound || <DefaultNotFound routeNavigator={dataRouterContext.routeNavigator} />)}
          {!routeNotFound && <RouteContext.Provider value={routeContext} children={children} />}
        </PopoutContext.Provider>
      </ThrottledContext.Provider>
    </RouterContext.Provider>
  );
}
