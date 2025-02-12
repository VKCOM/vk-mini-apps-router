import { ActiveVkuiLocationObject, useActiveVkuiLocation } from '../hooks/useActiveVkuiLocation';
import { RouteNavigator } from '../services/RouteNavigator.type';
import { ComponentType } from 'react';
import { getDisplayName } from '../utils/utils';
import { usePopout, useRouteNavigator } from '../hooks/hooks';
import { Params } from '@remix-run/router';
import { useFirstPageCheck } from '../hooks/useFirstPageCheck';
import { SetURLSearchParams, useSearchParams } from '../hooks/useSearchParams';
import { useParams } from '../hooks/useParams';

type RouterProps = {
  location: ActiveVkuiLocationObject;
  routeNavigator: RouteNavigator;
  popout: JSX.Element | null;
  isFirstPage: boolean;
  params?: Params;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

/**
 * HOC для добавления свойств
 *
 * location: {@link ActiveVkuiLocationObject}
 *
 * routeNavigator: {@link RouteNavigator}
 *
 * popout: {@link JSX.Element}
 *
 * params: {@link Params}
 *
 * isFirstPage: boolean
 *
 * searchParams: {@link URLSearchParams}
 *
 * setSearchParams: {@link SetURLSearchParams}
 *
 * в переданный компонент
 *
 * ```typescript
 * export default withRouter(App);
 * ```
 * @param Component
 */
export function withRouter<T extends RouterProps>(
  Component: ComponentType<T>,
): ComponentType<Omit<T, keyof RouterProps>> {
  function WithRouter(props: Omit<T, keyof RouterProps>) {
    const [searchParams, setSearchParams] = useSearchParams();
    const routerProps: RouterProps = {
      routeNavigator: useRouteNavigator(),
      location: useActiveVkuiLocation(),
      popout: usePopout(),
      params: useParams(),
      isFirstPage: useFirstPageCheck(),
      searchParams,
      setSearchParams,
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const propsWithRouter: T = {
      ...props,
      ...routerProps,
    } as T;
    return <Component {...propsWithRouter} />;
  }

  WithRouter.displayName = `WithRouter(${getDisplayName(Component)})`;
  return WithRouter;
}
