import { useContext, useMemo } from 'react';
import { RouterContext } from '../contexts';
import { invariant } from '../utils/utils';
import { HistoryManager } from '../services';

export function useHistoryManager(): HistoryManager {
  const { viewHistory } = useContext(RouterContext);
  const historyManager = useMemo(() => new HistoryManager(viewHistory), [viewHistory]);

  invariant(
    viewHistory,
    'You can not use useHistoryManager hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );

  return historyManager;
}
