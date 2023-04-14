import { Action, Router } from '@remix-run/router';
import { RouteContext, RouteNavigator, RouterContext } from '../contexts';
import React, { useState } from 'react';
import { DefaultRouteNavigator } from '../default-route-navigator';
import bridge from '@vkontakte/vk-bridge';
import { DefaultNotFound } from './DefaultNotFound';
import { getContextFromState } from '../utils';
import { ViewHistory } from '../view-history';

export interface RouterProviderProps {
  router: Router;
  children: any;
  useBridge?: boolean;
  notFound?: React.ReactElement;
}

export function RouterProvider({ router, children, useBridge = true, notFound = undefined }: RouterProviderProps): React.ReactElement {
  const routeContext = getContextFromState(router.state);
  const [panelsHistory, setPanelsHistory] = useState<string[]>([]);
  React.useEffect(() => {
    const viewHistory = new ViewHistory();
    viewHistory.updateNavigation({ ...router.state, historyAction: Action.Push });
    setPanelsHistory(viewHistory.panelsHistory);
    router.subscribe((state) => {
      viewHistory.updateNavigation(state);
      setPanelsHistory(viewHistory.panelsHistory);
    });
    if (useBridge) {
      router.subscribe((state) => {
        const location = `${state.location.pathname}${state.location.search}${state.location.hash}`;
        bridge.send('VKWebAppSetLocation', { location, replace_state: true });
      });
    }
  }, [router]);
  routeContext.panelsHistory = panelsHistory;
  const routeFound = Boolean(routeContext.panelMatch);
  const dataRouterContext = React.useMemo(() => {
    const navigator: RouteNavigator = new DefaultRouteNavigator(router);
    return { router, navigator };
  }, [router]);
  return (
    <RouterContext.Provider value={dataRouterContext}>
      {!routeFound && (notFound || <DefaultNotFound navigator={dataRouterContext.navigator} />)}
      {routeFound && <RouteContext.Provider value={routeContext} children={children} />}
    </RouterContext.Provider>
  );
}
