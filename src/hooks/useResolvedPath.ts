import {
  Path,
  RelativeRoutingType,
  resolveTo,
  To,
  UNSAFE_getPathContributingMatches as getPathContributingMatches,
} from '@remix-run/router';
import { RouterContext } from '../contexts';
import { useContext, useMemo } from 'react';
import { useLocation } from './hooks';

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
