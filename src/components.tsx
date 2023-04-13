import { matchRoutes, Router } from '@remix-run/router';
import { ActiveVkuiLocationContext, ActiveVkuiLocationObject, RouteNavigator, RouterContext } from './contexts';
import React from 'react';
import { DefaultRouteNavigator } from './default-route-navigator';
import { PanelRouteObject, ViewRouteObject } from './type';
import { useForceUpdate } from './hooks';

export interface RouterProviderProps {
  router: Router;
  children: any;
}

export function RouterProvider({ router, children }: RouterProviderProps): React.ReactElement {
  const forceUpdate = useForceUpdate();
  React.useEffect(() => {
    router.subscribe(forceUpdate);
  }, [router]);
  const location = router.state.location;
  const matches = matchRoutes<ViewRouteObject | PanelRouteObject>(router.routes as ViewRouteObject[], location);
  const viewMatch = matches?.[0];
  const panelMatch = matches?.[1];
  const activeLocation: ActiveVkuiLocationObject = {
    // @ts-expect-error
    view: viewMatch?.route.view,
    // @ts-expect-error
    panel: panelMatch?.route.panel,
  };
  console.log(router, matches, activeLocation);
  const dataRouterContext = React.useMemo(() => {
    const navigator: RouteNavigator = new DefaultRouteNavigator(router);
    return { router, navigator };
  }, [router]);
  return (
    <RouterContext.Provider value={dataRouterContext}>
      <ActiveVkuiLocationContext.Provider children={children} value={activeLocation} />
    </RouterContext.Provider>
  );
}
