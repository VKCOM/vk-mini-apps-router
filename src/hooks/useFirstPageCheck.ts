import { UNSAFE_invariant as invariant } from '@remix-run/router';
import { RouterContext } from '../contexts';
import { useThrottledContext } from './useThrottledContext';

export function useFirstPageCheck(): boolean {
  const [routerContext] = useThrottledContext(RouterContext);
  invariant(routerContext, 'You can not use useFirstPageCheck hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routerContext.viewHistory.isFirstPage;
}
