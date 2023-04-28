import { Action, Router } from '@remix-run/router';
import { RouteContext, RouteNavigator, RouterContext, PopoutContext } from '../contexts';
import React, { useState } from 'react';
import { DefaultRouteNavigator } from '../default-route-navigator';
import bridge from '@vkontakte/vk-bridge';
import { DefaultNotFound } from './DefaultNotFound';
import { getContextFromState } from '../utils';
import { ViewHistory } from '../view-history';
import { useBlockForwardToModals } from '../hooks/useBlockForwardToModals';
import { STATE_KEY_SHOW_POPOUT } from '../const';

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
  const routeFound = Boolean(routeContext.panelMatch);
  const dataRouterContext = React.useMemo(() => {
    const navigator: RouteNavigator = new DefaultRouteNavigator(router, setPopout);
    return { router, navigator };
  }, [router, setPopout]);
  const isPopoutShown = router.state.location.state?.[STATE_KEY_SHOW_POPOUT];
  return (
    <RouterContext.Provider value={dataRouterContext}>
      <PopoutContext.Provider value={{ popout: isPopoutShown ? popout : null }}>
        {!routeFound && (notFound || <DefaultNotFound navigator={dataRouterContext.navigator} />)}
        {routeFound && <RouteContext.Provider value={routeContext} children={children} />}
      </PopoutContext.Provider>
    </RouterContext.Provider>
  );
}
