import { PopoutContext, RouteContext, RouterContext } from '../contexts';
import { Location, Params } from '@remix-run/router';
import { RouteNavigator } from '../services/RouteNavigator.type';
import { useThrottledContext } from './useThrottledContext';
import { ModalWithRoot } from '../type';
import { invariant } from '../utils/utils';
import { useContext } from 'react';

export function useRouteNavigator(): RouteNavigator {
  const routerContext = useContext(RouterContext);
  invariant(
    routerContext,
    'You can not use useNavigator hook outside of RouterContext. Make sure calling it inside RouterProvider.',
  );
  return routerContext.routeNavigator;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys];

type AnimatedParts = Pick<ModalWithRoot, 'tab' | 'panel' | 'modal'>;
type NavId = RequireOnlyOne<AnimatedParts>;

export function useParams<T extends string = string>(id?: NavId): Params<T> | undefined {
  const [routeContext, prevRouteContext] = useThrottledContext(RouteContext);
  invariant(
    routeContext,
    'You can not use useParams hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );
  const match =
    id &&
    prevRouteContext &&
    (Object.keys(id) as unknown as (keyof NavId)[]).every(
      (key) => (routeContext.match?.route as ModalWithRoot)[key] !== id[key],
    ) &&
    (Object.keys(id) as unknown as (keyof NavId)[]).every(
      (key) => (prevRouteContext.match?.route as ModalWithRoot)[key] === id[key],
    )
      ? prevRouteContext.match
      : routeContext.match;
  return match?.params;
}

export function useLocation(): Location {
  const [routeContext] = useThrottledContext(RouteContext);
  invariant(
    routeContext,
    'You can not use useLocation hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );
  return routeContext.state.location;
}

export function usePopout(): JSX.Element | null {
  const [popoutContext] = useThrottledContext(PopoutContext);
  return popoutContext.popout;
}
