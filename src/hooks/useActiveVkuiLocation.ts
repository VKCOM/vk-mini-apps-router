import { ActiveVkuiLocationObject } from '../type';
import { useContext } from 'react';
import { RouteContext } from '../contexts';

export function useActiveVkuiLocation(): ActiveVkuiLocationObject {
  const routeContext = useContext(RouteContext);
  return {
    root: routeContext.rootMatch?.route.root,
    view: routeContext.viewMatch?.route.view,
    panel: routeContext.panelMatch?.route.panel,
    modal: routeContext.state.location.state?.showModal ?? routeContext.modalMatch?.route.modal,
    panelsHistory: routeContext.panelsHistory,
  };
}