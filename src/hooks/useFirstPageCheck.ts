import { useContext } from 'react';
import { RouterContext } from '../contexts';
import { invariant } from '../utils/utils';

export function useFirstPageCheck(): boolean {
  const routerContext = useContext(RouterContext);
  invariant(
    routerContext,
    'You can not use useFirstPageCheck hook outside of RouteContext. Make sure calling it inside RouterProvider.',
  );
  return routerContext.viewHistory.isFirstPage;
}
