import { AgnosticDataRouteMatch, Router } from '@remix-run/router';
import { InternalRouteConfig, ModalWithRoot } from '../type';
import { fillParamsIntoPath, getParamKeys } from './utils';

export function buildPanelPathFromModalMatch(
  match: AgnosticDataRouteMatch,
  router: Router,
): string | undefined {
  const route = match.route as ModalWithRoot & InternalRouteConfig;
  const matchParamsKeys = Object.keys(match.params);
  function rateByParams(route: { path?: string }): number {
    return matchParamsKeys
      .map((key) => Number(Boolean(route.path?.includes(`:${key}`))))
      .reduce((acc, item) => acc + item, 0);
  }
  let panelRoute: (ModalWithRoot & InternalRouteConfig) | undefined;
  let bestRate = -Infinity;

  for (const item of router.routes) {
    const itemTyped = item as ModalWithRoot & InternalRouteConfig;
    if (
      itemTyped.modal ||
      itemTyped.tab !== route.tab ||
      itemTyped.panel !== route.panel ||
      itemTyped.view !== route.view ||
      itemTyped.root !== route.root
    )
      continue;

    const parameters = getParamKeys(itemTyped.path);
    if (!parameters.every((param) => matchParamsKeys.includes(param.replace(':', '')))) continue;

    const rate = rateByParams(itemTyped);
    if (rate >= bestRate) {
      bestRate = rate;
      panelRoute = itemTyped;
    }
  }
  return panelRoute && fillParamsIntoPath(panelRoute.path!, match.params);
}
