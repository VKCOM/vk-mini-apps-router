import {
  createHashRouter,
  createModal,
  createPanel,
  createRoot,
  createTab,
  createView,
  RoutesConfig,
  RouteLeaf,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
} as const;

export enum HOME_PANEL_MODALS {
  USER = 'user_modal',
  ONBOARDING_1 = 'onboarding_1',
  ONBOARDING_2 = 'onboarding_2',
  ONBOARDING_3 = 'onboarding_3',
}

export enum PERSIK_PANEL_MODALS {
  PERSIK = 'persik_modal',
}

export const EMPTY_VIEW = 'empty_view';

export enum EMPTY_VIEW_PANELS {
  EMPTY = 'empty',
}

export const ALTERNATIVE_ROOT = 'alternative_root';

export const ALTERNATIVE_VIEW = 'alternative_view';

export enum ALTERNATIVE_VIEW_PANELS {
  ALTERNATIVE = 'alternative',
}

export enum ALTERNATIVE_PANEL_TABS {
  TAB_1 = 'tab1',
  TAB_2 = 'tab2',
  TAB_3 = 'tab3',
}

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', [
        createModal(HOME_PANEL_MODALS.USER, `/${HOME_PANEL_MODALS.USER}`),
        createModal(HOME_PANEL_MODALS.ONBOARDING_1, `/${HOME_PANEL_MODALS.ONBOARDING_1}`),
        createModal(HOME_PANEL_MODALS.ONBOARDING_2, `/${HOME_PANEL_MODALS.ONBOARDING_2}`),
        createModal(HOME_PANEL_MODALS.ONBOARDING_3, `/${HOME_PANEL_MODALS.ONBOARDING_3}`),
      ]),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}`, [
        createModal(PERSIK_PANEL_MODALS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}/${PERSIK_PANEL_MODALS.PERSIK}`),
        createModal(HOME_PANEL_MODALS.USER, `/${DEFAULT_VIEW_PANELS.PERSIK}/${HOME_PANEL_MODALS.USER}`),
      ]),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion`, [
        createModal(PERSIK_PANEL_MODALS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion/${PERSIK_PANEL_MODALS.PERSIK}/:em`, ['em', 'emotion'] as const),
        createModal(HOME_PANEL_MODALS.USER, `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion/${HOME_PANEL_MODALS.USER}`, ['emotion'] as const),
      ], ['emotion'] as const),
    ]),
    createView(EMPTY_VIEW, [
      createPanel(EMPTY_VIEW_PANELS.EMPTY, '/empty'),
    ]),
  ]),
  createRoot(ALTERNATIVE_ROOT, [
    createView(ALTERNATIVE_VIEW, [
      createPanel(ALTERNATIVE_VIEW_PANELS.ALTERNATIVE, '/alternative', [
        createTab(ALTERNATIVE_PANEL_TABS.TAB_1, `/alternative/${ALTERNATIVE_PANEL_TABS.TAB_1}`),
        createTab(ALTERNATIVE_PANEL_TABS.TAB_2, `/alternative/${ALTERNATIVE_PANEL_TABS.TAB_2}`),
        createTab(ALTERNATIVE_PANEL_TABS.TAB_3, `/alternative/${ALTERNATIVE_PANEL_TABS.TAB_3}`, [
          createModal(PERSIK_PANEL_MODALS.PERSIK, `/alternative/${ALTERNATIVE_PANEL_TABS.TAB_3}/${PERSIK_PANEL_MODALS.PERSIK}`),
          createModal(HOME_PANEL_MODALS.USER, `/alternative/${ALTERNATIVE_PANEL_TABS.TAB_3}/${HOME_PANEL_MODALS.USER}`),
        ]),
      ]),
    ]),
  ]),
]);

export const hierarchy: RouteLeaf[] = [{
  path: '/',
  children: [
    {
      path: `/${DEFAULT_VIEW_PANELS.PERSIK}`,
      children: [{ path: `/${DEFAULT_VIEW_PANELS.PERSIK}/${PERSIK_PANEL_MODALS.PERSIK}` }],
    }, {
      path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion`,
      children: [{ path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion/${PERSIK_PANEL_MODALS.PERSIK}` }],
    },
  ],
}];

export const router = createHashRouter(routes.getRoutes());

// export const router = createHashRouter([
//   {
//     path: '/',
//     panel: DEFAULT_VIEW_PANELS.HOME,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${HOME_PANEL_MODALS.USER}`,
//     modal: HOME_PANEL_MODALS.USER,
//     panel: DEFAULT_VIEW_PANELS.HOME,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${DEFAULT_VIEW_PANELS.PERSIK}`,
//     panel: DEFAULT_VIEW_PANELS.PERSIK,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${DEFAULT_VIEW_PANELS.PERSIK}/${PERSIK_PANEL_MODALS.PERSIK}`,
//     modal: PERSIK_PANEL_MODALS.PERSIK,
//     panel: DEFAULT_VIEW_PANELS.PERSIK,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${DEFAULT_VIEW_PANELS.PERSIK}/${HOME_PANEL_MODALS.USER}`,
//     modal: HOME_PANEL_MODALS.USER,
//     panel: DEFAULT_VIEW_PANELS.PERSIK,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion`,
//     panel: DEFAULT_VIEW_PANELS.PERSIK,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion/${PERSIK_PANEL_MODALS.PERSIK}`,
//     modal: PERSIK_PANEL_MODALS.PERSIK,
//     panel: DEFAULT_VIEW_PANELS.PERSIK,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: `/${DEFAULT_VIEW_PANELS.PERSIK}/:emotion/${HOME_PANEL_MODALS.USER}`,
//     modal: HOME_PANEL_MODALS.USER,
//     panel: DEFAULT_VIEW_PANELS.PERSIK,
//     view: DEFAULT_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: '/empty',
//     panel: EMPTY_VIEW_PANELS.EMPTY,
//     view: EMPTY_VIEW,
//     root: DEFAULT_ROOT,
//   },
//   {
//     path: '/alternative',
//     panel: ALTERNATIVE_VIEW_PANELS.ALTERNATIVE,
//     view: ALTERNATIVE_VIEW,
//     root: ALTERNATIVE_ROOT,
//   },
// ]);
