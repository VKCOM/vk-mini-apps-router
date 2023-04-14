import { AgnosticRouteMatch, matchRoutes, Router } from '@remix-run/router';
import { RouteContext, RouteContextObject, RouteNavigator, RouterContext } from '../contexts';
import React from 'react';
import { DefaultRouteNavigator } from '../default-route-navigator';
import { ModalRouteObject, PanelRouteObject, ViewRouteObject } from '../type';
import { useForceUpdate } from '../hooks';
import bridge from '@vkontakte/vk-bridge';
import { DefaultNotFound } from './DefaultNotFound';

export interface RouterProviderProps {
  router: Router;
  children: any;
  useBridge?: boolean;
  notFound?: React.ReactElement;
}

export function RouterProvider({ router, children, useBridge = true, notFound = undefined }: RouterProviderProps): React.ReactElement {
  const forceUpdate = useForceUpdate();
  React.useEffect(() => {
    router.subscribe(forceUpdate);
    if (useBridge) {
      router.subscribe((state) => {
        const location = `${state.location.pathname}${state.location.search}${state.location.hash}`;
        bridge.send('VKWebAppSetLocation', { location, replace_state: true });
      });
    }
  }, [router]);
  const location = router.state.location;
  const matches = matchRoutes<ViewRouteObject | PanelRouteObject | ModalRouteObject>(router.routes as ViewRouteObject[], location);
  const routeContext: RouteContextObject = {
    viewMatch: matches?.[0] as AgnosticRouteMatch<string, ViewRouteObject>,
    panelMatch: matches?.[1] as AgnosticRouteMatch<string, PanelRouteObject>,
    modalMatch: matches?.[2] as AgnosticRouteMatch<string, ModalRouteObject>,
  };
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
