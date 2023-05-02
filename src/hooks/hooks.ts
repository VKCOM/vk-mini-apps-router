import { useContext } from 'react';
import { PopoutContext, RouteContext, RouterContext } from '../contexts';
import { Location, Params, UNSAFE_invariant as invariant } from '@remix-run/router';
import { RouteNavigator } from '../services/routeNavigator.type';

export function useNavigator(): RouteNavigator {
  const routerContext = useContext(RouterContext);
  invariant(routerContext, 'You can not use useNavigator hook outside of RouterContext. Make sure calling it inside RouterProvider.');
  return routerContext.navigator;
}

export function usePanelParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  invariant(routeContext, 'You can not use usePanelParams hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routeContext.panelMatch?.params;
}

export function useModalParams<T extends string = string>(): Params<T> | undefined {
  const routeContext = useContext(RouteContext);
  invariant(routeContext, 'You can not use useModalParams hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routeContext.modalMatch?.params;
}

export function useLocation(): Location {
  const routeContext = useContext(RouteContext);
  invariant(routeContext, 'You can not use useLocation hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routeContext.state.location;
}

export function usePopout(): JSX.Element | null {
  return useContext(PopoutContext).popout;
}
