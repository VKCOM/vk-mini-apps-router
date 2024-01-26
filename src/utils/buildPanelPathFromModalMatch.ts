import { AgnosticDataRouteMatch, Router } from '@remix-run/router';
import { InternalRouteConfig, ModalWithRoot } from '../type';
import { fillParamsIntoPath, getParamKeys } from './utils';

export function buildPanelPathFromModalMatch(match: AgnosticDataRouteMatch, router: Router): string | undefined {
  const route = match.route as ModalWithRoot & InternalRouteConfig;
  function rateByParams(route: { path?: string }): number {
    return Object.keys(match.params)
      .map((key) => Number(Boolean(route.path?.includes(`:${key}`))))
      .reduce((acc, item) => acc + item, 0);
  }
  const panelRoute = router.routes.filter((item) => {
    const itemTyped = item as ModalWithRoot & InternalRouteConfig;
    const parameters = getParamKeys(itemTyped.path).map((param) => param.replace(':', ''));
    return !itemTyped.modal &&
      itemTyped.tab === route.tab &&
      itemTyped.panel === route.panel &&
      itemTyped.view === route.view &&
      itemTyped.root === route.root &&
      parameters.every((param) => Object.keys(match.params).includes(param));
  }).sort((a, b) => rateByParams(a) - rateByParams(b))
    .pop();
  return panelRoute && fillParamsIntoPath(panelRoute.path!, match.params);
}
