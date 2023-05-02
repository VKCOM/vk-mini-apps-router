import { ActiveVkuiLocationObject, useActiveVkuiLocation } from '../hooks/useActiveVkuiLocation';
import { RouteNavigator } from '../services/routeNavigator.type';
import { ComponentType, useContext } from 'react';
import { RouterContext } from '../contexts';
import { getDisplayName } from '../utils/utils';
import { usePopout } from '../hooks/hooks';

type RouterProps = {
  location: ActiveVkuiLocationObject;
  navigator: RouteNavigator;
  popout: JSX.Element | null;
};

/**
 * HOC для добавления свойств
 *
 * location:{@link ActiveVkuiLocationObject}
 * navigator:{@link RouteNavigator}
 *
 * в переданный компонент
 *
 * ```typescript
 * export default withRouter(App);
 * ```
 * @param Component
 */
export function withRouter<T extends RouterProps>(Component: ComponentType<T>): ComponentType<Omit<T, keyof RouterProps>> {
  function WithRouter(props: Omit<T, keyof RouterProps>) {
    const routerContext = useContext(RouterContext);
    const routerProps: RouterProps = {
      navigator: routerContext.navigator,
      location: useActiveVkuiLocation(),
      popout: usePopout(),
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
