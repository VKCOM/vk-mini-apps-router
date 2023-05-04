import { Action, Router } from '@remix-run/router';
import { RouteContext, RouterContext, PopoutContext } from '../contexts';
import React, { useState } from 'react';
import { DefaultRouteNavigator } from '../services/defaultRouteNavigator';
import bridge from '@vkontakte/vk-bridge';
import { DefaultNotFound } from './DefaultNotFound';
import { getContextFromState } from '../utils/utils';
import { ViewHistory } from '../services/viewHistory';
import { useBlockForwardToModals } from '../hooks/useBlockForwardToModals';
import { STATE_KEY_SHOW_POPOUT } from '../const';
import { RouteNavigator } from '../services/routeNavigator.type';

export interface RouterProviderProps {
  router: Router;
  children: any;
  useBridge?: boolean;
  notFound?: React.ReactElement;
}

export function RouterProvider({ router, children, useBridge = true, notFound = undefined }: RouterProviderProps): React.ReactElement {
  const routeContext = getContextFromState(router.state);
  const [panelsHistory, setPanelsHistory] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<ViewHistory>(new ViewHistory());
  const [popout, setPopout] = useState<JSX.Element | null>(null);

  useBlockForwardToModals(router, viewHistory);

  React.useEffect(() => {
    setViewHistory(new ViewHistory());
  }, [router, setViewHistory]);
  React.useEffect(() => {
    viewHistory.updateNavigation({ ...router.state, historyAction: Action.Push });
    setPanelsHistory(viewHistory.panelsHistory);
    router.subscribe((state) => {
      viewHistory.updateNavigation(state);
      setPanelsHistory(viewHistory.panelsHistory);
    });
    if (useBridge) {
      bridge.subscribe((event) => {
        if (event.detail.type === 'VKWebAppChangeFragment') {
          router.navigate(event.detail.data.location, { replace: true });
        }
      });
      router.subscribe((state) => {
        const location = `${state.location.pathname}${state.location.search}${state.location.hash}`;
        bridge.send('VKWebAppSetLocation', { location, replace_state: true });
      });
    }
  }, [router, viewHistory]);
  routeContext.panelsHistory = panelsHistory;
  const routeNotFound = Boolean(!routeContext.match ||
    routeContext.state.errors && routeContext.state.errors[routeContext.match.route.id] &&
      routeContext.state.errors[routeContext.match.route.id].status === 404);
  const dataRouterContext = React.useMemo(() => {
    const routeNavigator: RouteNavigator = new DefaultRouteNavigator(router, setPopout);
    return { router, routeNavigator, viewHistory };
  }, [router, setPopout, viewHistory]);
  const isPopoutShown = router.state.location.state?.[STATE_KEY_SHOW_POPOUT];
  return (
    <RouterContext.Provider value={dataRouterContext}>
      <PopoutContext.Provider value={{ popout: isPopoutShown ? popout : null }}>
        {routeNotFound && (notFound || <DefaultNotFound routeNavigator={dataRouterContext.routeNavigator} />)}
        {!routeNotFound && <RouteContext.Provider value={routeContext} children={children} />}
      </PopoutContext.Provider>
    </RouterContext.Provider>
  );
}
