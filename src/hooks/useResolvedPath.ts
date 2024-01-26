import {
  Path,
  RelativeRoutingType,
  resolveTo,
  To,
  AgnosticRouteMatch
} from '@remix-run/router';
import { RouterContext } from '../contexts';
import { useContext, useMemo } from 'react';
import { useLocation } from './hooks';

/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches<
  T extends AgnosticRouteMatch = AgnosticRouteMatch
  >(matches: T[]) {
  return matches.filter(
    (match, index) =>
      index === 0 || (match.route.path && match.route.path.length > 0)
  );
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/hooks/use-resolved-path
 */
export function useResolvedPath(
  to: To,
  { relative }: { relative?: RelativeRoutingType } = {}
): Path {
  const { router: { state: { matches } } } = useContext(RouterContext);
  const { pathname: locationPathname } = useLocation();

  const routePathnamesJson = JSON.stringify(
    getPathContributingMatches(matches).map((match) => match.pathnameBase)
  );

  return useMemo(
    () =>
      resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        relative === 'path'
      ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
