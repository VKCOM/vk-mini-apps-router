import { RoutesConfig } from '@vkontakte/vk-mini-apps-router';

export const NO_ROOT = 'no-root';
export const NO_TAB = 'no-tab';
const NO_MODAL = 'no-modal';

function onlyUnique<T extends any>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}

type Unpacked<T> = T extends (infer U)[] ? U : T;

export interface RootButton {
  root: string;
  children: ViewButton[];
}

export interface ViewButton {
  root: string;
  view: string;
  children: PanelButton[];
}

export interface PanelButton {
  root: string;
  view: string;
  panel: string;
  children: TabButton[];
}

export interface TabButton {
  root: string;
  view: string;
  panel: string;
  tab: string;
  children: ModalButton[];
}

export interface ModalButton {
  root: string;
  view: string;
  panel: string;
  tab: string;
  modal: string;
}

type RoutePartial = Unpacked<ReturnType<RoutesConfig['getRoutes']>>;
type RouteFull = Required<Omit<RoutePartial, 'path'>>;

export function completeRoutes(routes: RoutePartial[]): RouteFull[] {
  return routes.map((route) => ({
    ...route,
    root: route.root || NO_ROOT,
    tab: route.tab || NO_TAB,
    modal: route.modal || NO_MODAL,
  }));
}

export function arrayToTree(routes: RouteFull[]): RootButton[] {
  return routes
    .map(({ root }) => root)
    .filter(onlyUnique)
    .map((rootName): RootButton => ({
      root: rootName,
      children: routes
        .filter(({ root }) => root === rootName)
        .map(({ view }) => view)
        .filter(onlyUnique)
        .map((viewName): ViewButton => ({
          root: rootName,
          view: viewName,
          children: routes
            .filter(({ root, view }) => root === rootName && view === viewName)
            .map(({ panel }) => panel)
            .filter(onlyUnique)
            .map((panelName): PanelButton => ({
              root: rootName,
              view: viewName,
              panel: panelName,
              children: routes
                .filter(({ root, view, panel }) => root === rootName && view === viewName && panel === panelName)
                .map(({ tab }) => tab)
                .filter(onlyUnique)
                .map((tabName): TabButton => ({
                  root: rootName,
                  view: viewName,
                  panel: panelName,
                  tab: tabName,
                  children: routes
                    .filter(({ root, view, panel, tab }) => root === rootName && view === viewName && panel === panelName && tab === tabName)
                    .map(({ modal }) => modal)
                    .filter((modal) => modal !== NO_MODAL)
                    .filter(onlyUnique)
                    .map((modal) => ({
                      root: rootName,
                      view: viewName,
                      panel: panelName,
                      tab: tabName,
                      modal,
                    })),
                })),
            })),
        })),
    }));
}