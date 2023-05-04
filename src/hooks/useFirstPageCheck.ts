import { UNSAFE_invariant as invariant } from '@remix-run/router';
import { useContext } from 'react';
import { RouterContext } from '../contexts';

export function useFirstPageCheck(): boolean {
  const routerContext = useContext(RouterContext);
  invariant(routerContext, 'You can not use useFirstPageCheck hook outside of RouteContext. Make sure calling it inside RouterProvider.');
  return routerContext.viewHistory.isFirstPage;
}
