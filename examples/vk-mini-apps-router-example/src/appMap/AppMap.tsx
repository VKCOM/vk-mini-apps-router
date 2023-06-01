import { Button, Group, ButtonProps, Header } from '@vkontakte/vkui';
import { routes } from '../routes';
import './AppMap.css';
import { arrayToTree, completeRoutes, ModalButton, NO_ROOT, NO_TAB, PanelButton, RootButton, TabButton, ViewButton } from './appMapHelpers';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

type ActiveLocation = ReturnType<typeof useActiveVkuiLocation>;

function exactRouteMatch(
  route: PanelButton | TabButton | ModalButton,
  location: ActiveLocation
): boolean {
  const isSameTab = 'tab' in route && (route.tab === location.tab || (route.tab === NO_TAB && !location.tab));
  return Boolean(('modal' in route && route.modal === location.modal && isSameTab && route.panel === location.panel)
  || (!('modal' in route) && !location.modal && isSameTab && route.panel === location.panel)
  || (!('tab' in route) && !location.modal && !location.tab && route.panel === location.panel))
}

function partialRouteMatch(
  route: RootButton | ViewButton | PanelButton | TabButton,
  location: ActiveLocation
): boolean {
  return Boolean(('root' in route && !('view' in route) && route.root === location.root)
    || ('view' in route && !('panel' in route) && route.view === location.view)
    || ('panel' in route && !('tab' in route) && route.panel === location.panel)
    || ('tab' in route && route.tab === location.tab))
}

function getMode(
  route: RootButton | ViewButton | PanelButton | TabButton | ModalButton,
  location: ActiveLocation
): ButtonProps['mode'] {
  const exactMatch = ('panel' in route) && exactRouteMatch(route, location);
  const partialMatch = !('modal' in route) && partialRouteMatch(route, location);
  return exactMatch ? 'primary' : partialMatch ? 'outline' : 'secondary';
}

function renderRoot(root: RootButton, location: ActiveLocation): JSX.Element {
  return (
    <div className="AppMapRoot" key={root.root}>
      {root.root !== NO_ROOT && <Button disabled={true} mode={getMode(root, location)} className="ButtonRoot">{root.root}</Button>}
      {root.children.length ? root.children.map((view) => renderView(view, location)) : ''}
    </div>
  );
}

function renderView(view: ViewButton, location: ActiveLocation): JSX.Element {
  return (
    <div className="AppMapView" key={view.view}>
      <Button disabled={true} mode={getMode(view, location)} className="ButtonView">{view.view}</Button>
      {view.children.length ? view.children.map((panel) => renderPanel(panel, location)) : ''}
    </div>
  )
}

function renderPanel(panel: PanelButton, location: ActiveLocation): JSX.Element {
  return (
    <div className="AppMapPanel" key={panel.panel}>
      <Button disabled={true} mode={getMode(panel, location)} className="ButtonPanel">{panel.panel}</Button>
      {panel.children.length ? panel.children.map((tab) => renderTab(tab, location)) : ''}
    </div>
  )
}

function renderTab(tab: TabButton, location: ActiveLocation): JSX.Element {
  return (
    <div className="AppMapTab" key={tab.tab}>
      {tab.tab !== NO_TAB && <Button disabled={true} mode={getMode(tab, location)} className="ButtonTab">{tab.tab}</Button>}
      {tab.children.length ? tab.children.map((modal) => renderModal(modal, location)) : ''}
    </div>
  )
}

function renderModal(modal: ModalButton, location: ActiveLocation): JSX.Element {
  return (
    <Button disabled={true} mode={getMode(modal, location)} className="ButtonModal" key={modal.modal}>{modal.modal}</Button>
  )
}

export const AppMap = () => {
  const location = useActiveVkuiLocation();
  return (
    <Group className="AppMap" header={<Header mode="secondary">Карта навигации в приложении</Header>}>
      {arrayToTree(completeRoutes(routes.getRoutes())).map((root) => renderRoot(root, location as any))}
    </Group>
  )
}
