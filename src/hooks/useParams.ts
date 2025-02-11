import { RouteContext } from '../contexts';
import { Params } from '@remix-run/router';
import { useThrottledContext } from './useThrottledContext';
import { ModalWithRoot } from '../type';
import { invariant } from '../utils/utils';
import { useHistoryManager } from './useHistoryManager';
import { ViewNavigationRecord } from '../services';

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys];

type AnimatedParts = Pick<ModalWithRoot, 'tab' | 'panel' | 'modal'>;
type NavId = RequireOnlyOne<AnimatedParts>;

/**
 * Checks if the provided `id` matches the previous history record and differs from the current route.
 * Returns the previous record's params if conditions are met, ensuring correct swipe-back animation and proper modal closing.
 */
function getActualRecordParams<T extends string>(
  id: NavId | undefined,
  previousRecord: ViewNavigationRecord | undefined,
  route: ModalWithRoot | undefined,
): Params<T> | undefined {
  if (!id || !previousRecord || !route) {
    return undefined;
  }

  const idKeys = Object.keys(id) as (keyof NavId)[];
  const currentRouteDoesNotMatchId = !idKeys.some((key) => {
    return route[key] === id[key] || id[key] !== previousRecord[key];
  });

  return currentRouteDoesNotMatchId ? previousRecord.params : undefined;
}

export function useParams<T extends string = string>(id?: NavId): Params<T> | undefined {
  const [routeContext] = useThrottledContext(RouteContext);
  invariant(
    routeContext,
    'You can not use useParams hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );

  const historyManager = useHistoryManager();
  const historyStack = historyManager.getHistory();
  const currentPosition = historyManager.getCurrentPosition();
  const previousRecord = currentPosition ? historyStack[currentPosition - 1] : undefined;

  const { route, params } = routeContext.match ?? {};

  return getActualRecordParams<T>(id, previousRecord, route as ModalWithRoot) ?? params;
}
