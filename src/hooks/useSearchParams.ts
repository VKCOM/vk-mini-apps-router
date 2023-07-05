import { useLocation } from './hooks';
import { RelativeRoutingType, UNSAFE_warning as warning } from '@remix-run/router';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { createSearchParams, getSearchParamsForLocation, URLSearchParamsInit } from '../utils/createSearchParams';
import { RouterContext } from '../contexts';

export interface NavigateOptions {
  replace?: boolean;
  state?: any;
  preventScrollReset?: boolean;
  relative?: RelativeRoutingType;
}

export type SetURLSearchParams = (
  nextInit?:
  | URLSearchParamsInit
  | ((prev: URLSearchParams) => URLSearchParamsInit),
  navigateOpts?: NavigateOptions
) => void;

/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export function useSearchParams(
  defaultInit?: URLSearchParamsInit
): [URLSearchParams, SetURLSearchParams] {
  warning(
    typeof URLSearchParams !== 'undefined',
    'You cannot use the `useSearchParams` hook in a browser that does not ' +
    'support the URLSearchParams API. If you need to support Internet ' +
    'Explorer 11, we recommend you load a polyfill such as ' +
    'https://github.com/ungap/url-search-params\n\n' +
    'If you\'re unsure how to load polyfills, we recommend you check out ' +
    'https://polyfill.io/v3/ which provides some recommendations about how ' +
    'to load polyfills only for users that need them, instead of for every ' +
    'user.'
  );

  let defaultSearchParamsRef = useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = useRef(false);

  let location = useLocation();
  let searchParams = useMemo(
    () =>
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      getSearchParamsForLocation(
        location.search,
        hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current
      ),
    [location.search]
  );

  let router = useContext(RouterContext).router;
  let setSearchParams = useCallback<SetURLSearchParams>(
    (nextInit, navigateOptions) => {
      const newSearchParams = createSearchParams(
        typeof nextInit === 'function' ? nextInit(searchParams) : nextInit
      );
      hasSetSearchParamsRef.current = true;
      router.navigate(`${location.pathname}?${newSearchParams}`, navigateOptions);
    },
    [router, searchParams, location.pathname]
  );

  return [searchParams, setSearchParams];
}
