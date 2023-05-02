import { useContext } from 'react';
import { RouteContext } from '../contexts';
import { STATE_KEY_SHOW_MODAL } from '../const';
import { usePopout } from './hooks';

export interface ActiveVkuiLocationObject {
  root?: string;
  view?: string;
  panel?: string;
  modal?: string;
  hasOverlay?: boolean;
  panelsHistory?: string[];
}

export function useActiveVkuiLocation(): ActiveVkuiLocationObject {
  const routeContext = useContext(RouteContext);
  const popout = usePopout();
  const modal = routeContext.state.location.state?.[STATE_KEY_SHOW_MODAL] ?? routeContext.modalMatch?.route.modal;
  return {
    root: routeContext.rootMatch?.route.root,
    view: routeContext.viewMatch?.route.view,
    panel: routeContext.panelMatch?.route.panel,
    modal,
    hasOverlay: Boolean(modal || popout),
    panelsHistory: routeContext.panelsHistory,
  };
}