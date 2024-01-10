import { RouterContext } from '../contexts';
import { invariant } from '../utils/utils';
import { useThrottledContext } from './useThrottledContext';

export function useFirstPageCheck(): boolean {
  const [routerContext] = useThrottledContext(RouterContext);
  invariant(
    routerContext,
    'You can not use useFirstPageCheck hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );
  return routerContext.viewHistory.isFirstPage;
}
