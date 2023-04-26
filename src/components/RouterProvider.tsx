import { Action, Location, Router } from '@remix-run/router';
import { RouteContext, RouteNavigator, RouterContext } from '../contexts';
import React, { useState } from 'react';
import { DefaultRouteNavigator } from '../default-route-navigator';
import bridge from '@vkontakte/vk-bridge';
import { DefaultNotFound } from './DefaultNotFound';
import { getContextFromState } from '../utils';
import { ViewHistory } from '../view-history';
import { STATE_KEY_CLEAR_FUTURE } from '../const';

export interface RouterProviderProps {
  router: Router;
  children: any;
  useBridge?: boolean;
  notFound?: React.ReactElement;
}

export function RouterProvider({ router, children, useBridge = true, notFound = undefined }: RouterProviderProps): React.ReactElement {
  const routeContext = getContextFromState(router.state);
  const [panelsHistory, setPanelsHistory] = useState<string[]>([]);
  let inCleaning = false;
  let cleanLocation: Location;
  React.useEffect(() => {
    const viewHistory = new ViewHistory();
    viewHistory.updateNavigation({ ...router.state, historyAction: Action.Push });
    setPanelsHistory(viewHistory.panelsHistory);
    router.subscribe((state) => {
      viewHistory.updateNavigation(state);
      setPanelsHistory(viewHistory.panelsHistory);
    });
    window.addEventListener('popstate', (event) => {
      if (inCleaning) {
        inCleaning = false;
        router.navigate(cleanLocation);
      }
      if (event.state?.usr?.[STATE_KEY_CLEAR_FUTURE] && viewHistory.position) {
        const cleanState = { ...router.state.location.state };
        delete cleanState[STATE_KEY_CLEAR_FUTURE];
        cleanLocation = { ...router.state.location, state: cleanState };
        window.history.back();
        inCleaning = true;
      }
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
