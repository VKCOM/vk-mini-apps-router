import { ActiveVkuiLocationObject } from '../type';
import { useContext } from 'react';
import { RouteContext } from '../contexts';
import { STATE_KEY_SHOW_MODAL } from '../const';

export function useActiveVkuiLocation(): ActiveVkuiLocationObject {
  const routeContext = useContext(RouteContext);
  return {
    root: routeContext.rootMatch?.route.root,
    view: routeContext.viewMatch?.route.view,
    panel: routeContext.panelMatch?.route.panel,
    modal: routeContext.state.location.state?.[STATE_KEY_SHOW_MODAL] ?? routeContext.modalMatch?.route.modal,
    panelsHistory: routeContext.panelsHistory,
  };
}